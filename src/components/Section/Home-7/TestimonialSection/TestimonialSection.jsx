"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MIN_CARD_WIDTH = 400;
const CARD_GAP = 20;

function getCarouselConfig(containerWidth) {
  if (!containerWidth || containerWidth <= 0) {
    return { items: 1, partialVisible: false, gutter: 0 };
  }

  const theoretical = (containerWidth + CARD_GAP) / (MIN_CARD_WIDTH + CARD_GAP);
  const items = Math.max(1, Math.min(Math.floor(theoretical), 3));

  const usedWidth = items * (MIN_CARD_WIDTH + CARD_GAP) - CARD_GAP;
  const leftover = containerWidth - usedWidth;

  let partialVisible = false;
  let gutter = 0;

  if (items >= 2 && leftover > 0) {
    const fraction = leftover / MIN_CARD_WIDTH;
    if (fraction >= 0.15) {
      partialVisible = true;
      const clampedFraction = Math.min(Math.max(fraction, 0.15), 0.3);
      gutter = MIN_CARD_WIDTH * clampedFraction;
      if (gutter > leftover) gutter = leftover;
    }
  }

  return { items, partialVisible, gutter };
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const TestimonialSection = () => {
  const blurRef = useRef(null);
  const sliderContainerRef = useRef(null);

  const [carouselConfig, setCarouselConfig] = useState({
    items: 1,
    partialVisible: false,
    gutter: 0,
  });

  // Força o Carousel a recalcular quando:
  // - config muda (items/gutter/partial)
  // - dados chegam
  // Isto resolve o problema de cards sobrepostos até fazer resize.
  const [carouselKey, setCarouselKey] = useState("init");

  const isBrowser = typeof window !== "undefined";
  const protocol =
    isBrowser && window.location.protocol === "https:" ? "https" : "http";
  const BaseUrl =
    protocol === "https"
      ? "https://waveledserver.vercel.app"
      : "http://localhost:4000";

  const [loadingData, setLoadingData] = useState([]);

  async function loadData(signal) {
    try {
      const response = await axios.get(BaseUrl + "/api/featured", {
        withCredentials: true,
        signal,
      });
      const data = response?.data?.data ? response.data.data : [];
      setLoadingData(data);
    } catch (error) {
      // ignore abort
      if (error?.name === "CanceledError" || error?.name === "AbortError") return;
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza config baseado no tamanho real do container.
  // Usa ResizeObserver para apanhar mudanças automáticas de layout (fonts, imagens, css, etc)
  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) return;

    let raf1 = 0;
    let raf2 = 0;

    const update = () => {
      const el = sliderContainerRef.current;
      const w = el?.getBoundingClientRect?.().width || window.innerWidth;
      const cfg = getCarouselConfig(w);

      setCarouselConfig((prev) => {
        const changed =
          prev.items !== cfg.items ||
          prev.gutter !== cfg.gutter ||
          prev.partialVisible !== cfg.partialVisible;

        if (changed) return cfg;
        return prev;
      });
    };

    // Faz 2 frames para garantir layout estável (evita "só corrige ao resize")
    const updateStable = () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      raf1 = requestAnimationFrame(() => {
        update();
        raf2 = requestAnimationFrame(() => update());
      });
    };

    updateStable();

    const onWinResize = () => updateStable();
    window.addEventListener("resize", onWinResize);

    let ro = null;
    if (typeof ResizeObserver !== "undefined" && sliderContainerRef.current) {
      ro = new ResizeObserver(() => updateStable());
      ro.observe(sliderContainerRef.current);
    }

    return () => {
      window.removeEventListener("resize", onWinResize);
      if (ro) ro.disconnect();
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isBrowser]);

  // Sempre que a config OU os dados mudam, forçamos remount do Carousel
  // para ele recalcular widths/transform corretamente.
  useEffect(() => {
    const k = `${carouselConfig.items}-${Math.round(
      carouselConfig.gutter
    )}-${carouselConfig.partialVisible ? 1 : 0}-${loadingData.length}`;
    setCarouselKey(k);

    // também ajuda em alguns casos do react-multi-carousel
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }
  }, [carouselConfig, loadingData.length]);

  const responsive = useMemo(
    () => ({
      allScreens: {
        breakpoint: { max: 4000, min: 0 },
        items: carouselConfig.items,
        partialVisibilityGutter: carouselConfig.gutter,
      },
    }),
    [carouselConfig.items, carouselConfig.gutter]
  );

  // EFEITO DE BLUR NO SCROLL
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
                key={carouselKey}
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
                shouldResetAutoplay={false}
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
                    <article key={product?._id || index} className="slider-card">
                      <div className="image-area">
                        {imageUrl && (
                          <Link href={`single-shop?product=${product?._id || ""}`}><img src={imageUrl} alt={truncatedName || "Produto"} /> </Link>
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
              </Carousel>
            </div>
          ) : null}
        </section>
      </div>

      <style jsx global>{`
        .carousel-container-custom {
          width: 100%;
        }

        /* Garante que o wrapper do carousel consegue calcular altura/largura sem glitches */
        .react-multi-carousel-list {
          width: 100%;
        }

        /* gap total 20px entre cards */
        .slider-item-custom {
          padding: 0 10px;
          box-sizing: border-box;
        }

        /* Importante:
           Não usar min-width aqui (causa overflow visual e pode parecer "sobreposto")
           porque o react-multi-carousel controla a largura do item wrapper.
           O cálculo de items já assegura ~400px mínimo pela nossa config.
        */
        .slider-card {
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          width: 100%;
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
