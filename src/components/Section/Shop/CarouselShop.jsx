// CarouselShop.jsx
// Requisitos:
// - Bootstrap CSS carregado no projeto (ex: import "bootstrap/dist/css/bootstrap.min.css";)
// - npm i react-awesome-lightbox
// - import 'react-awesome-lightbox/build/style.css';

import React, { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

const CONTENT = {
  tabs: [
    { id: "cosmeticos", label: "Lojas de cosmetico" },
    { id: "shopping", label: "Shopping e Mercados" },
    { id: "cosmeticos2", label: "Lojas de cosmetico" },
  ],

  // 👇 se não quiseres usar por slide, podes ignorar; aqui usamos por slide
  // title: "Lojas de cosmeticos",
  // description: "....",

 

  slides: [
    {
      id: "s1",
      image: "https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202025-12-19T105212.326.jpg",
      title: "Lojas de cosmeticos",
      description:"Ideal para montras e vitrinas inteligentes, destacando produtos sem ocultá-los. Permite conteúdo dinâmico sobre produtos reais, criando um efeito de “realidade aumentada física”.",
    },
    {
      id: "s2",
      image:  "https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202025-12-19T111038.202.jpg",
      title: "Shopping e Mercados",
      description: "Perfeito para áreas de grande fluxo, com campanhas visíveis sem bloquear a visão da montra. Conteúdo dinâmico e moderno para destacar produtos e promoções.",
    },
    {
      id: "s3",
      image: "https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202025-12-19T114812.256.jpg",
      title: "Lojas de cosmetico",
      description:"Experiência premium com campanhas rotativas e animações suaves. Ideal para vitrinas inteligentes e comunicação visual moderna.",
    },
  ],

  autoplayMs: 4500,
};

export default function CarouselShop() {
  const data = CONTENT;

  const [activeTab, setActiveTab] = useState(data.tabs[0]?.id || "");
  const [index, setIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const slides = data.slides || [];
  const total = slides.length;

  const timerRef = useRef(null);
  const hoveringRef = useRef(false);

  // Crossfade background (duas camadas)
  const [bgA, setBgA] = useState(slides[0]?.image || "");
  const [bgB, setBgB] = useState("");
  const [showA, setShowA] = useState(true);

  // Transição do texto bottom-left
  const [textKey, setTextKey] = useState(0);

  const lightboxImages = useMemo(() => {
    return slides.map((s) => ({ url: s.image, title: s.title || "" }));
  }, [slides]);

  const goTo = (i) => {
    if (!total) return;
    const next = (i + total) % total;
    setIndex(next);
  };

  const next = () => goTo(index + 1);

  // autoplay
  useEffect(() => {
    if (!total) return;

    const stop = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };

    const start = () => {
      stop();
      timerRef.current = setInterval(() => {
        if (!hoveringRef.current) next();
      }, data.autoplayMs || 4500);
    };

    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total, data.autoplayMs]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  const active = slides[index];

  // quando muda o slide: troca background com fade + anima texto
  useEffect(() => {
    if (!active?.image) return;

    // anima texto (remount)
    setTextKey((k) => k + 1);

    // crossfade
    if (showA) {
      setBgB(active.image);
      // pequena espera para garantir que a imagem foi aplicada
      requestAnimationFrame(() => setShowA(false));
    } else {
      setBgA(active.image);
      requestAnimationFrame(() => setShowA(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <>
      {isLightboxOpen && (
        <Lightbox
          images={lightboxImages}
          startIndex={index}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
 

      <div className="section tekup-section-padding">
          <div className="section-carousel container">

      <section
        className="wl-hero position-relative overflow-hidden"
        onMouseEnter={() => (hoveringRef.current = true)}
        onMouseLeave={() => (hoveringRef.current = false)}
      >
        {/* Background layers (crossfade suave) */}
        <div className="wl-bg-stack" aria-hidden="true">
          <div
            className={`wl-bg wl-bg-a ${showA ? "is-on" : "is-off"}`}
            style={{ backgroundImage: `url(${bgA})` }}
          />
          <div
            className={`wl-bg wl-bg-b ${showA ? "is-off" : "is-on"}`}
            style={{ backgroundImage: `url(${bgB})` }}
          />
        </div>

        {/* Overlays */}
        <div className="wl-overlay" aria-hidden="true" />

        {/* Bottom shadow gradient (YouTube-like) */}
        <div className="wl-bottom-shadow" aria-hidden="true" />

        {/* Top pills */}
        <div className="wl-top container-fluid px-4 px-lg-5 pt-4">
          <div className="d-flex gap-3 flex-wrap align-items-center">
            {data.tabs.map((t, i) => {
              const isActive = activeTab === t.id && i === 0;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`wl-pill btn border-0 ${
                    isActive ? "wl-pill--active" : "wl-pill--idle"
                  }`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage */}
        <div className="wl-stage container-fluid px-4 px-lg-5">
          {/* Bottom left text (muda com slide) */}
          <div className="wl-copy" key={textKey}>
            <h2 className="wl-title mb-3">{active?.title || ""}</h2>
            <p className="wl-desc mb-0">{active?.description || ""}</p>
          </div>

          {/* Bottom right indicator pill */}
          <div className="wl-indicator">
            <div className="wl-indicator-pill">
              <div className="wl-indicator-dot wl-indicator-dot--big" />
              <div className="wl-indicator-bar" />
              {slides.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  type="button"
                  className={`wl-indicator-dot ${
                    i === index ? "wl-indicator-dot--active" : ""
                  }`}
                  onClick={() => goTo(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Clique no background abre lightbox (opcional) */}
          <button
            type="button"
            className="wl-bg-click"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Abrir imagem"
          />
        </div>
      </section>
          </div>
      </div>

      <style>{`

       .section-carousel{
           
        }

        .wl-hero{
          width:100%;
          height: 680px;
          min-height: 520px;
          border-radius:10px;
        }

        /* BG stack + crossfade */
        .wl-bg-stack{ 
          inset:0;
        }
        .wl-bg{
          position:absolute;
          inset:0;
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
          opacity: 0;
          transition: opacity .75s ease, transform 1.2s ease;
          will-change: opacity, transform;
        }
        .wl-bg.is-on{
          opacity: 1;
          transform: scale(1.04);
        }
        .wl-bg.is-off{
          opacity: 0;
          transform: scale(1.02);
        }

        .wl-overlay{
          position:absolute; inset:0;
          background:
            radial-gradient(1200px 600px at 40% 45%, rgba(0,0,0,.06) 0%, rgba(0,0,0,.42) 60%, rgba(0,0,0,.62) 100%),
            linear-gradient(180deg, rgba(0,0,0,.18) 0%, rgba(0,0,0,.48) 90%, rgba(0,0,0,.62) 100%);
          pointer-events:none;
        }

        /* YouTube-like bottom gradient */
        .wl-bottom-shadow{
          position:absolute;
          left:0; right:0; bottom:0;
          height: 230px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.22) 32%, rgba(0,0,0,.55) 72%, rgba(0,0,0,.78) 100%);
          pointer-events:none;
        }

        .wl-top{
          position: relative;
          z-index: 3;
        }

        .wl-pill{
          padding: 12px 18px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 18px;
          line-height: 1;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform .18s ease, opacity .18s ease;
        }
        .wl-pill:active{ transform: scale(.98); }
        .wl-pill--active{
          background: rgba(255,255,255,.72);
          color: #0b24ff;
        }
        .wl-pill--idle{
          background: rgba(20,20,20,.45);
          color: rgba(255,255,255,.92);
        }

        .wl-stage{
          position: relative;
          z-index: 3;
          height: calc(680px - 84px);
          min-height: calc(520px - 84px);
        }

        /* bottom-left copy + animation */
        .wl-copy{
          position: absolute;
          left: 48px;
          bottom: 44px;
          width: min(820px, 66vw);
          color: #fff;
          animation: wlFadeUp .45s ease both;
        }
        @keyframes wlFadeUp{
          from{ opacity: 0; transform: translateY(10px); }
          to{ opacity: 1; transform: translateY(0); }
        }

        .wl-title{
          font-size: 44px;
          font-weight: 900;
          letter-spacing: -0.6px;
          text-shadow: 0 10px 26px rgba(0,0,0,.35);
          color:#ffff;
        }
        .wl-desc{
          font-size: 20px;
          line-height: 1.6;
          opacity: .92;
          max-width: 980px;
          text-shadow: 0 10px 26px rgba(0,0,0,.35);
        }

        /* Bottom right indicator (blue pill with dots) */
        .wl-indicator{
          position: absolute;
          right: 52px;
          bottom: 36px;
        }
        .wl-indicator-pill{
          height: 54px;
          width: 220px;
          border-radius: 999px;
          background: #0b24ff;
          box-shadow: 0 16px 40px rgba(11,36,255,.38);
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 10px;
          padding: 0 16px;
        }
        .wl-indicator-dot{
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 0;
          background: rgba(255,255,255,.40);
          cursor: pointer;
          padding:0;
          transition: transform .2s ease, background .2s ease;
        }
        .wl-indicator-dot--big{
          width: 12px; height: 12px;
          background: rgba(255,255,255,.95);
          cursor: default;
        }
        .wl-indicator-dot--active{
          background: rgba(255,255,255,.92);
          transform: scale(1.08);
        }
        .wl-indicator-bar{
          width: 58px;
          height: 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.85);
          opacity: .95;
        }

        /* click overlay */
        .wl-bg-click{
          position:absolute;
          inset:0;
          border:0;
          background: transparent;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 992px){
          .wl-hero{ height: 720px; }
          .wl-title{ font-size: 36px; }
          .wl-desc{ font-size: 18px; }
          .wl-copy{ left: 22px; right: 22px; width: auto; }
          .wl-indicator{ right: 18px; bottom: 22px; }
          .wl-bottom-shadow{ height: 260px; }
        }

        @media (max-width: 640px){
          .wl-pill{ font-size: 16px; padding: 10px 14px; }
          .wl-title{ font-size: 30px; }
          .wl-desc{ font-size: 16px; }
          .wl-indicator-pill{ width: 190px; height: 50px; }
          .wl-bottom-shadow{ height: 280px; }
        }
      `}</style>
    </>
  );
}



/*


 



*/