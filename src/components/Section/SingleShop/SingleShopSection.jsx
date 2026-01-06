"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";

// Lightbox (yet-another-react-lightbox)
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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

/*
=========================================================
   COMPONENTE: ProductIndustries
=========================================================
*/
function ProductIndustries({ examples = [], autoPlayMs = 3500 }) {
  // todos os exemplos (para grid + lightbox)
  const all = useMemo(() => {
    return (examples || [])
      .map((e, i) => ({
        key: e?._id || `${i}-${e?.image || ""}`,
        title: safeText(e?.title, "—"),
        description: safeText(e?.description, ""),
        image: withHost(e?.image),
      }))
      .filter((e) => !!e.image);
  }, [examples]);

  if (all.length === 0) return null;

  const [view, setView] = useState("recomendacoes");

  // ====== MODELO (mantém design anterior) ======
  const modelData = useMemo(() => all.slice(0, 4), [all]);
  const len = modelData.length;

  const [idx, setIdx] = useState(0);
  const wrap = (n) => ((n % len) + len) % len;

  const timerRef = useRef(null);
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };
  const start = () => {
    stop();
    if (view !== "recomendacoes") return;
    if (len <= 1) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => wrap(i + 1));
    }, autoPlayMs);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, autoPlayMs, view]);

  // swipe horizontal (como estava)
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

  const goTo = (i) => {
    stop();
    setIdx(wrap(i));
    start();
  };

  const onKeyDown = (e) => {
    if (view !== "recomendacoes") return;
    if (e.key === "ArrowRight") setIdx((i) => wrap(i + 1));
    else if (e.key === "ArrowLeft") setIdx((i) => wrap(i - 1));
    else if (e.key === "Escape") setLbOpen(false);
  };

  // ====== Lightbox local (todos) ======
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const lbSlides = useMemo(
    () =>
      all.map((d) => ({
        src: d.image,
        title: d.title,
        description: d.description,
      })),
    [all]
  );

  const openLightbox = (startAt = 0) => {
    setLbIndex(startAt);
    setLbOpen(true);
  };

  // ====== GRID: regras novas ======
  // - só aparece "+X" quando EXISTIR MAIS DE 8 itens (>= 9)
  // - preview: 7 itens + tile "+X"
  const PREVIEW_REAL_ITEMS = 7;
  const SHOW_MORE_THRESHOLD = 8; // só mostra "+X" se all.length > 8
  const [showAllGrid, setShowAllGrid] = useState(false);

  useEffect(() => {
    if (view !== "mais") setShowAllGrid(false);
  }, [view]);

  const hasMoreThanThreshold = all.length > SHOW_MORE_THRESHOLD; // > 8
  const remaining = Math.max(0, all.length - PREVIEW_REAL_ITEMS);
  const showMoreTile = !showAllGrid && hasMoreThanThreshold;

  const gridItems = useMemo(() => {
    if (showAllGrid) return all;

    // se tiver 8 ou menos, mostra tudo (sem "+X")
    if (!hasMoreThanThreshold) return all;

    // se tiver mais de 8, mostra 7 (e o 8º é o "+X")
    return all.slice(0, PREVIEW_REAL_ITEMS);
  }, [all, showAllGrid, hasMoreThanThreshold]);

  // imagem atrás do tile "+X" (usa a 8ª imagem como fundo)
  const moreBgImage = useMemo(() => {
    if (!hasMoreThanThreshold) return "";
    const eighth = all[PREVIEW_REAL_ITEMS]; // index 7 (8º item)
    return eighth?.image || "";
  }, [all, hasMoreThanThreshold]);

  return (
    <div className="pi-wrap" onKeyDown={onKeyDown}>
      {/* TABS */}
      <div className="pi-tabs-top" role="tablist" aria-label="Exemplos">
        <button
          type="button"
          role="tab"
          aria-selected={view === "recomendacoes"}
          className={`pi-tab ${view === "recomendacoes" ? "active" : ""}`}
          onClick={() => setView("recomendacoes")}
        >
          Recomendações Waveled
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "mais"}
          className={`pi-tab ${view === "mais" ? "active" : ""}`}
          onClick={() => setView("mais")}
        >
          Ver todos exemplos
        </button>
      </div>

      {/* ===== VISTA: Recomendações Waveled ===== */}
      {view === "recomendacoes" && len > 0 && (
        <div className="pi-root">
          <div
            className="pi-left"
            onMouseEnter={stop}
            onMouseLeave={start}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            role="region"
            aria-roledescription="carrossel"
            aria-label="Recomendações Waveled"
          >
            <div
              className="pi-track"
              style={{
                width: `${len * 100}%`,
                transform: `translateX(-${(100 / len) * idx}%)`,
              }}
            >
              {modelData.map((it, i) => (
                <div key={it.key} className="pi-slide">
                  <img
                    src={it.image.startsWith("http") ? it.image : API_BASE + it.image}
                    alt={it.title}
                    role="button"
                    style={{ cursor: "zoom-in" }}
                    onClick={() => openLightbox(i)}
                  />
                </div>
              ))}
            </div>

            {len > 1 && (
              <>
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

                <div className="pi-dots" aria-label="Navegação de slides">
                  {modelData.map((_, i) => (
                    <button
                      key={i}
                      className={`pi-dot ${i === idx ? "active" : ""}`}
                      onClick={() => goTo(i)}
                      aria-label={`Ir para slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="pi-right" onMouseEnter={stop} onMouseLeave={start}>
            {modelData.map((item, i) => (
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
        </div>
      )}

      {/* ===== VISTA: Ver todos exemplos (grid) ===== */}
      {view === "mais" && (
        <div className="pi-grid-wrap" aria-label="Grelha de exemplos">
          <div className="pi-grid">
            {gridItems.map((it, i) => (
              <button
                key={it.key}
                type="button"
                className="pi-tile"
                onClick={() => openLightbox(i)}
                title={it.title}
              >
                <img
                  src={it.image.startsWith("http") ? it.image : API_BASE + it.image}
                  alt={it.title}
                  className="pi-tile-img"
                />
              </button>
            ))}

            {/* Tile +X: só quando existir MAIS DE 8 itens */}
            {showMoreTile && (
              <button
                type="button"
                className="pi-tile pi-tile-more"
                onClick={() => setShowAllGrid(true)}
                aria-label={`Ver mais ${remaining} exemplos`}
                title={`Ver mais ${remaining} exemplos`}
              >
                {moreBgImage ? (
                  <img
                    src={moreBgImage.startsWith("http") ? moreBgImage : API_BASE + moreBgImage}
                    alt="Mais exemplos"
                    className="pi-tile-img"
                  />
                ) : null}

                <div className="pi-more-overlay">
                  <span className="pi-more-text">+{remaining}</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .pi-wrap {
          position: relative;
        }

        .pi-tabs-top {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 0 0 30px;
          flex-wrap: wrap;
        }
        .pi-tab {
          background: #ffffff;
          color: #111;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 160ms, color 160ms, border 160ms, transform 160ms;
        }
        .pi-tab:hover {
          transform: translateY(-1px);
        }
        .pi-tab.active {
          background: #1740ff;
          border-color: #1740ff;
          color: #fff;
        }

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

        .pi-grid-wrap {
          width: 100%;
        }
        .pi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }
        @media (max-width: 992px) {
          .pi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }
        }
        @media (max-width: 576px) {
          .pi-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        .pi-tile {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: #f2f2f2;
          border: 0;
          padding: 0;
          cursor: pointer;
          display: block;
          height: 230px;
        }
        .pi-tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .pi-tile-more {
          padding: 0;
        }
        .pi-more-overlay {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(0, 0, 0, 0.25);
        }
        .pi-more-text {
          color: #fff;
          font-size: 44px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
        }
      `}</style>

      <Lightbox
        open={lbOpen}
        close={() => setLbOpen(false)}
        index={lbIndex}
        slides={lbSlides}
        on={{ view: ({ index: i }) => setLbIndex(i) }}
        carousel={{ finite: false }}
      />
    </div>
  );
}

/* =========================================================
   SKELETONS (React-Bootstrap Placeholders)
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

      <IndustriesSkeleton />
    </>
  );
}

/* =========================================================
   PÁGINA: SingleShopSection
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
  const [examples, setExamples] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  function AddChipIcon() {
    setTimeout(() => {
      const svg = "https://ik.imagekit.io/fsobpyaa5i/icons8-chip-50.png";
      const items = document.querySelectorAll("#pills-description ul li");

      items.forEach((li) => {
        if (li.querySelector(".svg-chip")) return;

        const img = document.createElement("img");
        img.classList.add("svg-chip");
        img.src = svg;
        img.alt = "chip";
        li.prepend(img);
      });
    }, 500);
  }

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
        const prodRaw = await fetchJson(`${API_BASE}/api/products/${productId}`);
        const prod = toProduct(prodRaw);
        if (!prod) throw new Error("Produto não encontrado.");
        if (abort) return;
        setItem(prod);

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

        // ==============================
        // PRODUTOS RELACIONADOS (até 4)
        // - tenta mesma categoria
        // - se insuficiente, completa com outros produtos (fallback)
        // ==============================
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
    AddChipIcon();
    return () => {
      abort = true;
    };
  }, [productId]);

  useEffect(() => {
    AddChipIcon();
  });

  const images = useMemo(() => {
    const list = Array.isArray(item?.wl_images) ? item.wl_images : [];
    const normalized = list.map(withHost);
    if (normalized.length === 0 && item?.wl_cover)
      normalized.push(withHost(item.wl_cover));
    return normalized;
  }, [item]);

  const title = safeText(item?.wl_name, "Produto");
  const catName = safeText(item?.wl_category?.wl_name, "Sem categoria");
  const shortDescription = safeText(item?.wl_specs_text, "");

  const examplesRest = useMemo(() => (examples || []).slice(4), [examples]);

  // -------- Lightbox do produto (YARL) --------
  const [lbOpenProduct, setLbOpenProduct] = useState(false);
  const [lbIndexProduct, setLbIndexProduct] = useState(0);
  const lbSlidesProduct = useMemo(
    () => images.map((src) => ({ src, title })),
    [images, title]
  );
  const openProductLightbox = (i = 0) => {
    setLbIndexProduct(i);
    setLbOpenProduct(true);
  };

  // -------- Lightbox dos exemplos (YARL) — mantém para o bloco de baixo --------
  const [lbOpenExamples, setLbOpenExamples] = useState(false);
  const [lbIndexExamples, setLbIndexExamples] = useState(0);
  const lbSlidesExamples = useMemo(
    () =>
      (examplesRest || [])
        .map((ex) => ({
          src: withHost(ex?.image),
          title: safeText(ex?.title, "Exemplo"),
        }))
        .filter((x) => !!x.src),
    [examplesRest]
  );
  const openExamplesLightbox = (i = 0) => {
    setLbIndexExamples(i);
    setLbOpenExamples(true);
  };

  if (loading) return <ProductSkeleton />;

  if (error) {
    return (
      <div className="container" style={{ padding: "3rem 0" }}>
        <h4 style={{ color: "crimson" }}>{error}</h4>
      </div>
    );
  }

  return (
    <>
      {/* BLOCO DINÂMICO (só se houver exemplos) */}
      {(examples || []).length > 0 && (
        <section className="section bg-grey pt-4">
          <div className="container pt-4 pb-4">
            <ProductIndustries examples={examples} />
          </div>
        </section>
      )}

      <div className="section">
        <div className="container">
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
                        <Link href={`/shop?category=${encodeURIComponent(catName)}`}>
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
                      <a
                        href="#"
                        className="tekup-default-btn col-lg-12 col"
                        onClick={open}
                      >
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

      {/* TABS */}
      <br />
      <div className="section tekup-section-padding pt-5 pb-2">
        <div className="container">
          <div className="tekup-product-tab">
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "description" ? "active" : ""}`}
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
                    dangerouslySetInnerHTML={{
                      __html: item.wl_description_html,
                    }}
                  />
                ) : (
                  <>
                    <p className="mt-3">
                      Desenvolvemos soluções LED com foco em eficiência, longevidade
                      e qualidade de imagem.
                    </p>
                    <p>A Waveled acompanha consultoria, projeto, instalação e suporte.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCOS ADICIONAIS (restantes exemplos) */}
      {examplesRest.length > 0 && (
        <section className="mt-4 bg-black product-details-slider-solution">
          <div className="section tekup-section-padding">
            <div className="container">
              <hr />
              <br />
              <div className="col">
                <div className="d-flex col justify-content-between">
                  <div>
                    <h3 className="text-light mt-4">Indústrias e Soluções Aplicáveis</h3>
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
                        <strong className="text-silver d-block mt-2">{exTitle}</strong>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==============================
          PRODUTOS RELACIONADOS (NO FINAL)
          ============================== */}
      {Array.isArray(related) && related.length > 0 && (
        <div className="tekup-related-product-section pb-2">
          <br /><br />
          <div className="container">
            <div className="tekup-section-title center">
              <h2>Produtos relacionados</h2>
            </div>
          </div>

          <div className="container">
            <div className="row">
              {related.slice(0, 4).map((p) => {
                const pId = p?._id;
                const pName = safeText(p?.wl_name, "Produto");
                const pCat = safeText(p?.wl_category?.wl_name, "Sem categoria");
                const pCover =
                  withHost(p?.wl_cover) ||
                  withHost(Array.isArray(p?.wl_images) ? p.wl_images?.[0] : "") ||
                  "";

                const href = pId ? `/single-shop?product=${pId}` : "#";

                return (
                  <div key={pId || pName} className="col-xl-3 col-lg-4 col-md-6">
                    <div className="tekup-shop-wrap">
                      <div className="tekup-shop-thumb">
                        <Link href={href}>
                          <img
                            alt={pName}
                            src={pCover}
                            style={{ height: 300, objectFit: "contain" }}
                          />
                        </Link>

                        <Link className="tekup-shop-btn" href={href}>
                          Saiba Mais
                        </Link>
                      </div>

                      <div className="tekup-shop-data">
                        <Link href={href}>
                          <h5 title={pName}>{truncate(pName, 44)}</h5>
                        </Link>
                        <small className="text-muted">Categoria: {pCat}</small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> 
          </div>
        </div>
      )}

      {/* Lightbox da galeria principal (YARL) */}
      <Lightbox
        open={lbOpenProduct}
        close={() => setLbOpenProduct(false)}
        index={lbIndexProduct}
        slides={lbSlidesProduct}
        on={{ view: ({ index: i }) => setLbIndexProduct(i) }}
        carousel={{ finite: false }}
      />

      {/* Lightbox dos exemplos (YARL) */}
      <Lightbox
        open={lbOpenExamples}
        close={() => setLbOpenExamples(false)}
        index={lbIndexExamples}
        slides={lbSlidesExamples}
        on={{ view: ({ index: i }) => setLbIndexExamples(i) }}
        carousel={{ finite: false }}
      />
    </>
  );
}
