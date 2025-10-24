// ond etem o Últimos 10 produtos a diea era esta dados etarem em Mais produtos em ... no carousel e manter o estilo anteriro e nao suar os class card dos bootsapp 
"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState, Suspense } from "react";
import Slider from "react-slick";
import { useSearchParams } from "next/navigation";
import CategoryGridGalery from "./CategoryGridGalery";

const BASE_URL = "https://waveledserver.vercel.app";
const isHttpOrHttps = s => /^(https?):\/\//i.test(s);
const baseURL = isHttpOrHttps("") === true ? " " : "https://waveledserver.vercel.app";

/**
 * Wrapper que satisfaz o Next.js:
 * a hook useSearchParams() vive no filho e o pai usa <Suspense>.
 */
export default function ShopSection() {
  return (
    <Suspense
      fallback={
        <div className="tekup-section-padding">
          <div className="container">
            <h1 className="text-dark">A carregar...</h1>
            <div className="row" style={{ marginTop: 24 }}>
              {[0, 1, 2].map((i) => (
                <article key={i} className="featured-article skeleton col-12 col-md-4 mb-4">
                  <div className="image skeleton-box" style={{ height: 220 }} />
                  <div className="newbadge skeleton-box" style={{ width: 64, height: 24 }} />
                  <h3 className="skeleton-box" style={{ width: "60%", height: 24 }}>
                    &nbsp;
                  </h3>
                  <small className="sku-code skeleton-box" style={{ width: "40%", height: 16 }}>
                    &nbsp;
                  </small>
                  <div className="d-flex gap-3 mt-3">
                    <span className="tekup-default-btn bg-black skeleton-box" style={{ width: 120, height: 40 }} />
                    <span className="tekup-default-btn skeleton-box" style={{ width: 120, height: 40 }} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopSectionInner />
    </Suspense>
  );
}

function ShopSectionInner() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") || "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Estado para paginação dos "latest"
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: false,
      speed: 500,
      arrows: false,
      slidesToShow: 3.6,
      slidesToScroll: 3.6,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
        { breakpoint: 992, settings: { slidesToShow: 2.4, slidesToScroll: 2.4 } },
        { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 1.1, slidesToScroll: 1.1 } },
      ],
    }),
    []
  );

  // Manténs os teus vídeos e labels
  const Videos = {
    section1: {
      source:
        "https://video-previews.elements.envatousercontent.com/h264-video-previews/d2789105-23a4-4fe8-8f1f-821c732ff74e/54867805.mp4",
      text1: "Orçamentos para medir e no mesmo dia ",
      text2: "para todo tipo de négocio",
    },
    section2: {
      source:
        "https://video-previews.elements.envatousercontent.com/h264-video-previews/09240423-e70c-4ede-91d3-dac20b3d3100/58056233.mp4",
      text1: "Orçamentos para medir e no mesmo dia ",
      text2: "para todo tipo de négocio",
    },
  };

  useEffect(() => {
    let abort = false;
    async function load() {
      if (!categoryId) {
        setErr("Parâmetro ?category em falta.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr("");
      try {
        const url = `${BASE_URL}/api/category/${encodeURIComponent(categoryId)}/bundle`;
        const resp = await fetch(url, {
          method: "GET",
          credentials: "include", // importante: a tua API usa sessão
          headers: { "Content-Type": "application/json" },
        });
        const json = await resp.json();
        if (!resp.ok || !json?.ok) {
          throw new Error(json?.error || `Request falhou (${resp.status})`);
        }
        if (!abort) {
          setData(json.data);
          setCurrentPage(1); // reset página quando muda categoria
        }
      } catch (e) {
        if (!abort) setErr(e?.message || "Erro ao carregar dados.");
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, [categoryId]);

  // Helpers
  const firstImage = (p) => (p?.wl_images && p.wl_images.length ? p.wl_images[0] : "");
  const imgSrc = (p) => (firstImage(p) ? `${BASE_URL}${firstImage(p)}` : "/placeholder.png");
  const skuText = (p) => (p?.wl_sku && p.wl_sku.trim()) || "—";
  const PageTitle = data?.category?.wl_name || "Categoria";

  // Util para remover duplicados por _id preservando ordem
  const uniqById = (arr) => {
    const seen = new Set();
    const out = [];
    for (const it of arr || []) {
      if (it && it._id && !seen.has(it._id)) {
        seen.add(it._id);
        out.push(it);
      }
    }
    return out;
  };

  // Fonte de “latest”:
  // 1) Se vier latestAll / recent da API, usa.
  // 2) Caso contrário, compõe com latest3 + topProduct + others.
  const latestAll = useMemo(() => {
    if (!data) return [];
    const apiLatest = data.latestAll || data.recent || [];
    if (apiLatest && apiLatest.length) return uniqById(apiLatest);

    const composed = [
      ...(data.latest3 || []),
      ...(data.topProduct ? [data.topProduct] : []),
      ...(data.others || []),
    ];
    return uniqById(composed);
  }, [data]);

  // Paginação (9 por página)
  const totalItems = latestAll.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const startIdx = (currentPage - 1) * perPage;
  const pageItems = latestAll.slice(startIdx, startIdx + perPage);

  const goToPage = (p) => {
    const safe = Math.min(Math.max(1, p), totalPages);
    setCurrentPage(safe);
    // scroll suave até à grid de latest
    if (typeof window !== "undefined") {
      const el = document.getElementById("latest-grid-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // "Últimos 10" (para a secção final)
  const last10 = useMemo(() => latestAll.slice(0, 10), [latestAll]);

  return (
    <div>
      {/* GLOBAIS para o slick e cartões */}
      <style jsx global>{`
        /* gutter horizontal no slick */
        .products-carousel .slick-list {
          margin: 0 -12px;
        }
        .products-carousel .slick-slide {
          padding: 0 12px;
        }
        .products-carousel article .card-content {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 16px;
          padding: 16px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .products-carousel article .image {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 12px;
          overflow: hidden;
          background: #f7f7f7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .products-carousel article .image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
        /* skeleton básicos */
        .skeleton-box {
          background: linear-gradient(90deg, #eee, #f5f5f5, #eee);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        /* Cartões da grid */
        .product-card {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 16px;
          padding: 12px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .product-card .img-wrap {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 12px;
          overflow: hidden;
          background: #f7f7f7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-card img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
        .product-card h5 {
          font-size: 1rem;
          line-height: 1.25rem;
          margin: 0;
        }
      `}</style>

      {/* HEADER (título da categoria) */}
      <div className="section tekup-section-padding pb-0 mb-0">
        <aside className="featured-top-products pb-0">
          <div className="container">
            <h2 className="text-dark">
              {loading ? "A carregar..." : err ? "Erro" :  PageTitle}
            </h2>
            <br />
            {err ? (
              <p className="text-danger">{err}</p>
            ) : null}
          </div>
        </aside>
      </div>

      {/* === LATEST: GRADE + PAGINAÇÃO (9 por página) === */}
      <section id="latest-grid-anchor" className="section pt-0 pb-0">
        <div className="container">
          {loading ? (
            <div className="row">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4 mb-4">
                  <div className="product-card">
                    <div className="img-wrap skeleton-box" />
                    <div className="skeleton-box" style={{ width: "70%", height: 20 }} />
                    <div className="skeleton-box" style={{ width: "40%", height: 16 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : latestAll.length === 0 ? (
            <p className="text-muted">Sem produtos recentes nesta categoria.</p>
          ) : (
            <>
              <div className="row">
                {pageItems.map((item) => (
                  <div key={item._id} className="col-12 col-sm-6 col-lg-4 mb-4">
                      <article key={item._id} className="featured-article">
                    <div
                      className="image d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: "#f7f7f7",}}>
                      <img
                        style={{
                          mixBlendMode: "multiply",
                          objectFit: "contain",
                          maxWidth:"250px",
                          padding:"20px"
                        }}
                        src={imgSrc(item)}
                        alt={item.wl_name}
                      />
                    </div>
                    <div className="text-left">
                      <Link href={`/single-shop?product=${item._id}`}>
                        <h4 className="text-left mb-4">
                          {item.wl_name.length > 60
                            ? item.wl_name.substring(0, 60) + "..."
                            : item.wl_name}
                        </h4>
                      </Link> 
                    </div>
                  </article>
                  </div>
                ))}
              </div>

              {/* Paginação Bootstrap centrada */}
              {totalPages > 1 && (
                <nav aria-label="Paginação de produtos" className="mb-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => goToPage(currentPage - 1)} aria-label="Anterior">
                        «
                      </button>
                    </li>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const page = idx + 1;
                      return (
                        <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                          <button className="page-link" onClick={() => goToPage(page)}>
                            {page}
                          </button>
                        </li>
                      );
                    })}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => goToPage(currentPage + 1)} aria-label="Seguinte">
                        »
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
        <br />
      </section>

      {/* VÍDEO 1 (mantido) */}
      <aside>
        {Videos.section1?.source ? (
          <div className="video-shop-large-section">
            <div className="video-shop-large">
              <video src={Videos.section1.source} autoPlay muted loop />
              <div className="over-video-large">
                <div>
                  <div className="tekup-section-padding">
                    <div className="container">
                      <h2>{Videos.section1.text1}</h2>
                      <h2>{Videos.section1.text2}</h2>
                      <br />
                      <Link href={"/contact-us"}>
                        <button className="tekup-default-btn">Solicitar Orçamento</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </aside>

      {/* PRODUTO EM DESTAQUE (topProduct) */}
      <aside className="section tekup-section-padding">
        <div className="container">
          {loading ? (
            <div className="content-centered-block">
              <strong className="text-dark">Produto em destaque</strong>
              <div className="image text-center skeleton-box" style={{ height: 280 }} />
              <br />
              <span className="tekup-default-btn skeleton-box">&nbsp;</span>
            </div>
          ) : data?.topProduct ? (
            <div className="content-centered-block">
              <div className="d-block">
                <div className="image" style={{ maxWidth: 720, margin: "0 auto" }}>
                  <img
                    src={imgSrc(data.topProduct)}
                    alt={data.topProduct.wl_name}
                    style={{ width: "100%", height: "auto", objectFit: "contain" }}
                  />
                </div>
              </div>
              <div className="black-box bg-black">
                <strong className="text-primary">Produto em destaque</strong>
                <div>
                  <div style={{ maxWidth: 720 }}>
                    <h2 className="text-light mb-2 mt-2">{data.topProduct.wl_name}</h2>
                  </div>
                </div>
                <div>
                  <small className="text-light">{data.topProduct.wl_specs_text}</small>
                </div>
                <div className="mt-2">
                  <Link className="tekup-default-btn" href={`single-shop?product=${data.topProduct._id}`}>
                    Saiba mais agora
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="content-centered-block" />
          )}
        </div>
      </aside>

      <section className="section tekup-section-padding pb-5 pt-0" style={{ paddingLeft: "40px", paddingRight: "40px" }}>
        <CategoryGridGalery categorycode={categoryId} />
      </section>

      <section className="gradient-category-section">
        <div className="section tekup-section-padding">
          <div className="container">
            <h2>
              "Os nossos clientes adoram. O quiosque com ecrã transparente é deslumbrante, inovadora e futurista."
            </h2>
            <p>-Os melhores produtos de toda europa</p>
          </div>
        </div>
      </section>

      {/* CARROSSEL “OUTROS PRODUTOS” (others) */}
      <aside>
        <div className="products-carousel">
          <div className="carousel-featured-products">
            <div className="container">
              <h2>
                {data?.category?.wl_name ? `Mais produtos em ${data.category.wl_name}` : "Mais produtos"}
              </h2>
              <br />
              {loading ? (
                <div className="row">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                      <article className="card skeleton">
                        <div className="card-content">
                          <strong className="sku skeleton-box" style={{ width: "40%", height: 16 }}>
                            &nbsp;
                          </strong>
                          <h5 className="skeleton-box" style={{ width: "70%", height: 20 }}>
                            &nbsp;
                          </h5>
                          <p className="skeleton-box" style={{ height: 48 }} />
                          <div className="image skeleton-box" style={{ height: 180 }} />
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              ) : (last10 || []).length > 0 ? (
                <Slider {...settings}>
                  {last10.map((item)  => (
                    <article key={item._id}>
                      <div className="card-content" style={{ minHeight: "530px" }}>
                        <strong className="sku">SKU-{skuText(item)}</strong>
                        <Link href={`/single-shop?product=${item._id}`}>
                          <h5>{item.wl_name.split("").length > 40 ? item.wl_name.substring(0, 40) + "..." : item.wl_name}</h5>
                        </Link>
                        <p className="text-muted">{/* sinopse opcional */}</p>
                        <div className="image" style={{ background: "#ffff" }}>
                          <img
                            style={{ mixBlendMode: "multiply", objectFit: "contain" }}
                            src={imgSrc(item)}
                            alt={item.wl_name}
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </Slider>
              ) : (
                <p className="text-muted">Sem mais produtos nesta categoria.</p>
              )}
            </div>
          </div>
        </div>
      </aside> 
    </div>
  );
}



 
              