"use client";

/**
 * Página /single-shop sem useSearchParams()
 * - Lê ?product=<id> via window.location.search no cliente
 * - Evita o erro: "useSearchParams() should be wrapped in a suspense boundary"
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://waveledserver.vercel.app";
const IMG_HOST = "https://waveledserver.vercel.app";

const isAbsoluteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const withHost = (u) => (u ? (isAbsoluteUrl(u) ? u : `${IMG_HOST}${u}`) : "");
const safeText = (s, fb = "") => (typeof s === "string" && s.trim() ? s : fb);

const toArray = (raw) =>
  Array.isArray(raw) ? raw :
  Array.isArray(raw?.data) ? raw.data :
  Array.isArray(raw?.items) ? raw.items : [];

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

export default function SingleShopSection() {
  // Em vez de useSearchParams()
  const [productId, setProductId] = useState(null);

  // Lê o query param no cliente e reage a alterações do histórico
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
    // Atualiza quando o utilizador navega no histórico
    window.addEventListener("popstate", readProduct);
    // Atualiza quando Next.js faz pushState (capturamos via monkey-patch em ambientes simples)
    const _pushState = history.pushState;
    history.pushState = function (...args) {
      const ret = _pushState.apply(this, args);
      readProduct();
      return ret;
    };
    const _replaceState = history.replaceState;
    history.replaceState = function (...args) {
      const ret = _replaceState.apply(this, args);
      readProduct();
      return ret;
    };
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
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let abort = false;

    async function run() {
      // enquanto ainda não apurámos o productId no cliente, mostra loading
      if (productId === null) {
        setLoading(true);
        setError("");
        setItem(null);
        setRelated([]);
        return;
      }

      if (!productId) {
        setError("Falta o parâmetro ?product=<id>.");
        setLoading(false);
        setItem(null);
        setRelated([]);
        return;
      }

      setLoading(true);
      setError("");
      setItem(null);
      setRelated([]);
      setActiveImage(0);

      try {
        const prodRaw = await fetchJson(`${API_BASE}/api/products/${productId}`);
        const prod = toProduct(prodRaw);
        if (!prod) throw new Error("Produto não encontrado.");
        if (abort) return;

        setItem(prod);

        // Relacionados por categoria
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

        // Preenche caso faltem itens
        if ((relatedList?.length || 0) < 4) {
          try {
            const moreRaw = await fetchJson(`${API_BASE}/api/products`);
            if (abort) return;
            const more = toArray(moreRaw);
            const forbiddenIds = new Set([prod._id, ...relatedList.map((p) => p._id)]);
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
    if (normalized.length === 0 && item?.wl_cover) normalized.push(withHost(item.wl_cover));
    return normalized;
  }, [item]);

  const title = safeText(item?.wl_name, "Produto");
  const sku = safeText(item?.wl_sku, "—");
  const catName = safeText(item?.wl_category?.wl_name, "Sem categoria");

  if (loading) {
    return (
      <div className="container" style={{ padding: "3rem 0" }}>
        <h4>A carregar…</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "3rem 0" }}>
        <h4 style={{ color: "crimson" }}>{error}</h4>
      </div>
    );
  }

  return (
    <>
      <div className="section tekup-section-padding-top">
        <div className="container">
          <div className="row">
            {/* GALERIA */}
            <div className="col-lg-6">
              <div className="tekup-tab-slider">
                <div className="tekup-tabs-container">
                  <div className="tekup-tabs-wrapper">
                    <div className="tabContent">
                      <img
                        src={images[activeImage] || ""}
                        alt={`${title} — imagem`}
                        style={{ width: "100%", borderRadius: 12 }}
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
                      >
                        <img
                          src={src}
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

                <h6 style={{ marginTop: 8 }}>
                  <strong>SKU:</strong>{" "}
                  <span className="text-secondary">{sku}</span>
                </h6>

                <div className="tekup-product-info mt-4">
                  <h5>Informação rápida</h5>
                  <ul>
                    <li>
                      <span>Categoria: </span>
                      {catName === "Sem categoria" ? (
                        <span>{catName}</span>
                      ) : (
                        <Link href={`/shop?category=${encodeURIComponent(catName)}`}>{catName}</Link>
                      )}
                    </li>
                    <li>
                      <span>Tags: </span>
                      <Link href="#">Waveled</Link>
                      {catName !== "Sem categoria" && <> , <Link href="#">{catName}</Link></>}
                    </li>
                  </ul>
                </div>

                <div className="tekup-product-wrap mt-4">
                  <Link className="tekup-product-btn" href="/contact-us">
                    Comprar Agora
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="section tekup-section-padding">
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
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "specification" ? "active" : ""}`}
                  id="pills-specification-tab"
                  onClick={() => setActiveTab("specification")}
                >
                  Especificações
                </button>
              </li>
              <li className="nav-item d-none" role="presentation">
                <button
                  className={`nav-link ${activeTab === "downloads" ? "active" : ""}`}
                  id="pills-downloads-tab"
                  onClick={() => setActiveTab("downloads")}
                >
                  Downloads
                </button>
              </li>
            </ul>

            <div className="tab-content" id="pills-tabContent">
              <div
                className={`tab-pane fade ${activeTab === "description" ? "show active" : ""}`}
                id="pills-description"
                role="tabpanel"
                aria-labelledby="pills-description-tab"
                tabIndex={0}
              >
                {item?.wl_description_html ? (
                  <div className="mt-3" dangerouslySetInnerHTML={{ __html: item.wl_description_html }} />
                ) : (
                  <>
                    <p className="mt-3">
                      Desenvolvemos soluções LED com foco em eficiência, longevidade e qualidade de imagem.
                    </p>
                    <p>A Waveled acompanha consultoria, projeto, instalação e suporte.</p>
                  </>
                )}
              </div>

              <div
                className={`tab-pane fade ${activeTab === "specification" ? "show active" : ""}`}
                id="pills-specification"
                role="tabpanel"
                aria-labelledby="pills-specification-tab"
                tabIndex={0}
              >
                {item?.wl_specs_text ? (
                  <div className="mt-3" dangerouslySetInnerHTML={{ __html: item.wl_specs_text }} />
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
                className={`tab-pane fade ${activeTab === "downloads" ? "show active" : ""}`}
                id="pills-downloads"
                role="tabpanel"
                aria-labelledby="pills-downloads-tab"
                tabIndex={0}
              >
                <div className="d-flex flex-wrap gap-3 mt-3">
                  {Array.isArray(item?.wl_downloads) && item.wl_downloads.length > 0 ? (
                    item.wl_downloads.map((d, i) => (
                      <a
                        key={i}
                        className="tekup-default-btn"
                        href={isAbsoluteUrl(d?.url) ? d.url : `${IMG_HOST}${d?.url || ""}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {safeText(d?.label, `Download ${i + 1}`)}
                      </a>
                    ))
                  ) : (
                    <>
                      <a className="tekup-default-btn" href="#" onClick={(e) => e.preventDefault()}>
                        Download Datasheet
                      </a>
                      <a className="tekup-default-btn" href="#" onClick={(e) => e.preventDefault()}>
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

      {/* PRODUTOS RELACIONADOS */}
      <div className="tekup-related-product-section">
        <div className="container">
          <div className="tekup-section-title center">
            <h2>Produtos relacionados</h2>
          </div>
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
                        <img style={{ height: "300px", objectFit: "contain" }} src={cover} alt={pTitle} />
                      </Link>
                      <Link className="tekup-shop-btn" href={`/single-shop?product=${p._id}`}>
                        Saiba Mais
                      </Link>
                    </div>
                    <div className="tekup-shop-data">
                      <Link href={`/single-shop?product=${p._id}`}>
                        <h5 title={p?.wl_name || ""}>{pTitle}</h5>
                      </Link>
                      <h6>
                        SKU: <span className="text-secondary">{pSku}</span>
                      </h6>
                      {pCat && <small className="text-muted">Categoria: {pCat}</small>}
                    </div>
                  </div>
                </div>
              );
            })}

            {related.length === 0 && (
              <div className="col-12">
                <p className="text-muted">Sem produtos relacionados para apresentar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
