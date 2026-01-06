"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ================== CONFIG API ================== */
const isBrowser = typeof window !== "undefined";
const protocol =
  isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE =
  protocol === "https"
    ? "https://waveledserver1.vercel.app"
    : "http://localhost:4000";

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* Extrair categorias dos produtos (simplificado/adaptável ao teu schema) */
function extractProductCategories(p) {
  const list = [];
  if (Array.isArray(p?.wl_categories)) {
    for (const c of p.wl_categories) {
      const id = c?._id || c;
      if (!id) continue;
      list.push({
        id: String(id),
        name: c?.wl_name || c?.name || String(id),
        slug: c?.wl_slug || c?.slug || "",
      });
    }
  } else if (p?.wl_category) {
    const c = p.wl_category;
    const id = c?._id || c;
    if (id) {
      list.push({
        id: String(id),
        name: c?.wl_name || c?.name || String(id),
        slug: c?.wl_slug || c?.slug || "",
      });
    }
  }
  return list;
}

/* ================== ARROWS SLIDER PRINCIPAL ================== */
function NextArrow({ onClick }) {
  return (
    <button
      type="button"
      className="slick-arrow-custom slick-arrow-custom-next"
      onClick={onClick}
      aria-label="Próximo slide"
    >
      →
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      type="button"
      className="slick-arrow-custom slick-arrow-custom-prev"
      onClick={onClick}
      aria-label="Slide anterior"
    >
      ←
    </button>
  );
}

/* ================== HEADER COM SLIDER + CATEGORIAS ================== */

function HeaderWithSlick() {
  /* ====== SLIDER PRINCIPAL (podes depois ligar à categoria) ====== */
  const topCategoriesSlides = useMemo(
    () => [
      {
        id: "1",
        title: "Outdoor Billboards",
        image: "https://ik.imagekit.io/fsobpyaa5i/image-gen%20(34).png",
        link: "/shop?category=billboards",
      },
      {
        id: "2",
        title: "Creative Campaigns",
        image: "https://ik.imagekit.io/fsobpyaa5i/image-gen%20(34).png",
        link: "/shop",
      },
    ],
    []
  );

  /* ====== CATEGORIAS VINDAS DO ENDPOINT ====== */
  const [baseCategories, setBaseCategories] = useState([]); // [{id, name, slug}]
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    let abort = false;

    async function loadCategories() {
      try {
        setLoadingCats(true);

        const raw = await fetchJson(`${API_BASE}/api/products`);
        if (abort) return;

        const items = Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];

        const map = new Map(); // id -> {id, name, slug}

        items.forEach((p) => {
          const cats = extractProductCategories(p);
          cats.forEach((c) => {
            if (!c.id) return;
            if (!map.has(c.id)) {
              map.set(c.id, {
                id: c.id,
                name: c.name || "Categoria",
                slug: c.slug || "",
              });
            }
          });
        });

        let arr = Array.from(map.values());
        if (!arr.length) {
          arr = [
            { id: "trending", name: "Trending Categories", slug: "trending" },
            { id: "ooh", name: "OOH & Billboards", slug: "ooh-billboards" },
            { id: "creative", name: "Creative Campaigns", slug: "creative" },
          ];
        } else {
          arr.sort((a, b) => a.name.localeCompare(b.name, "pt"));
        }

        if (!abort) {
          setBaseCategories(arr);
        }
      } catch (e) {
        if (!abort) {
          // fallback em caso de erro
          setBaseCategories([
            { id: "trending", name: "Trending Categories", slug: "trending" },
            { id: "ooh", name: "OOH & Billboards", slug: "ooh-billboards" },
            { id: "creative", name: "Creative Campaigns", slug: "creative" },
          ]);
        }
      } finally {
        if (!abort) setLoadingCats(false);
      }
    }

    loadCategories();
    return () => {
      abort = true;
    };
  }, []);

  /* ====== LÓGICA SLIDER INFINITO COM UMA ACTIVE ====== */
  const chipTrackRef = useRef(null);
  const segmentWidthRef = useRef(0);

  const baseLen = baseCategories.length || 1;

  // triplica o array para dar efeito "infinito" 
  const extendedCategories = useMemo(() => {
    if (!baseCategories.length) return [];
    return [...baseCategories, ...baseCategories, ...baseCategories];
  }, [baseCategories]);

  const [activeIndex, setActiveIndex] = useState(0); // índice lógico (0..baseLen-1)

  // posicionar no “meio” e corrigir scroll infinite
  useEffect(() => {
    const track = chipTrackRef.current;
    if (!track || !extendedCategories.length) return;

    segmentWidthRef.current = track.scrollWidth / 3;

    requestAnimationFrame(() => {
      track.scrollLeft = segmentWidthRef.current;
    });

    const handleInfiniteScroll = () => {
      const seg = segmentWidthRef.current;
      if (!seg) return;
      const current = track.scrollLeft;
      const min = seg * 0.5;
      const max = seg * 1.5;

      if (current < min) {
        track.scrollLeft = current + seg;
      } else if (current > max) {
        track.scrollLeft = current - seg;
      }
    };

    track.addEventListener("scroll", handleInfiniteScroll);
    return () => track.removeEventListener("scroll", handleInfiniteScroll);
  }, [extendedCategories]);

  const scrollStep = (direction) => {
    const track = chipTrackRef.current;
    if (!track) return;
    const STEP = 220;
    track.scrollTo({
      left: track.scrollLeft + STEP * direction,
      behavior: "smooth",
    });
  };

  // scroll horizontal com roda do rato
  useEffect(() => {
    const track = chipTrackRef.current;
    if (!track) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  // click numa categoria – só 1 active mesmo havendo clones
  const handleCategoryClick = (baseIdx, cat) => {
    setActiveIndex(baseIdx);

    // Aqui podes ligar à lógica de filtros / fetch / trocar slides:
    // ex: console.log("Categoria clicada:", cat.slug);
  };

  /* ====== SETTINGS DO SLIDER PRINCIPAL ====== */
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div className="slick-dots-wrapper">
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: () => <div className="slick-dot-custom" />,
  };

  return (
    <div className="header-slick-wrapper">
      {/* ===== SLIDER DE CATEGORIAS ===== */}
      <div className="category-chips-wrapper">
        <div className="category-shadow shadow-left" />
        <div className="category-shadow shadow-right" />

        <button
          type="button"
          className="chip-arrow chip-arrow-left"
          aria-label="Categorias anteriores"
          onClick={() => scrollStep(-1)}
        >
          ←
        </button>

        <div className="chip-slider-viewport">
          <div className="chip-track" ref={chipTrackRef}>
            {loadingCats && !extendedCategories.length && (
              <span className="chip chip-loading">A carregar categorias…</span>
            )}

            {!loadingCats &&
              extendedCategories.map((cat, index) => {
                const baseIdx = index % baseLen;
                const isActive = baseIdx === activeIndex;

                return (
                  <button
                    key={`${cat.id}-${index}`}
                    type="button"
                    className={`chip ${isActive ? "active" : ""}`}
                    onClick={() => handleCategoryClick(baseIdx, cat)}
                  >
                    {cat.name}
                  </button>
                );
              })}
          </div>
        </div>

        <button
          type="button"
          className="chip-arrow chip-arrow-right"
          aria-label="Próximas categorias"
          onClick={() => scrollStep(1)}
        >
          →
        </button>
      </div>

      {/* ===== SLIDER PRINCIPAL ===== */}
      <div className="hero-slider">
        <Slider {...sliderSettings}>
          {topCategoriesSlides.map((item) => (
            <div key={item.id} className="slide-container">
              <img src={item.image} alt={item.title} className="slide-image" />
              <div className="slide-footer">
                <Link href={item.link} className="tekup-default-btn">
                  Saiba Mais
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* ===== ESTILOS INLINE (podes migrar para o teu CSS global) ===== */}
      <style jsx>{`
        .header-slick-wrapper {
          width: 100%;
          padding: 32px 30px;
          background: #f5f6f8;
          margin-top: 100px;
        }

        .category-chips-wrapper {
          position: relative;
          width: 100%;
          padding: 8px 40px 18px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .chip-slider-viewport {
          position: relative;
          flex: 1;
          overflow: hidden;
        }

        .chip-track {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          overflow-x: scroll;
          scroll-behavior: auto;
        }

        .chip-track::-webkit-scrollbar {
          display: none;
        }
        .chip-track {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .chip {
          padding: 4px 20px;
          border-radius: 999px;
          border:1px solid #d3d7dc;
          background: #ffffff;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.18s ease;
          white-space: nowrap;
        }

        .chip:hover {
          border-color: #111827;
          background: #f3f4f6;
        }

        .chip.active {
          background: #0019ff;
          color: #ffffff;
          border-color: #36425cff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
        }

        .chip-loading {
          opacity: 0.7;
          cursor: default;
        }

        .chip-arrow {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: none;
          background: #ffffff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          flex-shrink: 0;
          transition: transform 0.15s ease, box-shadow 0.15s ease,
            background 0.15s ease;
          z-index: 3;
        }

        .chip-arrow-left:hover {
          transform: translateX(-2px);
        }
        .chip-arrow-right:hover {
          transform: translateX(2px);
        }

        .chip-arrow:hover {
          background: #f3f4f6;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
        }

        .category-shadow {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 40px;
          pointer-events: none;
          z-index: 2;
        }

        .shadow-left {
          left: 40px;
          background: linear-gradient(
            to right,
            rgba(245, 246, 248, 1) 0%,
            rgba(245, 246, 248, 0) 100%
          );
        }

        .shadow-right {
          right: 40px;
          background: linear-gradient(
            to left,
            rgba(245, 246, 248, 1) 0%,
            rgba(245, 246, 248, 0) 100%
          );
        }

        .hero-slider {
          position: relative;
          margin-top: 4px;
          padding: 0 16px;
        }

 
        .slide-container {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
        }

        .slide-image {
          width: 100%;
          height: 500px;
          object-fit: cover;
          display: block;
        }

        .slide-footer {
          position: absolute;
          right: 24px;
          bottom: 24px;
        }

        .shop-btn {
          padding: 10px 22px;
          background: #ffffff;
          border-radius: 999px;
          font-weight: 600;
          color: #111827;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.02em;
        }

        .shop-btn:hover {
          background: #f9fafb;
        }

        .hero-slider :global(.slick-slider) {
          position: relative;
        }

        .slick-arrow-custom {
          position: absolute;
          top: -18px;
          z-index: 6;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: none;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 20px;
          color: #111827;
          transition: transform 0.15s ease, box-shadow 0.15s ease,
            background 0.15s ease;
        }

        .slick-arrow-custom-prev {
          left: calc(100% - 96px);
        }

        .slick-arrow-custom-next {
          left: calc(100% - 52px);
        }

        .slick-arrow-custom:hover {
          background: #f3f4f6;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
        }

        .slick-arrow-custom-prev:hover {
          transform: translateX(-3px);
        }
        .slick-arrow-custom-next:hover {
          transform: translateX(3px);
        }

        .slick-dots-wrapper {
          position: absolute;
          width: 100%;
          left: 0;
          bottom: 18px;
          text-align: center;
        }

        .slick-dots-wrapper :global(ul) {
          display: inline-flex;
          gap: 6px;
          padding: 0;
        }

 
        .slick-dot-custom {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #ffffff;
        }

        .hero-slider :global(.slick-dots li.slick-active div) {
          background: #0a57ff;
          border-color: #ffffff;
        }

        @media (max-width: 768px) {
          .header-slick-wrapper {
            padding: 24px 16px;
          }

          .category-chips-wrapper {
            padding: 8px 30px 14px;
            gap: 6px;
          }

          .category-shadow {
            width: 30px;
          }
          .shadow-left {
            left: 30px;
          }
          .shadow-right {
            right: 30px;
          }

          .chip {
            font-size: 13px;
            padding: 4px 16px;
          }

          .slide-image {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}

/* ================== HERO SECTION (VERSÃO 1 / VERSÃO 2) ================== */

const HeroSection = () => {
  const [isVersion2, setIsVersion2] = useState(false);

  useEffect(() => { 
    setIsVersion2(false);
  }, []);

  function Hero() {
    return (
      <div className="main-home-hero">
        <div className="video-backgound">
          <video
            src="https://ik.imagekit.io/fsobpyaa5i/video_header.mp4"
            poster="https://luxmage.com/data/upload/hnhnhthctmnhnhledchnng2.png"
            muted
            autoPlay
            loop
          ></video>
        </div>
        <div className="main-home-hero-overlay">
          <div className="container-fluid">
            <div className="text-content">
              <h1>Soluções LED que Transformam Espaços</h1>
              <p>
                Somos especialistas na venda, montagem e Aluguer de ecrãs LED
                para eventos, publicidade, empresas e projetos especiais.
                Oferecemos soluções modernas, de alta qualidade e adaptadas a
                cada cliente.
              </p>
              <Link href={"/about-us"} className="tekup-default-btn">
                Saiba mais
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function HeroSlider() {
    return <HeaderWithSlick />;
  }

  return <section>{isVersion2 ? <HeroSlider /> : <Hero />}</section>;
};

export default HeroSection;
