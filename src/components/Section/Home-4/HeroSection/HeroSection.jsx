"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { FaPlay, FaPause } from "react-icons/fa";

function NextArrow({ onClick }) {
  return (
    <button type="button" className="navArrow navNext" onClick={onClick} aria-label="Próximo">
      <span className="icon">
        <GoArrowRight />
      </span>
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button type="button" className="navArrow navPrev" onClick={onClick} aria-label="Anterior">
      <span className="icon">
        <GoArrowLeft />
      </span>
    </button>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const sliderRef = useRef(null);

  const isBrowser = typeof window !== "undefined";
  const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
  const API_BASE = protocol === "https" ? "https://waveledserver.vercel.app" : "http://localhost:4000";

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [pausedByInteraction, setPausedByInteraction] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const [slides, setSlides] = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(true);

  const AUTOPLAY_MS = 6000;

  const resetProgress = () => {
    startRef.current = performance.now();
    setProgress(0);
  };

  const shouldRun = () => !userPaused && !pausedByInteraction;

  const tick = (t) => {
    const elapsed = t - startRef.current;
    const p = Math.max(0, Math.min(1, elapsed / AUTOPLAY_MS));
    setProgress(p);

    if (p >= 1) {
      startRef.current = t;
      setProgress(0);
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  const handleLink = (link) => {
    const href = String(link || "").trim();
    if (!href) return;
    if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(href);
  };

  useEffect(() => {
    let alive = true;

    const loadSlides = async () => {
      try {
        setSlidesLoading(true);

        const res = await fetch(`${API_BASE}/api/cms/home-hero-slides`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];

        const mapped = list
          .filter((x) => x?.wl_enabled !== false)
          .sort((a, b) => (a?.wl_order ?? 0) - (b?.wl_order ?? 0))
          .map((x, idx) => ({
            id: String(x?._id || `s${idx + 1}`),
            image: String(x?.wl_image || ""),
            title: String(x?.wl_title || ""),
            description: String(x?.wl_description || ""),
            button: String(x?.wl_link ? "Saber mais" : ""),
            link: String(x?.wl_link || ""),
          }))
          .filter((s) => s.image);

        if (!alive) return;

        if (!mapped.length) {
          setSlides([
            {
              id: "fallback-1",
              image: "https://via.placeholder.com/1600x900?text=Waveled+Hero",
              title: "Waveled LED Solutions",
              description: "Conteúdo do HERO ainda não foi configurado no CMS.",
              button: "Contactar",
              link: "/contact-us",
            },
          ]);
        } else {
          setSlides(mapped);
        }
      } catch (_e) {
        if (!alive) return;
        setSlides([
          {
            id: "fallback-1",
            image: "https://via.placeholder.com/1600x900?text=Waveled+Hero",
            title: "Waveled LED Solutions",
            description: "Não foi possível carregar os slides do HERO.",
            button: "Contactar",
            link: "/contact-us",
          },
        ]);
      } finally {
        if (alive) setSlidesLoading(false);
      }
    };

    loadSlides();
    return () => {
      alive = false;
    };
  }, [API_BASE, router]);

  useEffect(() => {
    resetProgress();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (shouldRun()) {
      sliderRef.current?.slickPlay?.();
      startRef.current = performance.now() - progress * AUTOPLAY_MS;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      sliderRef.current?.slickPause?.();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [userPaused, pausedByInteraction]);

  const pauseBecauseInteraction = () => {
    if (isHover && !userPaused) setPausedByInteraction(true);
  };

  const onMouseEnter = () => setIsHover(true);

  const onMouseLeave = () => {
    setIsHover(false);
    if (pausedByInteraction) setPausedByInteraction(false);
  };

  const togglePlayPause = () => {
    setUserPaused((v) => !v);
    setPausedByInteraction(false);
  };

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: slides.length > 1,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,

      autoplay: true,
      autoplaySpeed: AUTOPLAY_MS,
      pauseOnHover: false,
      fade: true,
      speed: 1200,
      cssEase: "linear",

      nextArrow: (
        <NextArrow
          onClick={() => {
            pauseBecauseInteraction();
            sliderRef.current?.slickNext?.();
          }}
        />
      ),
      prevArrow: (
        <PrevArrow
          onClick={() => {
            pauseBecauseInteraction();
            sliderRef.current?.slickPrev?.();
          }}
        />
      ),

      appendDots: (dots) => (
        <div className="dotsWrap">
          <ul>{dots}</ul>
        </div>
      ),
      customPaging: () => <div className="dot" />,

      beforeChange: (_oldIndex, newIndex) => setActiveIndex(newIndex),
      afterChange: (index) => {
        setActiveIndex(index);
        resetProgress();
      },
    }),
    [AUTOPLAY_MS, isHover, userPaused, slides.length]
  );

  const onClickCapture = (e) => {
    const target = e.target;
    if (!target) return;

    const inDots = typeof target.closest === "function" && target.closest(".slick-dots");
    const inArrow = typeof target.closest === "function" && target.closest(".navArrow");

    if (inDots || inArrow) pauseBecauseInteraction();
  };

  const size = 44;
  const stroke = 3.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * progress;

  return (
    <section className="heroFull">
      <div className="heroWrap" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClickCapture={onClickCapture}>
        <button
          type="button"
          className="miniLoader d-none"
          onClick={togglePlayPause}
          aria-label={userPaused ? "Reproduzir slider" : "Pausar slider"}
          title={userPaused ? "Play" : "Pause"}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ring" aria-hidden="true">
            <circle className="ringBg" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
            <circle
              className="ringProg"
              cx={size / 2}
              cy={size / 2}
              r={r}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${c - dash}`}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>

          <span className="miniIcon d-none" aria-hidden="true">
            {userPaused ? <FaPlay /> : <FaPause />}
          </span>
        </button>

        <Slider ref={sliderRef} {...settings} className="heroSlider">
          {slides.map((s) => (
            <div key={s.id} className="slide">
              <div className="media">
                <img src={s.image} alt={s.title} className="bg" />
                <div className="overlay" />
              </div>

              <div className="content">
                <h1 className="title">{s.title}</h1>
                <p className="desc">{s.description}</p>

                <div className="actions">
                  <button type="button" className="tekup-default-btn" onClick={() => handleLink(s.link || "/about-us")}>
                    {s.button || "Saber mais"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {slidesLoading ? <div className="loadingBadge">A carregar…</div> : null}
      </div>

      <style jsx>{`
        .heroFull {
          width: 100%;
          margin: 0;
          margin-top: 100px;
          padding: 0;
          background: #0b0f1a;
        }

        .heroWrap {
          position: relative;
          width: 100%;
        }

        .loadingBadge {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
          padding: 8px 10px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        :global(.heroSlider) {
          width: 100%;
        }

        :global(.heroSlider .slick-list),
        :global(.heroSlider .slick-track),
        .slide {
          height: calc(100vh - 100px);
          min-height: 520px;
        }

        .slide {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .media {
          position: absolute;
          inset: 0;
        }

        .bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: translateZ(0);
          filter: saturate(1.05) contrast(1.02);
        }

        .overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
              1200px 820px at 10% 90%,
              rgba(0, 0, 0, 0.92) 0%,
              rgba(0, 0, 0, 0.68) 30%,
              rgba(0, 0, 0, 0.28) 60%,
              rgba(0, 0, 0, 0) 82%
            ),
            linear-gradient(
              to top,
              rgba(0, 0, 0, 0.62) 0%,
              rgba(0, 0, 0, 0.28) 35%,
              rgba(0, 0, 0, 0) 72%
            );
        }

        .content {
          position: absolute;
          left: clamp(16px, 4vw, 56px);
          bottom: clamp(16px, 4vw, 56px);
          max-width: 720px;
          z-index: 2;
        }

        .title {
          margin: 0;
          color: #fff;
          font-size: clamp(30px, 4.2vw, 58px);
          line-height: 1.02;
          letter-spacing: -0.03em;
          max-width: 650px;
          text-shadow: 0 18px 60px rgba(0, 0, 0, 0.55);
        }

        .desc {
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: clamp(14px, 1.25vw, 18px);
          line-height: 1.55;
          max-width: 62ch;
          text-shadow: 0 14px 46px rgba(0, 0, 0, 0.55);
        }

        .actions {
          margin-top: 18px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* ---------- MINI LOADER (top right) ---------- */
        .miniLoader {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 9;
          width: 54px;
          height: 54px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .ring {
          position: absolute;
          inset: 0;
        }

        .ringBg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.22);
          stroke-linecap: round;
        }

        .ringProg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.92);
          stroke-linecap: round;
          transition: stroke-dasharray 80ms linear;
        }

        .miniIcon {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 16px;
        }

        /* ---------- ARROWS ---------- */
        :global(.navArrow) {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          background: #ffffff;
          color: #0b0f1a;
          border: 0;
          box-shadow: 0 8px 28px rgba(11, 15, 26, 0.12);
          cursor: pointer;
          height: 55px;
          width: 55px;
        }

        :global(.navArrow .icon) {
          font-size: 22px;
          line-height: 1;
          color: #0b0f1a;
        }

        :global(.navPrev) {
          left: 16px;
        }
        :global(.navNext) {
          right: 16px;
        }

        :global(.dotsWrap) {
          position: absolute;
          left: clamp(16px, 4vw, 56px);
          bottom: 18px;
          z-index: 7;
        }

        :global(.dotsWrap ul) {
          display: inline-flex !important;
          gap: 8px;
          padding: 10px 12px;
          margin: 0;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.14);
          list-style: none;
        }

        :global(.dot) {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.35);
          transition: width 260ms ease, background 260ms ease;
        }

        :global(.slick-dots li.slick-active .dot) {
          width: 28px;
          background: rgba(255, 255, 255, 0.92);
        }

        :global(.slick-dots li button:before) {
          display: none;
        }
      `}</style>
    </section>
  );
}
