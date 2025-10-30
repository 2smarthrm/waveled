 

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const hpp = require('hpp');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const { body, param, query, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const morgan = require('morgan');
const { nanoid } = require('nanoid');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// --------------------------------- ENV ---------------------------------------
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/waveled';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(48).toString('hex');
const COOKIE_NAME = process.env.COOKIE_NAME || 'wl_sid';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 'localhost';
const COOKIE_SECURE = String(process.env.COOKIE_SECURE || 'false') === 'true';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const ENC_KEY = Buffer.from(process.env.ENC_KEY_BASE64 || '', 'base64'); // 32 bytes

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (ENC_KEY.length !== 32) {
  console.error('❌ ENC_KEY_BASE64 inválida (requer 32 bytes Base64).');
  process.exit(1);
}

// Nodemailer transporter
let transporter;
if (process.env.USE_SENDMAIL === 'true') {
  transporter = nodemailer.createTransport({ sendmail: true, newline: 'unix', path: '/usr/sbin/sendmail' });
} else {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

// --------------------------------- APP ---------------------------------------
const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());
app.use('/uploads', express.static(path.resolve(UPLOAD_DIR)));

// ------------------------------- DB & SESSION --------------------------------
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB ligado'))
  .catch(err => { console.error('❌ MongoDB erro:', err); process.exit(1); });

app.use(session({
  name: COOKIE_NAME,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'waveled_sessions',
    ttl: 60 * 60 * 8, // 8 horas
    touchAfter: 60 * 10
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    domain: COOKIE_DOMAIN === 'localhost' ? undefined : COOKIE_DOMAIN,
    maxAge: 1000 * 60 * 60 * 8 // 8h
  }
}));

// -------------------------------- Utils --------------------------------------
const ok = (res, data, code = 200) => res.status(code).json({ ok: true, data });
const err = (res, message = 'Erro', code = 400, issues = null) =>
  res.status(code).json({ ok: false, error: message, issues });

const requireAuth = (roles = []) => (req, res, next) => {
  if (!req.session.user) return err(res, 'Não autenticado', 401);
  if (roles.length && !roles.includes(req.session.user.role)) return err(res, 'Sem permissões', 403);
  next();
};

const limiterStrict = rateLimit({ windowMs: 10 * 60 * 1000, max: 80 });
const limiterAuth = rateLimit({ windowMs: 10 * 60 * 1000, max: 50 });
const limiterLogin = rateLimit({ windowMs: 15 * 60 * 1000, max: 15 });
const limiterPublicPost = rateLimit({ windowMs: 5 * 60 * 1000, max: 40 });

const audit = (action) => (req, res, next) => {
  res.on('finish', () => {
    WaveledAudit.create({
      wl_actor: req.session?.user?.email || 'public',
      wl_action: action,
      wl_details: { method: req.method, path: req.originalUrl, status: res.statusCode },
      wl_ip: req.ip
    }).catch(()=>{});
  });
  next();
};

// AES-256-GCM helpers para PII
const encrypt = (obj) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENC_KEY, iv);
  const buf = Buffer.from(JSON.stringify(obj), 'utf8');
  const enc = Buffer.concat([cipher.update(buf), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString('base64'), tag: tag.toString('base64'), data: enc.toString('base64') };
};
const decrypt = (blob) => {
  const iv = Buffer.from(blob.iv, 'base64');
  const tag = Buffer.from(blob.tag, 'base64');
  const data = Buffer.from(blob.data, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENC_KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return JSON.parse(dec.toString('utf8'));
};

// Multer (uploads de imagem)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    cb(null, `${Date.now()}_${nanoid(8)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 12 },
  fileFilter: (req, file, cb) => {
    if (/image\/(png|jpe?g|webp|gif|svg\+xml)/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo de ficheiro inválido'));
  }
});

// -------------------------------- Schemas ------------------------------------
const { Schema } = mongoose;

const UserSchema = new Schema({
  wl_name: { type: String, required: true },
  wl_email: { type: String, required: true, unique: true, index: true },
  wl_password_hash: { type: String, required: true },
  wl_role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
  wl_created_at: { type: Date, default: Date.now },
  wl_active: { type: Boolean, default: true }
}, { collection: 'waveled_users' });

const CategorySchema = new Schema({
  wl_name: { type: String, required: true, unique: true },
  wl_slug: { type: String, required: true, unique: true },
  wl_created_at: { type: Date, default: Date.now }
}, { collection: 'waveled_categories' });

const ProductSchema = new Schema({
  wl_name: { type: String, required: true },
  wl_category: { type: Schema.Types.ObjectId, ref: 'WaveledCategory', required: true },
  wl_description_html: { type: String, default: '' },
  wl_specs_text: { type: String, default: '' },
  wl_datasheet_url: { type: String, default: '' },
  wl_manual_url: { type: String, default: '' },
  wl_sku: { type: String, unique: true, sparse: true },
  wl_images: [{ type: String }],
  wl_featured_general: { type: Boolean, default: false },
  wl_likes: { type: Number, default: 0 },
  wl_created_at: { type: Date, default: Date.now },
  wl_updated_at: { type: Date, default: Date.now }
}, { collection: 'waveled_products' });

ProductSchema.index({ wl_name: 'text', wl_specs_text: 'text' });

const FeaturedHomeSchema = new Schema({
  wl_slots: [{ type: Schema.Types.ObjectId, ref: 'WaveledProduct' }],
  wl_updated_at: { type: Date, default: Date.now }
}, { collection: 'waveled_featured_home' });

const FeaturedProductSchema = new Schema({
  wl_product: { type: Schema.Types.ObjectId, ref: 'WaveledProduct', required: true, unique: true },
  wl_order: { type: Number, default: 0 },
  wl_created_at: { type: Date, default: Date.now }
}, { collection: 'waveled_featured_products' });

const TopListSchema = new Schema({
  wl_scope: { type: String, enum: ['overall', 'category'], required: true },
  wl_category: { type: Schema.Types.ObjectId, ref: 'WaveledCategory' },
  wl_top10: [{ type: Schema.Types.ObjectId, ref: 'WaveledProduct' }],
  wl_top3: [{ type: Schema.Types.ObjectId, ref: 'WaveledProduct' }],
  wl_best: { type: Schema.Types.ObjectId, ref: 'WaveledProduct' },
  wl_updated_at: { type: Date, default: Date.now }
}, { collection: 'waveled_toplists' });

const SuccessCaseSchema = new Schema({
  wl_company_name: { type: String, required: true },
  wl_title: { type: String, required: true },
  wl_description_html: { type: String, default: '' },
  wl_images: [{ type: String }],
  wl_created_at: { type: Date, default: Date.now }
}, { collection: 'waveled_success_cases' });

const MessageSchema = new Schema({
  wl_encrypted_blob: { type: Schema.Types.Mixed, required: true },
  wl_source: { type: String, enum: ['public_form', 'admin_create'], default: 'public_form' },
  wl_created_at: { type: Date, default: Date.now }
}, { collection: 'waveled_messages' });

const AuditSchema = new Schema({
  wl_actor: { type: String },
  wl_action: { type: String, required: true },
  wl_details: { type: Schema.Types.Mixed },
  wl_ip: { type: String },
  wl_at: { type: Date, default: Date.now }
}, { collection: 'waveled_audit' });

// Models
const WaveledUser = mongoose.model('WaveledUser', UserSchema);
const WaveledCategory = mongoose.model('WaveledCategory', CategorySchema);
const WaveledProduct = mongoose.model('WaveledProduct', ProductSchema);
const WaveledFeaturedHome = mongoose.model('WaveledFeaturedHome', FeaturedHomeSchema);
const WaveledFeaturedProduct = mongoose.model('WaveledFeaturedProduct', FeaturedProductSchema);
const WaveledTopList = mongoose.model('WaveledTopList', TopListSchema);
const WaveledSuccessCase = mongoose.model('WaveledSuccessCase', SuccessCaseSchema);
const WaveledMessage = mongoose.model('WaveledMessage', MessageSchema);
const WaveledAudit = mongoose.model('WaveledAudit', AuditSchema);

// -------------------------------- Seed mínimo --------------------------------
(async () => {
  const adminEmail = 'admin@waveled.pt';
  const exists = await WaveledUser.findOne({ wl_email: adminEmail });
  if (!exists) {
    const hash = await bcrypt.hash('ChangeMe!2025', 12);
    await WaveledUser.create({ wl_name: 'Admin', wl_email: adminEmail, wl_password_hash: hash, wl_role: 'admin' });
    console.log('👤 Admin padrão criado: admin@waveled.pt / ChangeMe!2025');
  }
})().catch(()=>{});

// ------------------------------ Valid & Helpers ------------------------------
const validate = (req, res, next) => {
  const v = validationResult(req);
  if (!v.isEmpty()) return err(res, 'Validação falhou', 422, v.array());
  next();
};

const ensureCategory = async (nameOrId) => {
  if (!nameOrId) throw new Error('Categoria inválida');
  if (mongoose.isValidObjectId(nameOrId)) return await WaveledCategory.findById(nameOrId);
  const slug = String(nameOrId).toLowerCase().replace(/[^\w]+/g, '-');
  let cat = await WaveledCategory.findOne({ wl_slug: slug });
  if (!cat) cat = await WaveledCategory.create({ wl_name: nameOrId, wl_slug: slug });
  return cat;
};

// ============================== AUTH (SESSÕES) ===============================
// USO: POST /api/auth/login  BODY: { email, password }  => cria sessão (cookie httpOnly)
// USO: POST /api/auth/logout => destroi sessão
// USO: GET  /api/auth/status => { authenticated: true|false, user? }
// USO: POST /api/auth/users (admin) => cria utilizadores
app.post('/api/auth/login',
  limiterLogin,
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  validate,
  audit('auth.login'),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await WaveledUser.findOne({ wl_email: email, wl_active: true });
    if (!user) return err(res, 'Credenciais inválidas', 401);
    const okPass = await bcrypt.compare(password, user.wl_password_hash);
    if (!okPass) return err(res, 'Credenciais inválidas', 401);
    req.session.user = { id: String(user._id), email: user.wl_email, role: user.wl_role, name: user.wl_name };
    ok(res, { authenticated: true, role: user.wl_role, name: user.wl_name });
  }
);

app.post('/api/auth/logout',
  limiterAuth,
  audit('auth.logout'),
  (req, res) => {
    req.session.destroy(() => {
      res.clearCookie(COOKIE_NAME);
      ok(res, { authenticated: false });
    });
  }
);

app.get('/api/auth/status',
  limiterStrict,
  (req, res) => {
    if (!req.session.user) return ok(res, { authenticated: false });
    ok(res, { authenticated: true, user: req.session.user });
  }
);

app.post('/api/auth/users',
  limiterAuth, requireAuth(['admin']),
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 8 }),
  body('role').isIn(['admin', 'editor', 'viewer']),
  validate,
  audit('users.create'),
  async (req, res) => {
    const { name, email, password, role } = req.body;
    const exists = await WaveledUser.findOne({ wl_email: email });
    if (exists) return err(res, 'Email já existe', 409);
    const hash = await bcrypt.hash(password, 12);
    const u = await WaveledUser.create({ wl_name: name, wl_email: email, wl_password_hash: hash, wl_role: role });
    ok(res, { id: u._id });
  }
);

app.get('/api/users',
  limiterAuth, requireAuth(['admin']),
  audit('users.list'),
  async (req, res) => {
    const users = await WaveledUser.find({}, { wl_password_hash: 0 }).sort({ wl_created_at: -1 });
    ok(res, users);
  }
);

// ========================== FORM PÚBLICO / MENSAGENS =========================
// USO: POST /api/public/contact  (público) — guarda encriptado + envia email
app.post('/api/public/contact',
  limiterPublicPost,
  body('tipo').isIn(['info', 'quote']),
  body('nome').isString().isLength({ min: 2 }),
  body('telefone').isString().isLength({ min: 6 }),
  body('email').isEmail(),
  body('solucao').isIn(['led-rental', 'led-fixed', 'led-iluminacao', 'outro']),
  body('datas').isString().isLength({ min: 2 }),
  body('local').isString().isLength({ min: 2 }),
  body('dimensoes').isString().isLength({ min: 1 }),
  body('orcamentoPrevisto').optional().isString(),
  body('precisaMontagem').isIn(['sim', 'nao']),
  body('mensagem').isString().isLength({ min: 5 }),
  body('consent').isBoolean().equals(true),
  validate,
  audit('public.contact'),
  async (req, res) => {
    const payload = {
      tipo: req.body.tipo,
      nome: req.body.nome,
      telefone: req.body.telefone,
      email: req.body.email,
      solucao: req.body.solucao,
      datas: req.body.datas,
      local: req.body.local,
      dimensoes: req.body.dimensoes,
      orcamentoPrevisto: req.body.orcamentoPrevisto || '',
      precisaMontagem: req.body.precisaMontagem,
      mensagem: req.body.mensagem,
      consent: req.body.consent === true
    };
    const blob = encrypt(payload);
    await WaveledMessage.create({ wl_encrypted_blob: blob, wl_source: 'public_form' });

    // tenta enviar email (não falha a request se der erro)
    const html = `
      <h2>Novo pedido (${payload.tipo})</h2>
      <p><strong>Nome:</strong> ${payload.nome}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Telefone:</strong> ${payload.telefone}</p>
      <p><strong>Solução:</strong> ${payload.solucao}</p>
      <p><strong>Datas:</strong> ${payload.datas}</p>
      <p><strong>Local:</strong> ${payload.local}</p>
      <p><strong>Dimensões:</strong> ${payload.dimensoes}</p>
      <p><strong>Orçamento:</strong> ${payload.orcamentoPrevisto || '-'}</p>
      <p><strong>Montagem:</strong> ${payload.precisaMontagem}</p>
      <p><strong>Mensagem:</strong></p>
      <pre>${payload.mensagem}</pre>
    `;
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || '"Waveled" <no-reply@waveled.pt>',
        to: 'comercial@waveled.pt, geral@waveled.pt',
        subject: `Waveled • Novo pedido (${payload.tipo}) de ${payload.nome}`,
        html
      });
    } catch (e) { console.warn('Email falhou:', e.message); }

    ok(res, { received: true });
  }
);

// USO: GET  /api/messages            (admin|editor) — lista IDs e datas (sem dados sensíveis)
// USO: GET  /api/messages?decrypt=1  (admin|editor) — devolve payload desencriptado
// USO: POST /api/messages/admin-create (admin|editor) — regista pedido manualmente (encripta)
app.get('/api/messages',
  limiterAuth, requireAuth(['admin', 'editor']),
  audit('messages.list'),
  async (req, res) => {
    const rows = await WaveledMessage.find({}).sort({ wl_created_at: -1 }).limit(200);
    if (String(req.query.decrypt || '') === '1') {
      const out = rows.map(r => ({ id: r._id, created_at: r.wl_created_at, source: r.wl_source, payload: decrypt(r.wl_encrypted_blob) }));
      ok(res, out);
    } else {
      ok(res, rows.map(r => ({ id: r._id, created_at: r.wl_created_at, source: r.wl_source })));
    }
  }
);

app.post('/api/messages/admin-create',
  limiterAuth, requireAuth(['admin', 'editor']),
  body('tipo').isIn(['info', 'quote']),
  body('nome').isString().isLength({ min: 2 }),
  body('telefone').isString().isLength({ min: 6 }),
  body('email').isEmail(),
  body('solucao').isIn(['led-rental', 'led-fixed', 'led-iluminacao', 'outro']),
  body('mensagem').isString().isLength({ min: 5 }),
  body('sendEmail').optional().isBoolean(),
  validate,
  audit('messages.adminCreate'),
  async (req, res) => {
    const payload = {
      tipo: req.body.tipo,
      nome: req.body.nome,
      telefone: req.body.telefone,
      email: req.body.email,
      solucao: req.body.solucao,
      datas: req.body.datas || '',
      local: req.body.local || '',
      dimensoes: req.body.dimensoes || '',
      orcamentoPrevisto: req.body.orcamentoPrevisto || '',
      precisaMontagem: req.body.precisaMontagem || 'sim',
      mensagem: req.body.mensagem,
      consent: true
    };
    const blob = encrypt(payload);
    await WaveledMessage.create({ wl_encrypted_blob: blob, wl_source: 'admin_create' });

    if (req.body.sendEmail) {
      try {
        await transporter.sendMail({
          from: process.env.MAIL_FROM || '"Waveled" <no-reply@waveled.pt>',
          to: 'comercial@waveled.pt, geral@waveled.pt',
          subject: `Waveled • Registo interno (${payload.tipo}) de ${payload.nome}`,
          html: `<pre>${JSON.stringify(payload, null, 2)}</pre>`
        });
      } catch (e) { console.warn('Email falhou:', e.message); }
    }
    ok(res, { saved: true });
  }
);

// =============================== PRODUTOS (CRUD) =============================
// USO: POST /api/products  (admin|editor) — multipart/form-data (fields: name, category, ... , images[])
// USO: GET  /api/products?q=txt&category=ID|Nome (admin|editor|viewer)
// USO: GET  /api/products/:id (admin|editor|viewer)
// USO: PUT  /api/products/:id (admin|editor) — multipart (envia só o que alterar)
// USO: DELETE /api/products/:id (admin)
// USO NOVO: POST /api/products/:id/like   (admin|editor|viewer) — incrementa 1
//           POST /api/products/:id/unlike (admin|editor|viewer) — decrementa (mín 0)
app.post('/api/products',
  limiterAuth, requireAuth(['admin', 'editor']),
  upload.array('images', 12),
  body('name').isString().isLength({ min: 2 }),
  body('category').isString().isLength({ min: 1 }),
  body('description_html').optional().isString(),
  body('specs_text').optional().isString(),
  body('datasheet_url').optional().isURL().isLength({ max: 2048 }),
  body('manual_url').optional().isURL().isLength({ max: 2048 }),
  body('sku').optional().isString().isLength({ max: 64 }),
  validate,
  audit('products.create'),
  async (req, res) => {
    const cat = await ensureCategory(req.body.category);
    const images = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);
    const p = await WaveledProduct.create({
      wl_name: req.body.name,
      wl_category: cat._id,
      wl_description_html: req.body.description_html || '',
      wl_specs_text: req.body.specs_text || '',
      wl_datasheet_url: req.body.datasheet_url || '',
      wl_manual_url: req.body.manual_url || '',
      wl_sku: req.body.sku || undefined,
      wl_images: images
    });
    ok(res, { id: p._id }, 201);
  }
);

app.get('/api/products',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  query('q').optional().isString(),
  query('category').optional().isString(),
  validate,
  audit('products.list'),
  async (req, res) => {
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (category) {
      const cat = await ensureCategory(category);
      filter.wl_category = cat._id;
    }
    const items = await WaveledProduct.find(filter).sort({ wl_created_at: -1 }).limit(200).populate('wl_category');
    ok(res, items);
  }
);

app.get('/api/products/:id',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  param('id').isMongoId(), validate,
  audit('products.single'),
  async (req, res) => {
    const p = await WaveledProduct.findById(req.params.id).populate('wl_category');
    if (!p) return err(res, 'Produto não encontrado', 404);
    ok(res, p);
  }
);

app.put('/api/products/:id',
  limiterAuth, requireAuth(['admin', 'editor']),
  upload.array('images', 12),
  param('id').isMongoId(),
  validate,
  audit('products.update'),
  async (req, res) => {
    const p = await WaveledProduct.findById(req.params.id);
    if (!p) return err(res, 'Produto não encontrado', 404);
    if (req.body.name) p.wl_name = req.body.name;
    if (req.body.category) {
      const cat = await ensureCategory(req.body.category);
      p.wl_category = cat._id;
    }
    if (req.body.description_html !== undefined) p.wl_description_html = req.body.description_html;
    if (req.body.specs_text !== undefined) p.wl_specs_text = req.body.specs_text;
    if (req.body.datasheet_url !== undefined) p.wl_datasheet_url = req.body.datasheet_url;
    if (req.body.manual_url !== undefined) p.wl_manual_url = req.body.manual_url;
    if (req.body.sku !== undefined) p.wl_sku = req.body.sku || undefined;
    if (req.files?.length) p.wl_images = p.wl_images.concat(req.files.map(f => `/uploads/${path.basename(f.path)}`));
    p.wl_updated_at = new Date();
    await p.save();
    ok(res, { updated: true });
  }
);

app.delete('/api/products/:id',
  limiterAuth, requireAuth(['admin']),
  param('id').isMongoId(), validate,
  audit('products.delete'),
  async (req, res) => {
    const p = await WaveledProduct.findByIdAndDelete(req.params.id);
    if (!p) return err(res, 'Produto não encontrado', 404);
    ok(res, { deleted: true });
  }
);

// Likes (novo)
app.post('/api/products/:id/like',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  param('id').isMongoId(), validate,
  audit('products.like'),
  async (req, res) => {
    const p = await WaveledProduct.findByIdAndUpdate(req.params.id, { $inc: { wl_likes: 1 } }, { new: true });
    if (!p) return err(res, 'Produto não encontrado', 404);
    ok(res, { likes: p.wl_likes });
  }
);

app.post('/api/products/:id/unlike',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  param('id').isMongoId(), validate,
  audit('products.unlike'),
  async (req, res) => {
    const p = await WaveledProduct.findById(req.params.id);
    if (!p) return err(res, 'Produto não encontrado', 404);
    const newLikes = Math.max(0, (p.wl_likes || 0) - 1);
    p.wl_likes = newLikes;
    await p.save();
    ok(res, { likes: p.wl_likes });
  }
);

// ============================ FEATURED (HOME 4) ==============================
// USO: GET /api/featured/home  (admin|editor|viewer)
// USO: PUT /api/featured/home  (admin) BODY: { "slots": ["prodId1", ...] }  (até 4)
app.get('/api/featured/home',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  audit('featured.home.get'),
  async (req, res) => {
    const doc = await WaveledFeaturedHome.findOne({}).populate('wl_slots');
    ok(res, doc || { wl_slots: [] });
  }
);

app.put('/api/featured/home',
  limiterAuth, requireAuth(['admin']),
  body('slots').isArray({ min: 0, max: 4 }),
  body('slots.*').isMongoId(),
  validate,
  audit('featured.home.set'),
  async (req, res) => {
    const ids = req.body.slots;
    let doc = await WaveledFeaturedHome.findOne({});
    if (!doc) doc = new WaveledFeaturedHome({ wl_slots: [] });
    doc.wl_slots = ids;
    doc.wl_updated_at = new Date();
    await doc.save();
    ok(res, { saved: true });
  }
);

// ========================== FEATURED (LISTA GERAL) ===========================
// USO: POST   /api/featured          (admin) BODY: { "productId": "...", "order": 0 }
// USO: GET    /api/featured          (admin|editor|viewer)
// USO: DELETE /api/featured/:productId (admin)
app.post('/api/featured',
  limiterAuth, requireAuth(['admin']),
  body('productId').isMongoId(),
  body('order').optional().isInt({ min: 0, max: 999 }),
  validate,
  audit('featured.add'),
  async (req, res) => {
    const exists = await WaveledFeaturedProduct.findOne({ wl_product: req.body.productId });
    if (exists) return err(res, 'Já está em destaque', 409);
    await WaveledFeaturedProduct.create({ wl_product: req.body.productId, wl_order: req.body.order || 0 });
    await WaveledProduct.findByIdAndUpdate(req.body.productId, { $set: { wl_featured_general: true } });
    ok(res, { added: true }, 201);
  }
);

app.get('/api/featured',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  audit('featured.list'),
  async (req, res) => {
    const items = await WaveledFeaturedProduct.find({}).sort({ wl_order: 1 }).populate('wl_product');
    ok(res, items);
  }
);

app.delete('/api/featured/:productId',
  limiterAuth, requireAuth(['admin']),
  param('productId').isMongoId(), validate,
  audit('featured.remove'),
  async (req, res) => {
    await WaveledFeaturedProduct.findOneAndDelete({ wl_product: req.params.productId });
    await WaveledProduct.findByIdAndUpdate(req.params.productId, { $set: { wl_featured_general: false } });
    ok(res, { removed: true });
  }
);

// ============================= RELACIONADOS ==================================
// USO: GET /api/products/:id/related (admin|editor|viewer) — 5 relacionados
app.get('/api/products/:id/related',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  param('id').isMongoId(), validate,
  audit('products.related'),
  async (req, res) => {
    const p = await WaveledProduct.findById(req.params.id);
    if (!p) return err(res, 'Produto não encontrado', 404);
    const tokens = (p.wl_specs_text || '').toLowerCase().split(/[^\w]+/g).filter(t => t.length > 2);
    const uniq = Array.from(new Set(tokens)).slice(0, 12);
    const q = uniq.length ? uniq.join(' ') : p.wl_name;
    const candidates = await WaveledProduct.find({
      _id: { $ne: p._id },
      wl_category: p.wl_category,
      $text: { $search: q }
    }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(5);
    ok(res, candidates);
  }
);

// ============================ CASOS DE SUCESSO ===============================
// USO: POST   /api/success-cases (admin|editor) — multipart (company_name, title, description_html?, images[])
// USO: GET    /api/success-cases (admin|editor|viewer)
// USO: DELETE /api/success-cases/:id (admin)
app.post('/api/success-cases',
  limiterAuth, requireAuth(['admin', 'editor']),
  upload.array('images', 12),
  body('company_name').isString().isLength({ min: 2 }),
  body('title').isString().isLength({ min: 2 }),
  body('description_html').optional().isString(),
  validate,
  audit('success.create'),
  async (req, res) => {
    const images = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);
    const c = await WaveledSuccessCase.create({
      wl_company_name: req.body.company_name,
      wl_title: req.body.title,
      wl_description_html: req.body.description_html || '',
      wl_images: images
    });
    ok(res, { id: c._id }, 201);
  }
);

app.get('/api/success-cases',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  audit('success.list'),
  async (req, res) => {
    const items = await WaveledSuccessCase.find({}).sort({ wl_created_at: -1 }).limit(200);
    ok(res, items);
  }
);

app.delete('/api/success-cases/:id',
  limiterAuth, requireAuth(['admin']),
  param('id').isMongoId(), validate,
  audit('success.delete'),
  async (req, res) => {
    const c = await WaveledSuccessCase.findByIdAndDelete(req.params.id);
    if (!c) return err(res, 'Registo não encontrado', 404);
    ok(res, { deleted: true });
  }
);

// ================================ TOP LISTS ==================================
// USO: GET /api/top/overall            (admin|editor|viewer)
// USO: PUT /api/top/overall            (admin) BODY { top10:[], best }
// USO: GET /api/top/category/:category (admin|editor|viewer)  (nome ou ID)
// USO: PUT /api/top/category/:category (admin) BODY { top3?, top10?, best? }
app.get('/api/top/overall',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  audit('top.overall.get'),
  async (req, res) => {
    let doc = await WaveledTopList.findOne({ wl_scope: 'overall' }).populate('wl_top10 wl_best');
    if (!doc) doc = await WaveledTopList.create({ wl_scope: 'overall', wl_top10: [] });
    ok(res, doc);
  }
);

app.put('/api/top/overall',
  limiterAuth, requireAuth(['admin']),
  body('top10').isArray({ min: 0, max: 10 }),
  body('top10.*').isMongoId(),
  body('best').optional().isMongoId(),
  validate,
  audit('top.overall.set'),
  async (req, res) => {
    let doc = await WaveledTopList.findOne({ wl_scope: 'overall' });
    if (!doc) doc = new WaveledTopList({ wl_scope: 'overall' });
    doc.wl_top10 = req.body.top10 || [];
    doc.wl_best = req.body.best || null;
    doc.wl_updated_at = new Date();
    await doc.save();
    ok(res, { saved: true });
  }
);

app.get('/api/top/category/:categoryId',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  param('categoryId').isString(), validate,
  audit('top.category.get'),
  async (req, res) => {
    const cat = await ensureCategory(req.params.categoryId);
    let doc = await WaveledTopList.findOne({ wl_scope: 'category', wl_category: cat._id })
      .populate('wl_top10 wl_top3 wl_best');
    if (!doc) doc = await WaveledTopList.create({ wl_scope: 'category', wl_category: cat._id, wl_top10: [], wl_top3: [] });
    ok(res, doc);
  }
);

app.put('/api/top/category/:categoryId',
  limiterAuth, requireAuth(['admin']),
  param('categoryId').isString(),
  body('top3').optional().isArray({ min: 0, max: 3 }),
  body('top3.*').optional().isMongoId(),
  body('top10').optional().isArray({ min: 0, max: 10 }),
  body('top10.*').optional().isMongoId(),
  body('best').optional().isMongoId(),
  validate,
  audit('top.category.set'),
  async (req, res) => {
    const cat = await ensureCategory(req.params.categoryId);
    let doc = await WaveledTopList.findOne({ wl_scope: 'category', wl_category: cat._id });
    if (!doc) doc = new WaveledTopList({ wl_scope: 'category', wl_category: cat._id });
    if (req.body.top3) doc.wl_top3 = req.body.top3;
    if (req.body.top10) doc.wl_top10 = req.body.top10;
    if (req.body.best !== undefined) doc.wl_best = req.body.best || null;
    doc.wl_updated_at = new Date();
    await doc.save();
    ok(res, { saved: true });
  }
);

// ============================== “MAIS AMADOS” ================================
// USO: GET /api/products/top-liked (admin|editor|viewer) — top 10 por wl_likes
app.get('/api/products/top-liked',
  limiterAuth, requireAuth(['admin', 'editor', 'viewer']),
  audit('products.topLiked'),
  async (req, res) => {
    const items = await WaveledProduct.find({}).sort({ wl_likes: -1, wl_created_at: -1 }).limit(10);
    ok(res, items);
  }
);

// =============================== HEALTHCHECK =================================
app.get('/health', (req, res) => ok(res, { up: true, ts: new Date().toISOString() }));

// ================================= ERRORS ====================================
app.use((errMiddleware, req, res, next) => {
  console.error('Middleware erro:', errMiddleware?.message);
  return err(res, errMiddleware?.message || 'Erro interno', 500);
});

// ================================= START =====================================
app.listen(PORT, () => console.log(`🚀 Waveled API (sessões) em http://localhost:${PORT}`));
