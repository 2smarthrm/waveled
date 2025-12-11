"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import Link from "next/link";

// CSS do slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HeaderWithSlick() {
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dos "Top Categories" (ou podes trocar para /api/products)
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/top/overall", { cache: "no-store" });
        const json = await res.json();

        // Dado final: array wl_top10
        const formatted = (json?.data?.wl_top10 || []).map((p) => ({
          id: p?._id || "",
          title: p?.wl_name || p?.name || "Produto",
          image:
            p?.wl_images?.[0] ||
            p?.image ||
            "https://via.placeholder.com/1400x600?text=Imagem",
          link: `/single-shop?product=${p?._id}`,
        }));

        setTopCategories(formatted);
      } catch (e) {
        console.error("Erro ao carregar top categories:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ---- react-slick settings ----
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
      <div style={{ bottom: "20px" }}>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#ccc",
        }}
      ></div>
    ),
  };

  return (
    <div className="header-slick-wrapper">
      {/* ===================== CATEGORIAS ===================== */}
      <div className="category-chips">
        <button className="chip active">Trending Categories</button>
        <button className="chip">Sneaker Deals</button>
        <button className="chip">Jordan Retros</button>
        <button className="chip">Nike AF1s</button>
        <button className="chip">Nike Dunks</button>
        <button className="chip">Clearance</button>
        <button className="chip">New Balance 550</button>
      </div>

      {/* ===================== SLIDER ===================== */}
      <div className="hero-slider">
        {loading ? (
          <div className="loading">A carregar slider…</div>
        ) : (
          <Slider {...sliderSettings}>
            {topCategories.map((item) => (
              <div key={item.id} className="slide-container">
                <img src={item.image} alt={item.title} className="slide-image" />

                <div className="slide-footer">
                  <Link href={item.link} className="shop-btn">
                    SHOP NOW
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* ===================== STYLE ===================== */}
      <style jsx>{`
        .header-slick-wrapper {
          width: 100%;
          padding-bottom: 20px;
          background: #f5f6f8;
        }

        .category-chips {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 20px 16px;
          white-space: nowrap;
        }

        .chip {
          padding: 10px 20px;
          border-radius: 22px;
          border: 2px solid #d3d7dc;
          background: #fff;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
        }

        .chip.active {
          background: #111;
          color: #fff;
          border-color: #111;
        }

        .hero-slider {
          margin-top: 10px;
        }

        .slide-container {
          position: relative;
        }

        .slide-image {
          width: 100%;
          height: 450px;
          object-fit: cover;
          border-radius: 20px;
        }

        .slide-footer {
          position: absolute;
          right: 25px;
          bottom: 25px;
        }

        .shop-btn {
          padding: 10px 20px;
          background: white;
          border-radius: 10px;
          font-weight: 600;
          color: #333;
          border: 1px solid #ddd;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
          text-decoration: none;
        }

        /* Slick arrows */
        :global(.slick-prev),
        :global(.slick-next) {
          width: 45px;
          height: 45px;
          background: white !important;
          border-radius: 50%;
          z-index: 5;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        }

        :global(.slick-prev:before),
        :global(.slick-next:before) {
          color: #333;
          font-size: 22px;
        }

        /* Dots */
        :global(.slick-dots li button:before) {
          font-size: 12px;
          color: #fff;
          opacity: 0.4;
        }

        :global(.slick-dots li.slick-active button:before) {
          color: #0a57ff !important;
          opacity: 1;
        }

        @media (max-width: 768px) {
          .slide-image {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}

/* ======= CUSTOM ARROWS ======= */
function NextArrow({ onClick }) {
  return (
    <div className="slick-arrow next" onClick={onClick}>
      →
    </div>
  );
}

function PrevArrow({ onClick }) {
  return (
    <div className="slick-arrow prev" onClick={onClick}>
      ←
    </div>
  );
}
