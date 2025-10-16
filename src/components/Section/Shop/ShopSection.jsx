

"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState, Suspense } from "react";
import Slider from "react-slick";
import { useSearchParams } from "next/navigation";

const BASE_URL = "https://waveledserver.vercel.app";

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
                <article key={i} className="featured-article skeleton">
                  <div className="image skeleton-box" style={{ height: 220 }} />
                  <div className="newbadge skeleton-box" style={{ width: 64, height: 24 }} />
                  <h3 className="skeleton-box" style={{ width: "60%", height: 24 }}>&nbsp;</h3>
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
        "https://video-previews.elements.envatousercontent.com/h264-video-previews/2ec50093-3a2f-4608-a78c-0ca3b126791e/58796892.mp4",
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
        if (!abort) setData(json.data);
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
      `}</style>

      {/* HEADER + 3 últimos (latest3) */}
      <div className="section tekup-section-padding">
        <aside className="featured-top-products">
          <div className="container">
            <h1 className="text-dark">{loading ? "A carregar..." : err ? "Erro" : PageTitle}</h1>
            <br />
            {err ? (
              <p className="text-danger">{err}</p>
            ) : loading ? (
              <div className="row">
                {[0, 1, 2].map((i) => (
                  <article key={i} className="featured-article skeleton">
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
            ) : (
              <div className="row">
                {(data?.latest3 || []).map((item) => (
                  <article key={item._id} className="featured-article">
                    <div className="image" style={{ backgroundColor: "#f7f7f7" }}>
                      <img
                        style={{ mixBlendMode: "multiply", objectFit: "contain" }}
                        src={imgSrc(item)}
                        alt={item.wl_name}
                      />
                    </div>
                    <div className="newbadge">Novo</div>
                    <h3>
                      {item.wl_name.length > 50 ? item.wl_name.substring(0, 50) + "..." : item.wl_name}
                    </h3>
                    <small className="sku-code">
                      <strong>SKU :</strong>
                      <span className="text-primary"> {skuText(item)} </span>
                    </small>
                    <div className="d-flex gap-3 mt-3">
                      <Link className="tekup-default-btn bg-black" href={`/single-shop?product=${item._id}`}>
                        Saiba Mais
                      </Link>
                      <Link className="tekup-default-btn" href={`/single-shop?product=${item._id}`}>
                        Comprar
                      </Link>
                    </div>
                  </article>
                ))}
                {data && data.latest3.length === 0 && (
                  <p className="text-muted">Sem produtos recentes nesta categoria.</p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* VÍDEO 1 (mantido) */}
      <aside>
        {Videos.section1?.source ? (
          <div className="video-shop-large-section">
            <div className="video-shop-large">
              <video src={Videos.section1.source} autoPlay muted loop></video>
              <div className="over-video-large">
                <div>
                  <div className="tekup-section-padding">
                    <div className="container">
                      <h2>{Videos.section1.text1}</h2>
                      <h2>{Videos.section1.text2}</h2>
                      <br />
                      <Link href={"#"}>
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
              <strong className="text-primary">Produto em destaque</strong>
              <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <h2 className="text-dark">{data.topProduct.wl_name}</h2>
              </div>
              <div className="image text-center" style={{ maxWidth: 720, margin: "0 auto" }}>
                <img
                  src={imgSrc(data.topProduct)}
                  alt={data.topProduct.wl_name}
                  style={{ width: "100%", height: "auto", objectFit: "contain" }}
                />
              </div>
              <br />
              <Link className="tekup-default-btn" href={`single-shop?product=${data.topProduct._id}`}>
                Saiba mais agora
              </Link>
            </div>
          ) : (
            <div className="content-centered-block"></div>
          )}
        </div>
      </aside>

      {/* VÍDEO 2 (mantido) */}
      <aside className={data?.topProduct ? "" : "d-none"}>
        {Videos.section2?.source ? (
          <div className="video-shop-large-section">
            <div className="video-shop-large">
              <video src={Videos.section2.source} autoPlay muted loop></video>
              <div className="over-video-large">
                <div>
                  <div className="tekup-section-padding">
                    <div className="container">
                      <h2>{Videos.section2.text1}</h2>
                      <h2>{Videos.section2.text2}</h2>
                      <br />
                      <Link href={"#"}>
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
                    <article key={i} className="card skeleton" style={{ width: 280 }}>
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
                  ))}
                </div>
              ) : (data?.others || []).length > 0 ? (
                <Slider {...settings}>
                  {data.others.map((item) => (
                    <article key={item._id}>
                      <div className="card-content" style={{ minHeight: "530px" }}>
                        <strong className="sku">SKU-{skuText(item)}</strong>
                        <Link href={`/single-shop?product=${item._id}`}>
                          <h5>
                            {item.wl_name.split("").length > 45
                              ? item.wl_name.substring(0, 45) + "..."
                              : item.wl_name}
                          </h5>
                        </Link>
                        <p className="text-muted">{/* pequena sinopse opcional */}</p>
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
