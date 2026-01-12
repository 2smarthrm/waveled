"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoArrowLeft, GoArrowRight, GoPlay, GoPause } from "react-icons/go";

function NextArrow({ onClick }) {
  return (
    <button
      type="button"
      className="navArrow navNext"
      onClick={onClick}
      aria-label="Próximo"
    >
      <span className="icon">
        <GoArrowRight />
      </span>
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      type="button"
      className="navArrow navPrev"
      onClick={onClick}
      aria-label="Anterior"
    >
      <span className="icon">
        <GoArrowLeft />
      </span>
    </button>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const sliderRef = useRef(null);

 
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [userPaused, setUserPaused] = useState(false);  
  const [pausedByInteraction, setPausedByInteraction] = useState(false);  
  const [progress, setProgress] = useState(0);  
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const slides = useMemo(
    () => [
      {
        id: "s1",
        image: "https://ik.imagekit.io/fsobpyaa5i/image-gen%20(88).png",
        title: "Painel Led publicitario 3d para publicidade realista",
        description:
          "Soluções LED profissionais para instalação nos cantos de estádios e grandes recintos desportivos. Ecrãs modulares de grande dimensão, alta luminosidade e elevada resistência, ideais para placares, publicidade dinâmica e experiências visuais imersivas.",
        button: "Ver soluções",
        action: () => router.push("/shop"),
      },
      {
        id: "s2",
        image: "https://ik.imagekit.io/zks5iegia/image-gen%20(34).jpg",
        title: "Monitores LED Transparentes para Montras Premium",
        description:
          "Ecrãs LED transparentes que preservam a visão do interior enquanto exibem conteúdo dinâmico — ideal para montras, showrooms e escritórios que querem destaque sem perder estética.",
        button: "Falar com um especialista",
        action: () => router.push("/contact-us"),
      },
      {
        id: "s3",
        image: "https://ik.imagekit.io/zks5iegia/image-gen%20(35).jpg",
        title: "Totens e Expositores LED Verticais para PDV",
        description:
          "Displays verticais e totemes para pontos de venda e ativações: instalação rápida, baixo consumo e formato pensado para conversão — perfeito para promoções, menus digitais e campanhas locais.",
        button: "Pedir orçamento",
        action: () => router.push("/contact-us"),
      },
    ],
    [router]
  );

  const AUTOPLAY_MS = 6000;

  const resetProgress = () => {
    startRef.current = performance.now();
    setProgress(0);
  };

  const shouldRun = () => { 
    return !userPaused && !pausedByInteraction;
  };

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
    if (isHover && !userPaused) {
      setPausedByInteraction(true);
    }
  };

  const onMouseEnter = () => {
    setIsHover(true); 
  };

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
      infinite: true,
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

      beforeChange: (oldIndex, newIndex) => {
        setActiveIndex(newIndex);
      },
      afterChange: (index) => {
        setActiveIndex(index);
        resetProgress();
      },
    }), 
    [AUTOPLAY_MS, isHover, userPaused]
  );
 
  const onClickCapture = (e) => {
    const target = e.target;
    if (!target) return;

    const inDots =
      typeof target.closest === "function" && target.closest(".slick-dots");
    const inArrow =
      typeof target.closest === "function" && target.closest(".navArrow");

    if (inDots || inArrow) {
      pauseBecauseInteraction();
    }
  };
 
  const size = 44;
  const stroke = 3.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * progress;

  return (
    <section className="heroFull">
      <div
        className="heroWrap"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClickCapture={onClickCapture}
      > 
        <button
          type="button"
          className="miniLoader d-none"
          onClick={togglePlayPause}
          aria-label={userPaused ? "Reproduzir slider" : "Pausar slider"}
          title={userPaused ? "Play" : "Pause"}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="ring"
            aria-hidden="true"
          >
            <circle
              className="ringBg"
              cx={size / 2}
              cy={size / 2}
              r={r}
              strokeWidth={stroke}
            />
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
                  <button
                    type="button"
                    className="tekup-default-btn"
                    onClick={() => router.push("/about-us")}
                  >
                    Saber mais
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
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

        :global(.heroSlider) {
          width: 100%;
        }

        :global(.heroSlider .slick-list),
        :global(.heroSlider .slick-track),
        .slide {
          height: calc(100vh - 100px);
          min-height: 520px;
        }

        @media (min-height: 900px) {
          :global(.heroSlider .slick-list),
          :global(.heroSlider .slick-track),
          .slide {
            height: calc(100vh - 100px);
          }
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
          transition: transform 160ms ease, background 160ms ease,
            border-color 160ms ease;
        }

        .miniLoader:hover {
          transform: scale(1.03);
          background: rgba(0, 0, 0, 0.42);
          border-color: rgba(255, 255, 255, 0.26);
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
          font-size: 18px;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
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
          font-weight: 700;
          cursor: pointer;
          transition: background 180ms ease, transform 160ms ease;
          height: 55px;
          width: 55px;
        }

        :global(.navArrow .icon) {
          font-size: 22px;
          line-height: 1;
          color: #0b0f1a;
          display: inline-block;
        }

        :global(.navArrow:hover) {
          background: #0b0f1a;
          transform: translateY(-50%) scale(1.02);
        }
        :global(.navArrow:hover .icon) {
          color: #0019ff;
        }

        :global(.navPrev) {
          left: 16px;
        }
        :global(.navNext) {
          right: 16px;
        }

        /* Dots */
        :global(.dotsWrap) {
          position: absolute;
          left: clamp(16px, 4vw, 56px);
          bottom: 18px;
          width: auto;
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

        :global(.dotsWrap li) {
          margin: 0 !important;
          width: auto !important;
          height: auto !important;
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

        @media (max-width: 768px) {
          :global(.navArrow) {
            height: 48px;
            width: 48px;
          }

          .content {
            max-width: 92vw;
          }

          :global(.navPrev) {
            left: 8px;
          }
          :global(.navNext) {
            right: 8px;
          }

          .miniLoader {
            top: 12px;
            right: 12px;
            width: 50px;
            height: 50px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.heroSlider *),
          :global(.heroSlider *::before),
          :global(.heroSlider *::after) {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
