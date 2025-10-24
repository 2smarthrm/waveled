/* -------------------------------------------
   Single product page + ProductIndustries
   - Agora ordena exemplos por createdAt ASC
   - Primeiros 4 (mais antigos) no ProductIndustries
   - Restantes na secção "Indústrias e Soluções Aplicáveis"
   - Ambos os blocos somem se não houver exemplos
--------------------------------------------*/

"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://waveledserver.vercel.app";
const IMG_HOST = process.env.NEXT_PUBLIC_IMG_HOST || "https://waveledserver.vercel.app";

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

/* =========================
   ProductIndustries (usa até 4 exemplos)
========================= */
function ProductIndustries({ examples = [] }) {
  // usa no máximo 4 itens (title, description, image) vindos da API
  const data = useMemo(
    () =>
      (examples || [])
        .slice(0, 4)
        .map((e) => ({
          title: safeText(e?.title, "—"),
          description: safeText(e?.description, ""),
          image: withHost(e?.image),
        }))
        .filter((e) => e.image),
    [examples]
  );

  const len = data.length;
  const [activeIndex, setActiveIndex] = useState(0);

  if (len === 0) return null;

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  return (
    <div className="product-industries-and-pics">
      <div className="image-area">
        <Carousel
          swipeable
          draggable
          autoPlay
          autoPlaySpeed={3500}
          infinite
          showDots
          arrows={false}
          responsive={responsive}
          afterChange={(nextSlide) => setActiveIndex(nextSlide % len)}
        >
          {data.map((it, index) => (
            <div className="image" key={index}>
              <img src={it.image} alt={`exemplo-${index}`} />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="industries-blocks">
        {data.map((item, index) => (
          <article
            key={index}
            className={`card-industrie ${activeIndex === index ? "active" : ""}`}
          >
            <h5>{item.title}</h5>
            {item.description && <p>{item.description}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

/* =========================
   Página do produto
========================= */
export default function SingleShopSection() {
  // Em vez de useSearchParams()
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
    window.addEventListener("popstate", readProduct);
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
        const prodRaw = await fetchJson(`${API_BASE}/api/products/${productId}`);
        const prod = toProduct(prodRaw);
        if (!prod) throw new Error("Produto não encontrado.");
        if (abort) return;
        setItem(prod);

        // 2) Exemplos (por categoria e produto) — inverter a ordem atual (usar os mais antigos primeiro)
        const categoryId =
          prod?.wl_category?._id || prod?.wl_categoryId || prod?.categoryId;
        const qs = new URLSearchParams();
        if (categoryId) qs.set("categoryId", categoryId);
        qs.set("productId", prod._id);

        try {
          const examplesRaw = await fetchJson(`${API_BASE}/api/examples?${qs.toString()}`);
          if (!abort) {
            const arr = toArray(examplesRaw);
            // A API devolve createdAt DESC; queremos ASC (primeiros adicionados primeiro)
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

        // 3) Relacionados (igual ao teu fluxo)
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
  const shortDescription = safeText(item?.wl_specs_text, "");

  // exemplos processados (já vêm em ASC; os primeiros 4 são os "primeiros adicionados")
  const examplesTop4 = useMemo(() => (examples || []).slice(0, 4), [examples]);
  const examplesRest = useMemo(() => (examples || []).slice(4), [examples]);

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
      {/* BLOCO DINÂMICO (só se houver exemplos) */}
      {examplesTop4.length > 0 && (
        <section className="section bg-grey pt-4 pb-4">
          <div className="container pt-4 pb-4">
            <ProductIndustries examples={examplesTop4} />
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
                                : "1px solid rgba(0,0,0,.1)"
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
                  <strong>SKU:</strong> <span className="text-secondary">{sku}</span>
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
                      {catName !== "Sem categoria" && (
                        <>
                          , <Link href="#">{catName}</Link>
                        </>
                      )}
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

      {/* BLOCOS ADICIONAIS (restantes exemplos) — só se houver exemplosRest */}
      {examplesRest.length > 0 && (
        <>
          <br />
          <br />
          <section className="mt-4 bg-black ">
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
                      const title = safeText(ex?.title, "Exemplo");
                      if (!img) return null;
                      return (
                        <article key={index} className="col-md-3 mb-3">
                          <img
                            src={img}
                            alt={title}
                            style={{ width: "100%", borderRadius: 8, objectFit: "cover" }}
                          />
                          <strong className="text-silver d-block mt-2">{title}</strong>
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
                  <div
                    className="mt-3"
                    dangerouslySetInnerHTML={{ __html: item.wl_description_html }}
                  />
                ) : (
                  <>
                    <p className="mt-3">
                      Desenvolvemos soluções LED com foco em eficiência, longevidade e qualidade de
                      imagem.
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
                        <img
                          style={{ height: "300px", objectFit: "contain" }}
                          src={cover}
                          alt={pTitle}
                        />
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
