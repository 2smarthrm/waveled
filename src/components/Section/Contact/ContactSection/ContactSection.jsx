/* eslint-disable react/no-unescaped-entities */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

/** ----------------- Config ----------------- */
const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const BaseUrl = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";

/** Email tolerante (lado cliente). O servidor é a última palavra. */
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** Telefone: permite +código país, espaços, parênteses e hífens; 9–15 dígitos no total */
const PHONE_DIGITS_MIN = 9;
const PHONE_DIGITS_MAX = 15;
const onlyDigitsPlus = (s) => s.replace(/[^\d+]/g, "");
const countDigits = (s) => (s.match(/\d/g) ?? []).length;

/** Estado inicial do formulário */
const initialState = {
  nome: "",
  telefone: "",
  email: "",
  tipo: "info", // "info" | "quote"
  mensagem: "",
  // Campos extra para orçamento
  solucao: "",
  datas: "",
  local: "",
  dimensoes: "",
  orcamentoPrevisto: "",
  precisaMontagem: "sim",
  consent: false,
  _hp: "", // honeypot (DEVE ficar vazio)
};

function getUtmFromUrl() {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const out = {};
  let has = false;
  keys.forEach((k) => {
    const v = p.get(k);
    if (v) {
      out[k] = v;
      has = true;
    }
  });
  return has ? out : null;
}

export default function ContactSection() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle"); // "idle" | "success" | "error"
  const [serverMsg, setServerMsg] = useState("");

  // Guardar UTM e página atual
  const [meta, setMeta] = useState({ utm: null, page: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMeta({
        utm: getUtmFromUrl(),
        page: window.location.pathname || "",
      });
    }
  }, []);

  const showQuoteFields = form.tipo === "quote";

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /** Validação cliente (tolerante; o servidor manda) */
  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Indica o teu nome.";
    if (!form.email.trim()) {
      e.email = "Indica o teu email.";
    } else if (!EMAIL_RX.test(form.email.trim())) {
      e.email = "Email inválido.";
    }

    if (!form.telefone.trim()) {
      e.telefone = "Indica um contacto telefónico.";
    } else {
      const digits = countDigits(form.telefone);
      if (digits < PHONE_DIGITS_MIN || digits > PHONE_DIGITS_MAX) {
        e.telefone = "Telefone inválido (9–15 dígitos).";
      }
    }

    if (!form.mensagem.trim()) e.mensagem = "Escreve a tua mensagem.";
    if (!form.consent) e.consent = "É necessário consentimento para contacto.";

    if (showQuoteFields) {
      if (!form.solucao.trim()) e.solucao = "Seleciona a solução pretendida.";
      if (!form.datas.trim()) e.datas = "Indica datas ou período.";
      if (!form.local.trim()) e.local = "Indica o local (cidade/venue).";
      if (!form.dimensoes.trim()) e.dimensoes = "Indica dimensões/área aproximada.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => {
    // Normaliza telefone para aproximar o backend e manter legibilidade mínima
    const normalizedPhone = onlyDigitsPlus(form.telefone).replace(/(\+\d{2,3})(\d+)/, "$1 $2");

    return {
      _hp: form._hp || "",
      tipo: form.tipo,
      nome: form.nome.trim(),
      telefone: normalizedPhone,
      email: form.email.trim(),
      solucao: showQuoteFields ? form.solucao.trim() : "outro",
      datas: showQuoteFields ? form.datas.trim() : "n/d",
      local: showQuoteFields ? form.local.trim() : "n/d",
      dimensoes: showQuoteFields ? form.dimensoes.trim() : "n/d",
      orcamentoPrevisto: showQuoteFields ? form.orcamentoPrevisto.trim() : "",
      precisaMontagem: showQuoteFields ? form.precisaMontagem : "nao",
      mensagem: form.mensagem.trim(),
      consent: true, // força true para satisfazer backends que exigem boolean true
      utm: meta.utm,
      page: meta.page,
    };
  };

  /** Mapeia 422 do servidor (Zod/express-validator/Joi) para {campo: msg} */
  const toFieldErrors = (json) => {
    const fieldErrors = {};

    // express-validator: [{param,msg}]
    if (Array.isArray(json?.errors)) {
      json.errors.forEach((i) => {
        const field = i?.param || i?.path?.[0] || i?.field || "";
        if (field) fieldErrors[field] = i?.msg || i?.message || "Campo inválido";
      });
    }

    // Zod: { issues: [{ path: ['obj','campo'], message }] }
    if (Array.isArray(json?.issues)) {
      json.issues.forEach((i) => {
        const path = i?.path;
        const field =
          (Array.isArray(path) && path[path.length - 1]) ||
          i?.param ||
          i?.field ||
          "";
        if (field) fieldErrors[field] = i?.message || i?.msg || "Campo inválido";
      });
    }

    // Joi/celebrate: { details: [{ path: ['campo'], message }] }
    if (Array.isArray(json?.details)) {
      json.details.forEach((i) => {
        const path = i?.path;
        const field =
          (Array.isArray(path) && path[path.length - 1]) ||
          i?.context?.key ||
          i?.param ||
          "";
        if (field) fieldErrors[field] = i?.message || "Campo inválido";
      });
    }

    return fieldErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("idle");
    setServerMsg("");

    if (!validate()) {
      console.warn("[ContactSection] Validação cliente falhou.", { form, errorsCandidate: errors });
      return;
    }

    const payload = buildPayload();
    setSubmitting(true);

    try {
      const res = await fetch(`${BaseUrl}/api/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // atenção a CORS do servidor!
        body: JSON.stringify(payload),
      });

      let json = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        // Debug completo
        console.error("[ContactSection] Erro no envio", {
          status: res.status,
          statusText: res.statusText,
          json,
          payload,
          endpoint: `${BaseUrl}/api/public/contact`,
        });

        if (res.status === 422) {
          const fieldErrors = toFieldErrors(json);
          if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors);
          }
          setStatus("error");
          setServerMsg(json?.error || json?.message || "Validação falhou. Verifica os campos destacados.");
        } else if (res.status === 401 || res.status === 403) {
          setStatus("error");
          setServerMsg("Não autorizado. Verifica as credenciais/CORS do servidor.");
        } else {
          setStatus("error");
          setServerMsg(json?.error || json?.message || "Falha no envio. Tenta novamente.");
        }
        return;
      }

      // Sucesso
      console.info("[ContactSection] Enviado com sucesso.", { json, payload });
      setStatus("success");
      setServerMsg(json?.message || "Pedido recebido com sucesso.");
      setForm(initialState);
      setErrors({});
    } catch (err) {
      console.error("[ContactSection] Exceção no fetch", err);
      setStatus("error");
      setServerMsg("Ocorreu um problema ao enviar. Verifica a tua ligação e tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="section tekup-section-padding">
        <div className="container">
          <div className="row align-items-start">
            {/* Bloco de conteúdo – Sobre nós */}
            <div className="col-xl-5 col-lg-6 d-flex align-items-center">
              <div className="tekup-default-content">
                <h2>Soluções LED que unem eficiência, qualidade e design moderno</h2>
                <p>
                  A <strong>Waveled</strong> é uma empresa inovadora especializada em soluções LED de{" "}
                  <em>iluminação</em> e <em>display</em>. Apoiamos marcas, eventos e espaços comerciais com projetos
                  chave-na-mão: consultoria, conceção, instalação, operação e manutenção. O nosso foco é entregar{" "}
                  <strong>impacto visual</strong>, <strong>eficiência energética</strong> e <strong>fiabilidade</strong>.
                </p>

                <div className="tekup-contact-info-wrap wrap2">
                  <div className="tekup-contact-info mb-0">
                    <i className="ri-map-pin-2-fill" aria-hidden="true"></i>
                    <h5>Endereço</h5>
                    <p>
                      Rua Fernando Farinha nº 2A e 2B
                      <br />
                      Braço de Prata, 1950-448 Lisboa
                    </p>
                  </div>
                  <div className="tekup-contact-info mb-0">
                    <i className="ri-mail-fill" aria-hidden="true"></i>
                    <h5>Contactos</h5>
                    <p className="mb-1">
                      <Link href="mailto:geral@waveled.pt">geral@waveled.pt</Link>
                    </p>
                    <p className="mb-0">
                      <Link href="tel:+351210353555">+351 210 353 555</Link>
                    </p>
                  </div>
                </div>
                <br />
                <div className="image-area">
                  <img
                    src="https://vortexhire.co.uk/wp-content/uploads/2023/04/Transparent-LED-Screen-curved-office.jpg"
                    alt=""
                  />
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="col-xl-6 offset-xl-1 col-lg-6">
              <div className="tekup-main-form">
                <h3>Fala connosco</h3>
                <p>Escolhe o tipo de mensagem e descreve o que precisas.</p>

                {status === "success" && (
                  <div className="alert alert-success" role="alert" aria-live="polite">
                    {serverMsg || "Obrigado! Recebemos a tua mensagem e entraremos em contacto brevemente."}
                  </div>
                )}
                {status === "error" && (
                  <div className="alert alert-danger" role="alert" aria-live="polite">
                    {serverMsg || "Ocorreu um problema ao enviar. Tenta novamente, por favor."}
                  </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                  {/* Honeypot invisível */}
                  <input
                    type="text"
                    name="_hp"
                    value={form._hp}
                    onChange={onChange}
                    style={{ position: "absolute", left: "-10000px", opacity: 0, height: 0, width: 0 }}
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                  />

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="tekup-main-field">
                        <label htmlFor="tipo" className="form-label">
                          Tipo de mensagem <span aria-hidden="true">*</span>
                        </label>
                        <select
                          id="tipo"
                          name="tipo"
                          value={form.tipo}
                          onChange={onChange}
                          className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
                          aria-invalid={!!errors.tipo}
                        >
                          <option value="info">Pedido de informação</option>
                          <option value="quote">Pedido de orçamento</option>
                        </select>
                        {errors.tipo && <div className="invalid-feedback">{errors.tipo}</div>}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="tekup-main-field">
                        <label htmlFor="nome" className="form-label">
                          Nome <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="nome"
                          name="nome"
                          type="text"
                          placeholder="O teu nome"
                          value={form.nome}
                          onChange={onChange}
                          className={errors.nome ? "is-invalid" : ""}
                          aria-invalid={!!errors.nome}
                          required
                        />
                        {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="tekup-main-field">
                        <label htmlFor="telefone" className="form-label">
                          Telefone <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="telefone"
                          name="telefone"
                          type="tel"
                          inputMode="tel"
                          placeholder="+351 9xx xxx xxx"
                          value={form.telefone}
                          onChange={onChange}
                          className={errors.telefone ? "is-invalid" : ""}
                          aria-invalid={!!errors.telefone}
                          required
                        />
                        {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="tekup-main-field">
                        <label htmlFor="email" className="form-label">
                          Email <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="geral@waveled.pt"
                          value={form.email}
                          onChange={onChange}
                          className={errors.email ? "is-invalid" : ""}
                          aria-invalid={!!errors.email}
                          required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>

                    {/* Campos específicos para orçamento */}
                    {showQuoteFields && (
                      <>
                        <div className="col-lg-12">
                          <div className="tekup-main-field">
                            <label htmlFor="solucao" className="form-label">
                              Solução pretendida <span aria-hidden="true">*</span>
                            </label>
                            <select
                              id="solucao"
                              name="solucao"
                              value={form.solucao}
                              onChange={onChange}
                              className={`form-select ${errors.solucao ? "is-invalid" : ""}`}
                              aria-invalid={!!errors.solucao}
                              required
                            >
                              <option value="">Seleciona uma opção</option>
                              <option value="led-rental">Aluguer de painéis LED (eventos)</option>
                              <option value="led-fixed">Instalação fixa (lojas/empresas)</option>
                              <option value="led-iluminacao">Iluminação LED (arquitetural/industrial)</option>
                              <option value="outro">Outra solução</option>
                            </select>
                            {errors.solucao && <div className="invalid-feedback">{errors.solucao}</div>}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="tekup-main-field">
                            <label htmlFor="datas" className="form-label">
                              Datas / Período <span aria-hidden="true">*</span>
                            </label>
                            <input
                              id="datas"
                              name="datas"
                              type="text"
                              placeholder="Ex.: 12–14 de Outubro ou mês previsto"
                              value={form.datas}
                              onChange={onChange}
                              className={errors.datas ? "is-invalid" : ""}
                              aria-invalid={!!errors.datas}
                              required
                            />
                            {errors.datas && <div className="invalid-feedback">{errors.datas}</div>}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="tekup-main-field">
                            <label htmlFor="local" className="form-label">
                              Local <span aria-hidden="true">*</span>
                            </label>
                            <input
                              id="local"
                              name="local"
                              type="text"
                              placeholder="Cidade / Venue"
                              value={form.local}
                              onChange={onChange}
                              className={errors.local ? "is-invalid" : ""}
                              aria-invalid={!!errors.local}
                              required
                            />
                            {errors.local && <div className="invalid-feedback">{errors.local}</div>}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="tekup-main-field">
                            <label htmlFor="dimensoes" className="form-label">
                              Dimensões / Área <span aria-hidden="true">*</span>
                            </label>
                            <input
                              id="dimensoes"
                              name="dimensoes"
                              type="text"
                              placeholder="Ex.: 4m × 2m, 8 m², pitch desejado"
                              value={form.dimensoes}
                              onChange={onChange}
                              className={errors.dimensoes ? "is-invalid" : ""}
                              aria-invalid={!!errors.dimensoes}
                              required
                            />
                            {errors.dimensoes && <div className="invalid-feedback">{errors.dimensoes}</div>}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="tekup-main-field">
                            <label htmlFor="orcamentoPrevisto" className="form-label">
                              Orçamento previsto
                            </label>
                            <input
                              id="orcamentoPrevisto"
                              name="orcamentoPrevisto"
                              type="text"
                              placeholder="Ex.: até 3.000 €"
                              value={form.orcamentoPrevisto}
                              onChange={onChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="tekup-main-field">
                            <label className="form-label d-block">Necessita de montagem/operadores?</label>
                            <div className="d-flex gap-3">
                              <label className="d-inline-flex align-items-center gap-2">
                                <input
                                  type="radio"
                                  name="precisaMontagem"
                                  value="sim"
                                  checked={form.precisaMontagem === "sim"}
                                  onChange={onChange}
                                />
                                <span>Sim</span>
                              </label>
                              <label className="d-inline-flex align-items-center gap-2">
                                <input
                                  type="radio"
                                  name="precisaMontagem"
                                  value="nao"
                                  checked={form.precisaMontagem === "nao"}
                                  onChange={onChange}
                                />
                                <span>Não</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-lg-12">
                      <div className="tekup-main-field">
                        <label htmlFor="mensagem" className="form-label">
                          Mensagem <span aria-hidden="true">*</span>
                        </label>
                        <textarea
                          id="mensagem"
                          name="mensagem"
                          placeholder={
                            showQuoteFields
                              ? "Descreve o projeto (tipo de conteúdo, distância de visualização, horários, etc.)"
                              : "Como podemos ajudar?"
                          }
                          value={form.mensagem}
                          onChange={onChange}
                          rows={5}
                          className={errors.mensagem ? "is-invalid" : ""}
                          aria-invalid={!!errors.mensagem}
                          required
                        />
                        {errors.mensagem && <div className="invalid-feedback">{errors.mensagem}</div>}
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="tekup-main-field d-flex align-items-start gap-2">
                        <input
                          id="consent"
                          name="consent"
                          type="checkbox"
                          checked={form.consent}
                          onChange={onChange}
                          aria-invalid={!!errors.consent}
                        />
                        <label htmlFor="consent" className="form-label mb-0">
                          Autorizo a Waveled a contactar-me para responder a este pedido. Li e aceito a{" "}
                          <Link href="/politica-de-privacidade" target="_blank">
                            Política de Privacidade
                          </Link>
                          .
                        </label>
                      </div>
                      {errors.consent && <div className="invalid-feedback d-block">{errors.consent}</div>}
                    </div>

                    <div className="col-lg-12">
                      <button
                        id="tekup-main-form-btn"
                        type="submit"
                        disabled={submitting}
                        aria-busy={submitting}
                      >
                        {submitting ? (
                          <>
                            A enviar… <i className="ri-loader-4-line" aria-hidden="true"></i>
                          </>
                        ) : (
                          <>
                            Enviar mensagem <i className="ri-arrow-right-up-line" aria-hidden="true"></i>
                          </>
                        )}
                      </button>
                      <p className="mt-2 small text-muted">
                        Não enviamos spam. Usamos os teus dados apenas para dar seguimento ao pedido.
                      </p>
                    </div>
                  </div>
                </form>

                {/* Dica de debug (opcional, remove em produção) */}
                {/* <pre className="mt-3 small">
                  {JSON.stringify({ form, meta, showQuoteFields }, null, 2)}
                </pre> */}
              </div>
            </div>
            {/* /Formulário */}
          </div>
        </div>
      </div>
    </>
  );
}
