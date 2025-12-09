"use client";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// >>> Lightbox
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

// >>> React-Bootstrap (Skeletons / Placeholders)
import { Placeholder } from "react-bootstrap";
import RequestModal from "../Common/RequestBudgetModal/RequestModal";

const isBrowser = typeof window !== "undefined";
const protocol =
  isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE =
  protocol === "https"
    ? "https://waveledserver.vercel.app"
    : "http://localhost:4000";
const IMG_HOST =
  protocol === "https"
    ? "https://waveledserver.vercel.app"
    : "http://localhost:4000";

const isAbsoluteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const withHost = (u) => (u ? (isAbsoluteUrl(u) ? u : `${IMG_HOST}${u}`) : "");
const safeText = (s, fb = "") => (typeof s === "string" && s.trim() ? s : fb);

const toArray = (raw) =>
  Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.items)
    ? raw.items
    : [];

const toProduct = (raw) => (raw?.data ? raw.data : raw) || null;

const truncate = (s, n = 50) => {
  if (!s) return "";
  return s.length > n ? s.substring(0, n).trimEnd() + "…" : s;
};

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* =========================================================
   COMPONENTE: ProductIndustries (usa até 4 exemplos)
   - Agora com Lightbox próprio (local)
========================================================= */
function ProductIndustries({ examples = [], autoPlayMs = 3500 }) {
  const data = useMemo(
    () =>
      (examples || [])
        .slice(0, 4)
        .map((e, i) => ({
          key: e?._id || `${i}-${e?.image || ""}`,
          title: safeText(e?.title, "—"),
          description: safeText(e?.description, ""),
          image: withHost(e?.image),
        }))
        .filter((e) => !!e.image),
    [examples]
  );

  const len = data.length;
  if (len === 0) return null;

  const [idx, setIdx] = useState(0);
  const wrap = (n) => ((n % len) + len) % len;

  // autoplay
  const timerRef = useRef(null);
  const start = () => {
    stop();
    timerRef.current = setInterval(
      () => setIdx((i) => wrap(i + 1)),
      autoPlayMs
    );
  };
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };
  useEffect(() => {
    start();
    return stop;
  }, [len, autoPlayMs]);

  // swipe
  const touchStartX = useRef(0);
  const touching = useRef(false);
  const onTouchStart = (e) => {
    touching.current = true;
    touchStartX.current = e.touches?.[0]?.clientX ?? 0;
    stop();
  };
  const onTouchEnd = (e) => {
    if (!touching.current) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      setIdx((i) => wrap(i + (delta < 0 ? 1 : -1)));
    }
    touching.current = false;
    start();
  };

  // keyboard
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") setIdx((i) => wrap(i + 1));
    else if (e.key === "ArrowLeft") setIdx((i) => wrap(i - 1));
  };

  const goTo = (i) => {
    stop();
    setIdx(wrap(i));
    start();
  };

  // ---- Lightbox local (para os 4 slides) ----
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const lbImages = useMemo(
    () => data.map((d) => ({ url: d.image, title: d.title })),
    [data]
  );
  const openLightbox = (startAt = 0) => {
    setLbIndex(startAt);
    setLbOpen(true);
  };

  return (
    <div className="pi-root" onKeyDown={onKeyDown}>
      <div
        className="pi-left"
        onMouseEnter={stop}
        onMouseLeave={start}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Exemplos de aplicação"
      >
        {/* faixa deslizando via translateX */}
        <div
          className="pi-track"
          style={{
            width: `${len * 100}%`,
            transform: `translateX(-${(100 / len) * idx}%)`,
          }}
        >
          {data.map((it, i) => (
            <div key={it.key} className="pi-slide">
              <img
                src={
                  it.image.startsWith("http") ? it.image : API_BASE + it.image
                }
                alt={it.title}
                role="button"
                style={{ cursor: "zoom-in" }}
                onClick={() => openLightbox(i)}
              />
            </div>
          ))}
        </div>

        {/* setas */}
        <button
          className="pi-arrow pi-prev"
          onClick={() => goTo(idx - 1)}
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          className="pi-arrow pi-next"
          onClick={() => goTo(idx + 1)}
          aria-label="Seguinte"
        >
          ›
        </button>

        {/* dots */}
        <div
          className="pi-dots"
          role="tablist"
          aria-label="Navegação de slides"
        >
          {data.map((_, i) => (
            <button
              key={i}
              className={`pi-dot ${i === idx ? "active" : ""}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* cartões à direita — sincronizados com o slide */}
      <div className="pi-right" onMouseEnter={stop} onMouseLeave={start}>
        {data.map((item, i) => (
          <article
            key={item.key}
            className={`pi-card ${i === idx ? "active" : ""}`}
            onMouseEnter={() => goTo(i)}
            onClick={() => openLightbox(i)}
            role="button"
            tabIndex={0}
            title="Ver em ecrã inteiro"
          >
            <h5>{item.title}</h5>
            {item.description && <p>{item.description}</p>}
          </article>
        ))}
      </div>

      {/* estilos mínimos */}
      <style jsx>{`
        .pi-root {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: stretch;
        }
        @media (max-width: 992px) {
          .pi-root {
            grid-template-columns: 1fr;
          }
        }
        .pi-left {
          position: relative;
          background: #0b0b0c10;
          border-radius: 12px;
          overflow: hidden;
          min-height: 360px;
        }
        .pi-track {
          height: 100%;
          display: flex;
          transition: transform 450ms ease;
        }
        .pi-slide {
          flex: 0 0 calc(100% / 4);
          width: calc(100% / 4);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111;
        }
        .pi-slide img {
          width: 100%;
          height: 100%;
          max-height: 520px;
          object-fit: cover;
        }
        .pi-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: none;
          background: #00000066;
          color: #fff;
          font-size: 22px;
          line-height: 40px;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: opacity 200ms;
        }
        .pi-prev {
          left: 10px;
        }
        .pi-next {
          right: 10px;
        }
        .pi-dots {
          position: absolute;
          bottom: 10px;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .pi-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 0;
          background: #ffffff66;
          cursor: pointer;
        }
        .pi-dot.active {
          background: #fff;
        }
        .pi-right {
          display: grid;
          gap: 16px;
        }
        .pi-card {
          background: #e9ecef;
          padding: 18px 16px;
          border-radius: 10px;
          cursor: pointer;
          outline: none;
          transition: transform 180ms, background 180ms;
        }
        .pi-card.active {
          transform: translateY(-2px);
          background: #1740ff;
          color: #fff;
        }
        .pi-card h5 {
          margin: 0 0 6px;
        }
        .pi-card p {
          margin: 0;
          opacity: 0.9;
        }
        .pi-card.active h5,
        .pi-card.active p {
          color: #fff;
        }
      `}</style>

      {/* Lightbox local para os 4 slides */}
      {lbOpen && (
        <Lightbox
          images={lbImages}
          startIndex={lbIndex}
          onClose={() => setLbOpen(false)}
        />
      )}
    </div>
  );
}

/* =========================================================
   SKELETONS (React-Bootstrap Placeholders)
   - Mantém a estrutura da página durante o carregamento
========================================================= */
function Line({ xs = 12, style = {} }) {
  return (
    <div className="skeleton-soft skeleton-light">
      <Placeholder as="div" animation="glow">
        <Placeholder xs={xs} style={{ display: "block", ...style }} />
      </Placeholder>
    </div>
  );
}

function ImgSkeleton({ height = 380, rounded = 12, className = "" }) {
  return (
    <div className="skeleton-soft skeleton-light">
      <Placeholder as="div" animation="glow" className={className}>
        <Placeholder xs={12} style={{ height, borderRadius: rounded }} />
      </Placeholder>
    </div>
  );
}

function ThumbSkeleton() {
  return <ImgSkeleton height={80} rounded={8} className="me-2" />;
}

function CardSkeleton() {
  return (
    <div className="tekup-shop-wrap">
      <div className="tekup-shop-thumb">
        <ImgSkeleton height={300} rounded={12} />
      </div>
      <div className="tekup-shop-data">
        <Line xs={8} style={{ height: 20, borderRadius: 6, marginTop: 8 }} />
        <Line xs={5} style={{ height: 16, borderRadius: 6, marginTop: 6 }} />
        <Line xs={6} style={{ height: 14, borderRadius: 6, marginTop: 6 }} />
      </div>
    </div>
  );
}

function IndustriesSkeleton() {
  return (
    <section className="section bg-grey pt-4 pb-4">
      <div className="container pt-4 pb-4">
        <div className="pi-root d-flex">
          <div className="col-lg-6">
            <div className="pi-left">
              <ImgSkeleton height={460} rounded={12} />
            </div>
          </div>
          <div style={{ marginLeft: "10px" }}></div>
          <div className="col-lg-6">
            <div className="pi-right col">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="pi-card mb-4">
                  <Line xs={12} style={{ height: 95, borderRadius: 6 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductSkeleton() {
  return (
    <> 
      <div className="section">
        <div className="container">
          <div className="row align-items-center">
            {/* GALERIA */}
            <div className="col-lg-6">
              <div className="tekup-tab-slider">
                <div className="tekup-tabs-container">
                  <div className="tekup-tabs-wrapper">
                    <div className="tabContent">
                      <ImgSkeleton height={420} rounded={12} />
                    </div>
                  </div>
                </div>

                <ul
                  className="tekup-tabs-menu"
                  style={{ gap: 12, display: "flex", marginTop: 12 }}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <li key={i}>
                      <ThumbSkeleton />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DETALHES */}
            <div className="col-lg-6">
              <div className="tekup-details-content pt-4">
                <Line xs={7} style={{ height: 34, borderRadius: 8 }} />
                <Line
                  xs={4}
                  style={{ height: 16, borderRadius: 6, marginTop: 12 }}
                />

                <div className="tekup-product-info mt-4">
                  <Line xs={4} style={{ height: 20, borderRadius: 6 }} />
                  <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    <li>
                      <Line
                        xs={8}
                        style={{ height: 14, borderRadius: 6, marginTop: 10 }}
                      />
                    </li>
                    <li>
                      <Line
                        xs={6}
                        style={{ height: 14, borderRadius: 6, marginTop: 8 }}
                      />
                    </li>
                  </ul>
                </div>

                <div className="tekup-product-wrap mt-4">
                  <Placeholder.Button
                    xs={4}
                    aria-hidden
                    style={{ height: 40, borderRadius: 999 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bloco dinâmico (simulado) */}
      <IndustriesSkeleton />

      {/* BLOCOS ADICIONAIS (examplesRest) */}
      <section className="mt-4 bg-black">
        <div className="section tekup-section-padding">
          <div className="container">
            <hr />
            <br />
            <div className="col">
              <div className="d-flex col justify-content-between">
                <div>
                  <Line
                    xs={6}
                    style={{ height: 28, borderRadius: 8, marginTop: 8 }}
                  />
                </div>
                <div style={{ maxWidth: "550px" }}>
                  <Line
                    xs={10}
                    style={{ height: 14, borderRadius: 6, marginTop: 8 }}
                  />
                  <Line
                    xs={9}
                    style={{ height: 14, borderRadius: 6, marginTop: 6 }}
                  />
                </div>
              </div>
              <br />
              <div className="row single-portofolio-area">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <article key={i} className="col-md-3 mb-3">
                    <ImgSkeleton height={180} rounded={8} />
                    <Line
                      xs={7}
                      style={{ height: 16, borderRadius: 6, marginTop: 8 }}
                    />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="section tekup-section-padding">
        <div className="container">
          <div className="tekup-product-tab">
            <ul className="nav nav-pills" id="pills-tab" role="tablist"> 
              <li className="nav-item" role="presentation">
                <Placeholder.Button
                  xs={2}
                  aria-hidden
                  style={{ height: 36, borderRadius: 999 }}
                />
              </li>
            </ul>
            <div
              className="tab-content"
              id="pills-tabContent"
              style={{ marginTop: 16 }}
            >
              <Line
                xs={12}
                style={{ height: 14, borderRadius: 6, marginTop: 6 }}
              />
              <Line
                xs={11}
                style={{ height: 14, borderRadius: 6, marginTop: 6 }}
              />
              <Line
                xs={10}
                style={{ height: 14, borderRadius: 6, marginTop: 6 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PRODUTOS RELACIONADOS */}
      <div className="tekup-related-product-section">
        <div className="container">
          <div className="tekup-section-title center">
            <Line xs={4} style={{ height: 28, borderRadius: 8 }} />
          </div>
        </div>
        <div className="container">
          <div className="row">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="col-xl-3 col-lg-4 col-md-6">
                <CardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   PÁGINA: SingleShopSection (JSX)
   - Lightbox na galeria principal (todas as imagens do produto)
   - Lightbox na grelha de exemplos (examplesRest)
   - Loader com skeletons (react-bootstrap) ao invés de texto
========================================================= */
export default function SingleShopSection() { 
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const readProduct = () => {
      try {
        const sp = new URLSearchParams(window.location.search);
        setProductId(sp.get("product"));
      } catch {
        setProductId(null);
      }
    };
    readProduct();

    // Guardar originais e repor no cleanup para evitar side-effects
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;

    const patched = (fn) =>
      function (...args) {
        const ret = fn.apply(this, args);
        readProduct();
        return ret;
      };

    history.pushState = patched(_pushState);
    history.replaceState = patched(_replaceState);

    window.addEventListener("popstate", readProduct);
    return () => {
      window.removeEventListener("popstate", readProduct);
      history.pushState = _pushState;
      history.replaceState = _replaceState;
    };
  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [examples, setExamples] = useState([]); // exemplos da API (ordenados ASC)
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let abort = false;

    async function run() {
      if (productId === null) {
        setLoading(true);
        setError("");
        setItem(null);
        setRelated([]);
        setExamples([]);
        return;
      }

      if (!productId) {
        setError("Falta o parâmetro ?product=<id>.");
        setLoading(false);
        setItem(null);
        setRelated([]);
        setExamples([]);
        return;
      }

      setLoading(true);
      setError("");
      setItem(null);
      setRelated([]);
      setExamples([]);
      setActiveImage(0);

      try {
        // 1) Produto
        const prodRaw = await fetchJson(
          `${API_BASE}/api/products/${productId}`
        );
        const prod = toProduct(prodRaw);
        if (!prod) throw new Error("Produto não encontrado.");
        if (abort) return;
        setItem(prod);

        // 2) Exemplos — ordenar ASC (mais antigos primeiro)
        try {
          const qs = new URLSearchParams();
          qs.set("productId", prod._id);
          const examplesRaw = await fetchJson(
            `${API_BASE}/api/examples?${qs.toString()}`
          );
          
          if (!abort) {
            const arr = toArray(examplesRaw);
            const asc = [...arr].sort((a, b) => {
              const da = new Date(a?.createdAt || 0).getTime();
              const db = new Date(b?.createdAt || 0).getTime();
              return da - db;
            });
            setExamples(asc);
          }
        } catch {
          if (!abort) setExamples([]);
        }

        // 3) Relacionados
        let relatedList = [];
        const catName = prod?.wl_category?.wl_name;

        if (catName) {
          try {
            const relRaw = await fetchJson(
              `${API_BASE}/api/products?category=${encodeURIComponent(catName)}`
            );
            if (abort) return;
            const relAll = toArray(relRaw);
            relatedList = relAll.filter((p) => p?._id !== prod._id);
          } catch {
            /* ignore */
          }
        }

        if ((relatedList?.length || 0) < 4) {
          try {
            const moreRaw = await fetchJson(`${API_BASE}/api/products`);
            if (abort) return;
            const more = toArray(moreRaw);
            const forbiddenIds = new Set([
              prod._id,
              ...relatedList.map((p) => p._id),
            ]);
            const fillers = more.filter((p) => !forbiddenIds.has(p._id));
            relatedList = [...relatedList, ...fillers];
          } catch {
            /* ignore */
          }
        }

        relatedList = relatedList.slice(0, 4);
        if (!abort) setRelated(relatedList);
      } catch (e) {
        if (!abort) setError(e?.message || "Erro ao carregar produto.");
      } finally {
        if (!abort) setLoading(false);
      }
    }

    run();
    return () => {
      abort = true;
    };
  }, [productId]);

  const images = useMemo(() => {
    const list = Array.isArray(item?.wl_images) ? item.wl_images : [];
    const normalized = list.map(withHost);
    if (normalized.length === 0 && item?.wl_cover)
      normalized.push(withHost(item.wl_cover));
    return normalized;
  }, [item]);

  const title = safeText(item?.wl_name, "Produto");
  const sku = safeText(item?.wl_sku, "—");
  const catName = safeText(item?.wl_category?.wl_name, "Sem categoria");
  const shortDescription = safeText(item?.wl_specs_text, "");

  // exemplos processados
  const examplesTop4 = useMemo(() => (examples || []).slice(0, 4), [examples]);
  const examplesRest = useMemo(() => (examples || []).slice(4), [examples]);

  // -------- Lightbox do produto (galeria principal) --------
  const [lbOpenProduct, setLbOpenProduct] = useState(false);
  const [lbIndexProduct, setLbIndexProduct] = useState(0);
  const lbImagesProduct = useMemo(
    () => images.map((src) => ({ url: src, title })),
    [images, title]
  );
  const openProductLightbox = (i = 0) => {
    setLbIndexProduct(i);
    setLbOpenProduct(true);
  };

  // -------- Lightbox dos exemplos (grelha examplesRest) --------
  const [lbOpenExamples, setLbOpenExamples] = useState(false);
  const [lbIndexExamples, setLbIndexExamples] = useState(0);
  const lbImagesExamples = useMemo(
    () =>
      (examplesRest || [])
        .map((ex) => ({
          url: withHost(ex?.image),
          title: safeText(ex?.title, "Exemplo"),
        }))
        .filter((x) => !!x.url),
    [examplesRest]
  );
  const openExamplesLightbox = (i = 0) => {
    setLbIndexExamples(i);
    setLbOpenExamples(true);
  };

  // ===== LOADING / ERROR STATES =====
  if (loading) {
    return <ProductSkeleton />;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "3rem 0" }}>
        <h4 style={{ color: "crimson" }}>{error}</h4>
      </div>
    );
  }

  // ===== CONTEÚDO =====
  return (
    <>
      {/* BLOCO DINÂMICO (só se houver exemplos) */}
      

      <div className="section">
        <div className="container">
          <br /><br /><br /><br />
          <div className="row align-items-center">
       
               {/* GALERIA */}
            <div className="col-lg-6">
              <div className="tekup-tab-slider">
                <div className="tekup-tabs-container">
                  <div className="tekup-tabs-wrapper">
                    <div className="tabContent">
                      <img
                        src={
                          (images[activeImage] || "").startsWith("http")
                            ? images[activeImage]
                            : API_BASE + images[activeImage]
                        }
                        alt={`${title} — imagem`}
                        style={{
                          width: "100%",
                          borderRadius: 12,
                          cursor: images.length ? "zoom-in" : "default",
                        }}
                        role={images.length ? "button" : undefined}
                        onClick={() =>
                          images.length && openProductLightbox(activeImage)
                        }
                        title={images.length ? "Ver em ecrã inteiro" : ""}
                      />
                    </div>
                  </div>
                </div>

                {images.length > 1 && (
                  <ul className="tekup-tabs-menu" style={{ gap: 12 }}>
                    {images.map((src, idx) => (
                      <li
                        key={`${src}-${idx}`}
                        className={activeImage === idx ? "active" : ""}
                        onMouseEnter={() => setActiveImage(idx)}
                        onClick={() => setActiveImage(idx)}
                        style={{ cursor: "pointer" }}
                        title="Pré-visualizar"
                      >
                        <img
                          src={src.startsWith("http") ? src : API_BASE + src}
                          alt={`${title} — miniatura ${idx + 1}`}
                          style={{
                            width: 110,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 8,
                            border:
                              activeImage === idx
                                ? "2px solid var(--bs-primary, #0d6efd)"
                                : "1px solid rgba(0,0,0,.1)",
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>



            {/* DETALHES */}
            <div className="col-lg-6">
              <div className="tekup-details-content pt-4">
                <h2 className="mt-0">{title}</h2> <br />
              
                <div className="tekup-product-info mt-4">
                  <h5>Informação rápida</h5>
                  <ul>
                    <li>
                      <span>Categoria: </span>
                      {catName === "Sem categoria" ? (
                        <span>{catName}</span>
                      ) : (
                        <Link
                          href={`/shop?category=${encodeURIComponent(catName)}`}
                        >
                          {catName}
                        </Link>
                      )}
                    </li>
                    <li>
                      <span>Tags: </span>
                      <Link href="#">Waveled</Link>
                      {catName !== "Sem categoria" && (
                        <>
                          , <Link href="#">{catName}</Link>
                        </>
                      )}
                    </li>
                  </ul>
                </div>
                <div className="tekup-product-wrap mt-4"> 
                   <RequestModal
                      item={item}
                      toggle_button={(open) => (
                        <a href="#" className="tekup-default-btn col-lg-12 col" onClick={open}>
                          Solicitar Produto
                        </a>
                      )}
                    />
                </div>
              </div>
            </div>

    




          </div>
        </div>
      </div>

<br /><br /><br />

       {examplesTop4.length > 0 && (
        <section className="section bg-grey">
          <div className="container pt-4 pb-4">
            <ProductIndustries examples={examplesTop4} />
          </div>
        </section>
      )}

        {/* TABS */}
      <div className="section tekup-section-padding pt-4 pb-2">
        <div className="container">
          <div className="tekup-product-tab">
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "description" ? "active" : ""
                  }`}
                  id="pills-description-tab"
                  onClick={() => setActiveTab("description")}
                >
                  Descrição
                </button>
              </li>
            </ul>

            <div className="tab-content" id="pills-tabContent">
              <div
                className={`tab-pane fade ${
                  activeTab === "description" ? "show active" : ""
                }`}
                id="pills-description"
                role="tabpanel"
                aria-labelledby="pills-description-tab"
                tabIndex={0}
              >
                {item?.wl_description_html ? (
                  <div
                    className="mt-3"
                    dangerouslySetInnerHTML={{
                      __html: item.wl_description_html,
                    }}
                  />
                ) : (
                  <>
                    <p className="mt-3">
                      Desenvolvemos soluções LED com foco em eficiência,
                      longevidade e qualidade de imagem.
                    </p>
                    <p>
                      A Waveled acompanha consultoria, projeto, instalação e
                      suporte.
                    </p>
                  </>
                )}
              </div>

              <div
                className={`tab-pane fade ${
                  activeTab === "specification" ? "show active" : ""
                }`}
                id="pills-specification"
                role="tabpanel"
                aria-labelledby="pills-specification-tab"
                tabIndex={0}
              >
                {item?.wl_specs_text ? (
                  <div
                    className="mt-3"
                    dangerouslySetInnerHTML={{ __html: item.wl_specs_text }}
                  />
                ) : (
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <ul>{/* specs esquerdas */}</ul>
                    </div>
                    <div className="col-md-6">
                      <ul>{/* specs direitas */}</ul>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`tab-pane fade ${
                  activeTab === "downloads" ? "show active" : ""
                }`}
                id="pills-downloads"
                role="tabpanel"
                aria-labelledby="pills-downloads-tab"
                tabIndex={0}
              >
                <div className="d-flex flex-wrap gap-3 mt-3">
                  {Array.isArray(item?.wl_downloads) &&
                  item.wl_downloads.length > 0 ? (
                    item.wl_downloads.map((d, i) => (
                      <a
                        key={i}
                        className="tekup-default-btn"
                        href={
                          isAbsoluteUrl(d?.url)
                            ? d.url
                            : `${IMG_HOST}${d?.url || ""}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {safeText(d?.label, `Download ${i + 1}`)}
                      </a>
                    ))
                  ) : (
                    <>
                      <a
                        className="tekup-default-btn"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Download Datasheet
                      </a>
                      <a
                        className="tekup-default-btn"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Manual de Instalação
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* BLOCOS ADICIONAIS (restantes exemplos) — só se houver examplesRest */}
      {examplesRest.length > 0 && (
        <> 
          <section className="mt-4 bg-black ">
            <div className="section tekup-section-padding">
              <div className="container">
                <hr />
                <br />
                <div className="col">
                  <div className="d-flex col justify-content-between">
                    <div>
                      <h3 className="text-light mt-4">
                        Indústrias e Soluções Aplicáveis
                      </h3>
                    </div>
                    <div style={{ maxWidth: "550px" }}>
                      <p className="text-silver mt-2">{shortDescription}</p>
                    </div>
                  </div>
                  <br />
                  <div className="row single-portofolio-area">
                    {examplesRest.map((ex, index) => {
                      const img = withHost(ex?.image);
                      const exTitle = safeText(ex?.title, "Exemplo");
                      if (!img) return null;
                      return (
                        <article key={index} className="col-md-3 mb-3">
                          <img
                            src={img.startsWith("http") ? img : API_BASE + img}
                            alt={exTitle}
                            style={{
                              width: "100%",
                              borderRadius: 8,
                              objectFit: "cover",
                              cursor: "zoom-in",
                            }}
                            role="button"
                            title="Ver em ecrã inteiro"
                            onClick={() => openExamplesLightbox(index)}
                          />
                          <strong className="text-silver d-block mt-2">
                            {exTitle}
                          </strong>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

 
  <br /><br />
      {/* PRODUTOS RELACIONADOS */}
      <div className="tekup-related-product-section pb-2">
        <div className="container">
          <div className="tekup-section-title center">
            <h2>Produtos relacionados</h2>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {related.map((p) => {
              const cover =
                Array.isArray(p?.wl_images) && p.wl_images.length
                  ? withHost(p.wl_images[0])
                  : withHost(p?.wl_cover);
              const pTitle = truncate(safeText(p?.wl_name, "Produto"));
              const pSku = safeText(p?.wl_sku, "—");
              const pCat = p?.wl_category?.wl_name;

              return (
                <div key={p._id} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="tekup-shop-wrap">
                    <div className="tekup-shop-thumb">
                      <Link href={`/single-shop?product=${p._id}`}>
                        <img
                          style={{ height: "300px", objectFit: "contain" }}
                          src={cover}
                          alt={pTitle}
                        />
                      </Link>
                      <Link
                        className="tekup-shop-btn"
                        href={`/single-shop?product=${p._id}`}
                      >
                        Saiba Mais
                      </Link>
                    </div>
                    <div className="tekup-shop-data">
                      <Link href={`/single-shop?product=${p._id}`}>
                        <h5 title={p?.wl_name || ""}>{pTitle}</h5>
                      </Link> 
                      {pCat && (
                        <small className="text-muted">Categoria: {pCat}</small>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {related.length === 0 && (
              <div className="col-12">
                <p className="text-muted">
                  Sem produtos relacionados para apresentar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox da galeria principal do produto */}
      {lbOpenProduct && (
        <Lightbox
          images={lbImagesProduct}
          startIndex={lbIndexProduct}
          onClose={() => setLbOpenProduct(false)}
        />
      )}

      {/* Lightbox dos exemplos (grelha) */}
      {lbOpenExamples && (
        <Lightbox
          images={lbImagesExamples}
          startIndex={lbIndexExamples}
          onClose={() => setLbOpenExamples(false)}
        />
      )}
    </>
  );
}
