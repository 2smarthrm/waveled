"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";

const CARD_GAP = 24;
const MIN_CARD_WIDTH = 400;
const MAX_VISIBLE = 3;

function getVisibleCards(containerWidth) {
  if (containerWidth < 540) return 1;
  if (containerWidth < 800) return 2;
  return Math.min(Math.floor(containerWidth / (MIN_CARD_WIDTH + CARD_GAP)), MAX_VISIBLE);
}

const TestimonialSection = () => {
  const sliderRef = useRef(null);
  const blurRef = useRef(null); // blur ref
  const [loadingData, setLoadingData] = useState([]);
  const [visibleCards, setVisibleCards] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);

  const protocol =
    typeof window !== "undefined" && window.location.protocol === "https:" ? "https" : "http";
  const BaseUrl =
    protocol === "https"
      ? "https://waveledserver.vercel.app"
      : "http://localhost:4000";

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(BaseUrl + "/api/featured", {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((response) => {
        const data = response?.data?.data ? response.data.data : [];
        setLoadingData(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleResize() {
      const containerWidth = sliderRef.current
        ? sliderRef.current.offsetWidth
        : window.innerWidth;
      setVisibleCards(getVisibleCards(containerWidth));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function goPrev() {
    setCurrentIndex((idx) => Math.max(idx - 1, 0));
  }
  function goNext() {
    setCurrentIndex((idx) =>
      Math.min(idx + 1, loadingData.length - visibleCards)
    );
  }

  useEffect(() => {
    setCurrentIndex((idx) =>
      Math.min(idx, Math.max(loadingData.length - visibleCards, 0))
    );
  }, [visibleCards, loadingData.length]);

  // Swipe/touch handlers
  function handleTouchStart(e) {
    setIsDragging(true);
    setDragStartX(e.touches ? e.touches[0].clientX : e.clientX);
  }
  function handleTouchMove(e) {
    if (!isDragging || dragStartX === null) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = x - dragStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev();
      else goNext();
      setIsDragging(false);
      setDragStartX(null);
    }
  }
  function handleTouchEnd() {
    setIsDragging(false);
    setDragStartX(null);
  }

  // BLUR EFFECT ON SCROLL
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="section dark-bg blur-slide-screen section-testimonial" style={{ position: "relative" }}>
        <div className="image-wall">
          <img
            src="https://ik.imagekit.io/fsobpyaa5i/happy-diverse-friends-celebrating-with-sparklers-o-2025-02-13-00-11-44-utc.jpg"
            alt="waveled"
          />
        </div>
        <section className="over-product-blur" ref={blurRef}>
          {loadingData.length > 0 && (
            <div
              className="slider-container slider-container-area"
              ref={sliderRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              style={{ userSelect: "none" }}
            >
              <button
                className="slider-arrow left"
                onClick={goPrev}
                disabled={currentIndex === 0}
                aria-label="Anterior"
              >
                &#8592;
              </button>
              <div className="slider-track">
                {loadingData
                  .slice(currentIndex, currentIndex + visibleCards)
                  .map((item, index) => {
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
                        className="slider-card no-bg"
                        style={{
                          minWidth: MIN_CARD_WIDTH,
                          marginRight:
                            index < visibleCards - 1 ? CARD_GAP : 0,
                        }}
                      >
                        <div className="image-area">
                          {imageUrl && (
                            <Link href={`single-shop?product=${product?._id || ""}`}>
                              <img src={imageUrl} alt={truncatedName || "Produto"} />
                            </Link>
                          )}
                        </div>
                        <div className="text">
                          <Link href={`single-shop?product=${product?._id || ""}`}>
                            <h4>{truncatedName}</h4>
                          </Link>
                          <p>{truncatedSpecs}</p>
                        </div>
                      </article>
                    );
                  })}
              </div>
              <button
                className="slider-arrow right"
                onClick={goNext}
                disabled={currentIndex >= loadingData.length - visibleCards}
                aria-label="Próximo"
              >
                &#8594;
              </button>
            </div>
          )}
        </section>
      </div>
      <style jsx>{`
        .slider-container {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          padding: 24px 0;
          touch-action: pan-x;
        }
        .slider-track {
          display: flex;
          align-items: stretch;
          width: 100%;
          max-width: 1200px;
        }
        .slider-card.no-bg {
          background: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }
        .slider-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          margin-bottom: 8px;
        }
        .slider-card .image-area {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #fff;
          height: 300px;
          border-radius: 10px;
        }
        .slider-card .image-area img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .slider-card .text {
          padding: 14px 14px 16px;
        }
        .slider-card .text h4 {
          font-size: 18px;
          margin: 0 0 6px;
          color: #e5e7eb;
        }
        .slider-card .text p {
          font-size: 13px;
          margin: 0;
          color: #9ca3af;
        }
        .slider-arrow {
          background: #23262b;
          border: none;
          color: #fff;
          font-size: 2rem;
          padding: 0 12px;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 2;
          min-width: 60px;
          width: 60px;
          height: 60px;
        }
        .slider-arrow:disabled {
          opacity: 0.3;
          cursor: default;
        }
        .slider-arrow.left {
          margin-right: 12px;
        }
        .slider-arrow.right {
          margin-left: 12px;
        }
        @media (max-width: 900px) {
          .slider-card {
            border-radius: 10px;
          }
          .slider-track {
            max-width: 900px;
          }
        }
        @media (max-width: 700px) {
          .slider-card {
            border-radius: 8px;
          }
          .slider-track {
            max-width: 700px;
          }
          .slider-card .text h4 {
            font-size: 14px;
          }
          .slider-card .text p {
            font-size: 12px;
          }
        }
        @media (max-width: 540px) { 
          .slider-card {
            border-radius: 6px;
          }
          .slider-track {
            max-width: 340px;
          }
          .slider-card .text {
            padding: 8px 6px 8px;
          }
        }
      `}</style>
    </>
  );
};

export default TestimonialSection;