"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MIN_CARD_WIDTH = 400; // largura mínima de cada card
const CARD_GAP = 20;        // gap TOTAL entre cards (~20px)

/**
 * Calcula dinamicamente:
 * - quantos items inteiros cabem (1–3)
 * - se deve mostrar uma parte de outro card (entre 15% e 30%)
 * - quanto "gutter" (px) usar para partialVisible
 */
function getCarouselConfig(containerWidth) {
  if (!containerWidth || containerWidth <= 0) {
    return { items: 1, partialVisible: false, gutter: 0 };
  }

  // Quantos cards "teóricos" cabem com largura mínima + gap
  const theoretical =
    (containerWidth + CARD_GAP) / (MIN_CARD_WIDTH + CARD_GAP);

  // Número de cards inteiros permitido (1–3)
  const items = Math.max(1, Math.min(Math.floor(theoretical), 3));

  // Largura ocupada pelos cards inteiros
  const usedWidth = items * (MIN_CARD_WIDTH + CARD_GAP) - CARD_GAP;
  const leftover = containerWidth - usedWidth; // espaço que sobra

  // Defaults: sem partial
  let partialVisible = false;
  let gutter = 0;

  // Só faz sentido mostrar parte de outro card se já couberem pelo menos 2
  if (items >= 2 && leftover > 0) {
    // Percentagem de um novo card que caberia naquele espaço
    const fraction = leftover / MIN_CARD_WIDTH; // ex: 0.18 = 18%

    // Só ativa partial se der para mostrar pelo menos 15% de outro card
    if (fraction >= 0.15) {
      partialVisible = true;

      // Queremos entre 15% e 30% do card extra
      const clampedFraction = Math.min(Math.max(fraction, 0.15), 0.3);
      gutter = MIN_CARD_WIDTH * clampedFraction;

      // Garantir que não passamos do espaço real que sobra
      if (gutter > leftover) {
        gutter = leftover;
      }
    }
  }

  return { items, partialVisible, gutter };
}

const TestimonialSection = () => {
  const blurRef = useRef(null);
  const sliderContainerRef = useRef(null);

  // ================== CAROUSEL CONFIG DINÂMICO ==================
  const [carouselConfig, setCarouselConfig] = useState({
    items: 1,
    partialVisible: false,
    gutter: 0,
  });

  useEffect(() => {
    const updateCarouselConfig = () => {
      if (typeof window === "undefined") return;

      const containerWidth =
        sliderContainerRef.current?.offsetWidth || window.innerWidth;

      const cfg = getCarouselConfig(containerWidth);
      setCarouselConfig(cfg);
    };

    // calcular logo à entrada
    updateCarouselConfig();

    // actualizar sempre que a janela é redimensionada
    window.addEventListener("resize", updateCarouselConfig);
    return () => window.removeEventListener("resize", updateCarouselConfig);
  }, []);

  const responsive = {
    allScreens: {
      breakpoint: { max: 4000, min: 0 },
      items: carouselConfig.items,
      partialVisibilityGutter: carouselConfig.gutter,
    },
  };

  // ================== EFEITO DE BLUR NO SCROLL ==================
  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".blur-slide-screen");
      const blurElement = blurRef.current;
      if (!section || !blurElement) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY;

      const progress = Math.min(
        Math.max((scrollY - sectionTop) / sectionHeight, 0),
        1
      );

      const blurValue = progress * 25;
      blurElement.style.backdropFilter = `blur(${blurValue}px) brightness(71.42%)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ================== LOAD DATA VIA API ==================
  const [loadingData, setLoadingData] = useState([]);

  const isBrowser = typeof window !== "undefined";
  const protocol =
    isBrowser && window.location.protocol === "https:" ? "https" : "http";
  const BaseUrl =
    protocol === "https"
      ? "https://waveledserver.vercel.app"
      : "http://localhost:4000";

  async function loadData() {
    try {
      const response = await axios.get(BaseUrl + "/api/featured", {
        withCredentials: true,
      });
      const data = response?.data?.data ? response?.data?.data : [];
      setLoadingData(data);
      console.clear();
      console.log(response);
    } catch (error) {
      console.clear();
      console.log(error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ================== RENDER ==================
  return (
    <>
      <div
        className="section dark-bg blur-slide-screen"
        style={{ position: "relative" }}
      >
        <div className="image-wall">
          <img
            src="https://ik.imagekit.io/fsobpyaa5i/happy-diverse-friends-celebrating-with-sparklers-o-2025-02-13-00-11-44-utc.jpg"
            alt="waveled"
          />
        </div>

        <section className="over-product-blur" ref={blurRef}>
          {loadingData.length >= 1 ? (
            <div className="products-slide" ref={sliderContainerRef}>
              <Carousel
                responsive={responsive}
                infinite={false}
                arrows={true}
                showDots={true}
                keyBoardControl={true}
                draggable={true}
                swipeable={true}
                containerClass="carousel-container-custom"
                itemClass="slider-item-custom"
                dotListClass="custom-dot-list-style"
                partialVisible={carouselConfig.partialVisible}
                renderDotsOutside={false}
              >
                {loadingData.map((item, index) => {
                  const product = item?.wl_product;
                  const imagePath =
                    product?.wl_images && product.wl_images.length > 0
                      ? product.wl_images[0]
                      : null;

                  const imageUrl = imagePath
                    ? imagePath.startsWith("http")
                      ? imagePath
                      : BaseUrl + imagePath
                    : "";

                  const name = product?.wl_name || "";
                  const specs = product?.wl_specs_text || "";

                  const truncatedName =
                    name.length > 70 ? name.substring(0, 70) + "..." : name;

                  const truncatedSpecs =
                    specs.length > 90 ? specs.substring(0, 90) + "..." : specs;

                  return (
                    <article
                      key={product?._id || index}
                      className="slider-card"
                    >
                      <div className="image-area">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={truncatedName || "Produto"}
                          />
                        )}
                      </div>
                      <div className="text">
                        <Link
                          href={`single-shop?product=${product?._id || ""}`}
                        >
                          <h4>{truncatedName}</h4>
                        </Link>
                        <p>{truncatedSpecs}</p>
                      </div>
                    </article>
                  );
                })}
              </Carousel>
            </div>
          ) : null}
        </section>
      </div>

      {/* Estilos específicos do slider e itens */}
      <style jsx global>{`
        .carousel-container-custom {
          width: 100%;
        }

        /* padding horizontal -> 20px totais entre cards */
        .slider-item-custom {
          padding: 0 10px;
          box-sizing: border-box;
        }

        .slider-card {
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-width: ${MIN_CARD_WIDTH}px; /* garante min. ~400px */
          height: 100%;
        }

        .slider-card .image-area {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }

        .slider-card .image-area img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .slider-card .text {
          padding: 14px 14px 16px;
        }

        .slider-card .text h4 {
          font-size: 16px;
          margin: 0 0 6px;
          color: #e5e7eb;
        }

        .slider-card .text p {
          font-size: 13px;
          margin: 0;
          color: #9ca3af;
        }

        .custom-dot-list-style {
          margin-top: 14px;
        }

        .custom-dot-list-style li button {
          border-radius: 999px;
        }
      `}</style>
    </>
  );
};

export default TestimonialSection;
