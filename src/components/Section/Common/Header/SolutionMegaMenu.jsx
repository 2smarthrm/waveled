"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
  const { onClick, currentSlide, slideCount } = props || {};
  const isEnd =
    typeof currentSlide === "number" && typeof slideCount === "number"
      ? currentSlide >= slideCount - 1
      : false;
  if (isEnd) return null;

  return (
    <button type="button" className="navArrow navNext" onClick={onClick} aria-label="Próximo">
      <span className="icon">
        <GoArrowRight />
      </span>
    </button>
  );
}

function PrevArrow(props) {
  const { onClick, currentSlide } = props || {};
  const isStart = typeof currentSlide === "number" ? currentSlide <= 0 : false;
  if (isStart) return null;

  return (
    <button type="button" className="navArrow navPrev" onClick={onClick} aria-label="Anterior">
      <span className="icon">
        <GoArrowLeft />
      </span>
    </button>
  );
}

export default function SolutionMegaMenu() {
  const isBrowser = typeof window !== "undefined";
  const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
  const API_BASE = protocol === "https" ? "https://waveledserver.vercel.app" : "http://localhost:4000";

  async function fetchJson(url) {
    const r = await fetch(url, { credentials: "include", cache: "no-store" });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error || "Falha ao carregar");
    return data;
  }

  function normalizeImg(src) {
    if (!src) return "";
    const s = String(src);
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    return `${API_BASE}${s.startsWith("/") ? "" : "/"}${s}`;
  }

  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='250' height='400' viewBox='0 0 250 400'>
        <rect fill='#e9ecef' width='100%' height='100%'/>
        <g fill='#cfd6dd' font-family='Arial, Helvetica, sans-serif' font-size='12' text-anchor='middle'>
          <text x='50%' y='50%' dy='0.35em'>Sem imagem</text>
        </g>
      </svg>`
    );

  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);
  const hoverOpenTimerRef = useRef(null);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }
  function clearHoverOpenTimer() {
    if (hoverOpenTimerRef.current) {
      clearTimeout(hoverOpenTimerRef.current);
      hoverOpenTimerRef.current = null;
    }
  }
  function scheduleClose() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 160);
  }
  function closeNow() {
    clearCloseTimer();
    clearHoverOpenTimer();
    setOpen(false);
  }

  useEffect(() => {
    return () => {
      clearCloseTimer();
      clearHoverOpenTimer();
    };
  }, []);

  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  function updateMenuPosition() {
    const el = triggerRef.current;
    if (!el || !isBrowser) return;
    const rect = el.getBoundingClientRect();
    const gap = 12;
    const top = Math.round(rect.bottom + gap);
    setMenuPos({ top, left: 0, width: window.innerWidth });
  }

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const onScroll = () => updateMenuPosition();
    const onResize = () => updateMenuPosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // ✅ Bloquear scroll da página enquanto o menu está aberto
  useEffect(() => {
    if (!isBrowser) return;

    const html = document.documentElement;
    const body = document.body;

    // guardamos estilos atuais para repor
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const lock = () => {
      // compensa a scrollbar para não “saltar” o layout
      const scrollBarWidth = window.innerWidth - html.clientWidth;
      body.style.overflow = "hidden";
      if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;
    };

    const unlock = () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };

    const onWheel = (e) => {
      if (!open) return;
      const menu = menuRef.current;
      if (!menu) {
        e.preventDefault();
        return;
      }
      // permite wheel dentro do menu/slider, bloqueia fora
      const inside = menu.contains(e.target);
      if (!inside) e.preventDefault();
    };

    const onTouchMove = (e) => {
      if (!open) return;
      const menu = menuRef.current;
      if (!menu) {
        e.preventDefault();
        return;
      }
      const inside = menu.contains(e.target);
      if (!inside) e.preventDefault();
    };

    if (open) {
      lock();
      // wheel/touch com passive:false para permitir preventDefault
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
    } else {
      unlock();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
    }

    return () => {
      unlock();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [open, isBrowser]);

  // -------- DATA: areas + pages (builder) ----------
  const [loading, setLoading] = useState(false);
  const [tiles, setTiles] = useState([]);

  const pickVerticalImgFromPage = (pageDoc) => {
    if (!pageDoc || typeof pageDoc !== "object") return "";

    const top0 = Array.isArray(pageDoc.top_solutions) ? pageDoc.top_solutions[0] : null;
    const topImg = top0?.solution?.wl_image;

    const most0 = Array.isArray(pageDoc.most_used_solutions) ? pageDoc.most_used_solutions[0] : null;
    const mostImg = most0?.solution?.wl_image;

    return normalizeImg(topImg || mostImg || "");
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const areasRes = await fetchJson(`${API_BASE}/api/cms/application-areas`);
        const areasRaw = Array.isArray(areasRes?.data) ? areasRes.data : [];

        const pagesRes = await fetchJson(`${API_BASE}/api/cms/area-pages`);
        const pagesRaw = Array.isArray(pagesRes?.data) ? pagesRes.data : [];

        const pageByAreaId = new Map();
        pagesRaw.forEach((p) => {
          const aid = String(p?.wl_area?._id || p?.wl_area || "");
          if (aid) pageByAreaId.set(aid, p);
        });

        const merged = areasRaw.map((a) => {
          const id = String(a?._id || "");
          const label = String(a?.wl_solution_title || a?.wl_title || a?.wl_name || "Área");
          const page = pageByAreaId.get(id) || null;
          const img = pickVerticalImgFromPage(page);

          return { id, label, image: img || "", page, rawArea: a };
        });

        const safe = merged.filter((x) => x.id);
        if (alive) setTiles(safe);
      } catch (e) {
        console.clear();
        console.log("error = ", e);
        if (alive) setTiles([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE]);

  // close on outside click
  useEffect(() => {
    function onDown(e) {
      if (!open) return;
      const t = e.target;
      const trig = triggerRef.current;
      const menu = menuRef.current;
      const insideTrigger = trig && trig.contains(t);
      const insideMenu = menu && menu.contains(t);
      if (!insideTrigger && !insideMenu) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // escape
  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") closeNow();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const HOVER_OPEN_DELAY_MS = 260;

  const sliderSettings = useMemo(
    () => ({
      dots: false,
      infinite: false,

      // ✅ mais suave
      speed: 650,
      cssEase: "cubic-bezier(0.22, 1, 0.36, 1)",

      slidesToShow: 1,
      slidesToScroll: 1,

      swipeToSlide: true,
      draggable: true,
      touchMove: true,
      accessibility: true,

      variableWidth: true,
      arrows: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,

      adaptiveHeight: false,
    }),
    []
  );

  return (
    <div className="wl-mega-root">
      <div
        className="product-menu"
        ref={triggerRef}
        onMouseEnter={() => {
          clearCloseTimer();
          clearHoverOpenTimer();
          if (open) {
            requestAnimationFrame(updateMenuPosition);
            return;
          }
          hoverOpenTimerRef.current = setTimeout(() => {
            hoverOpenTimerRef.current = null;
            setOpen(true);
            requestAnimationFrame(updateMenuPosition);
          }, HOVER_OPEN_DELAY_MS);
        }}
        onMouseLeave={() => {
          clearHoverOpenTimer();
          if (open) scheduleClose();
        }}
      >
        <a
          href="/solutions"
          className={`wl-navlink ${open ? "is-open" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            clearHoverOpenTimer();
            clearCloseTimer();
            setOpen((s) => !s);
            requestAnimationFrame(updateMenuPosition);
          }}
          aria-haspopup="true"
          aria-expanded={open}
        >
          Soluções <span className={`wl-caret ${open ? "up" : ""}`} />
        </a>
      </div>

      <div
        ref={menuRef}
        className={`wl-mega ${open ? "show" : ""}`}
        role="menu"
        aria-busy={loading ? "true" : "false"}
        style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
        onMouseEnter={() => {
          clearCloseTimer();
          clearHoverOpenTimer();
          setOpen(true);
        }}
        onMouseLeave={scheduleClose}
      >
        <div className="wl-mega-inner" style={{ maxHeight: "min(600px, calc(100vh - 120px))" }}>
          <div className="wl-header-row">
            <h5 className="wl-heading">Áreas de Aplicação</h5>
            <button
              type="button"
              className="close-icon wl-close-top"
              onClick={closeNow}
              aria-label="Fechar menu"
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="wl-content">
            {loading ? (
              <div className="wl-center-loader" role="status" aria-live="polite">
                <div className="bootstrap-spinner" />
              </div>
            ) : tiles.length === 0 ? (
              <div className="wl-empty-compact">
                <div className="wl-empty-text">Ainda não existem áreas disponíveis.</div>
              </div>
            ) : (
              <div className="sliderWrap" aria-label="Slider de áreas">
                <Slider {...sliderSettings} className="areasSlider">
                  {tiles.map((a) => {
                    const href = `/shop?area=${encodeURIComponent(a.id)}`;
                    const imgSrc = a.image || PLACEHOLDER;

                    return (
                      <div key={a.id} className="slideItem" style={{ width: 330 }}>
                        <Link
                          href={href}
                          className="tile"
                          onClick={() => closeNow()}
                          aria-label={a.label}
                          title={a.label}
                        >
                          <div className="tile-image-wrap" aria-hidden="true">
                            <img
                              src={imgSrc}
                              alt={a.label}
                              className="tile-image"
                              width="300"
                              height="400"
                              loading="lazy"
                              onError={(e) => {
                                const t = e.currentTarget;
                                if (t && t.src !== PLACEHOLDER) t.src = PLACEHOLDER;
                              }}
                            />
                          </div>

                          <div className="tile-label" title={a.label}>
                            {a.label}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .wl-mega-root {
          position: relative;
          display: inline-block;
        }

        .wl-navlink {
          gap: 8px;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          transition: color 0.15s ease;
          display: inline-flex;
          align-items: center;
          font-size: 20px;
        }
        .wl-navlink.is-open {
          color: #0019ff;
        }
        .wl-caret {
          width: 8px;
          height: 8px;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: rotate(45deg);
          margin-top: -2px;
          transition: transform 0.15s ease;
          opacity: 0.8;
        }
        .wl-caret.up {
          transform: rotate(-135deg);
          margin-top: 2px;
        }

        .wl-mega {
          position: fixed;
          opacity: 0;
          transform: translateY(8px);
          pointer-events: none;
          transition: opacity 0.22s ease, transform 0.22s ease;
          z-index: 999999;
          left: 0;
          right: 0;
          padding: 12px 36px;
        }
        .wl-mega.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .wl-mega-inner {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          width: 100%;
        }

        .wl-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px 8px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.04);
        }

        .wl-heading {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: #0f172a;
        }

        .close-icon {
          border: 0;
          background: #f5f7fb;
          color: #111827;
          width: 36px;
          height: 36px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .close-icon:hover {
          transform: scale(1.04);
          background: rgba(0, 0, 0, 0.06);
        }

        .wl-content {
          padding: 18px 45px;
          max-height: 560px;
          overflow: hidden;
        }

        .wl-center-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 36px 0;
        }
        .bootstrap-spinner {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 6px solid rgba(0, 0, 0, 0.06);
          border-top-color: #0019ff;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .wl-empty-compact {
          padding: 40px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wl-empty-text {
          color: #6b7280;
          font-weight: 800;
        }

        /* --- slider wrap --- */
        .sliderWrap {
          position: relative;
          padding: 10px 4px;
        }

        /* ✅ MAIS SUAVE: transição do track */
        :global(.areasSlider .slick-track) {
          display: flex !important;
          gap: 20px;
          align-items: flex-start;
          will-change: transform;
        }
        :global(.areasSlider .slick-list) {
          overflow: hidden;
        }
        :global(.areasSlider .slick-slide) {
          height: auto;
        }

        .slideItem {
          width: 250px;
          display:flex;
          align-items:center;
          flex-direction:column;
          text-align:center;
          justify-content:center;
        } 


        :global(a.tile) {
          width: 330px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          justify-content: flex-start !important;
          gap: 12px !important;
          text-decoration: none !important;
          color: inherit !important;
          border-radius: 10px !important;
          padding: 6px 2px !important;
          transition: transform 0.18s ease, box-shadow 0.18s ease !important;
        }
        :global(a.tile:hover) {
          transform: translateY(-6px);
          box-shadow: 0 14px 40px rgba(2, 6, 23, 0.08);
        }

        .tile-image-wrap {
          width: 330px;
          height: 400px;
          border-radius: 10px;
          overflow: hidden;
          background: linear-gradient(180deg, #efeff8, #e9ebfb);
          display: block; 
        }
        .tile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .tile-label {
          width: 100%;
          display: block;
          text-align: center;
          font-weight: 900;
          font-size: 18px;
          color: #111827;
          line-height: 1.1;
          margin: 0 auto; 
        }

        /* arrows */
        :global(.navArrow) {
          position: absolute;
          top: 200px;
          transform: translateY(-50%);
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #ffffff;
          color: #0b0f1a;
          border: 0;
          box-shadow: 0 10px 30px rgba(11, 15, 26, 0.14);
          cursor: pointer;
          transition: background 180ms ease, transform 160ms ease;
          height: 52px;
          width: 52px;
        }

        :global(.navArrow .icon) {
          font-size: 22px;
          line-height: 1;
          color: #0b0f1a;
        }

        :global(.navArrow:hover) {
          background: #0b0f1a;
          transform: translateY(-50%) scale(1.03);
        }
        :global(.navArrow:hover .icon) {
          color: #0019ff;
        }

        :global(.navPrev) {
          left: 10px;
        }
        :global(.navNext) {
          right: 10px;
        }

        /* responsive */
        @media (max-width: 1024px) {
          .wl-mega {
            padding: 8px 12px;
          }
          .wl-header-row {
            padding: 12px;
          }
          :global(.navPrev) {
            left: 6px;
          }
          :global(.navNext) {
            right: 6px;
          }
        }

        @media (max-width: 520px) {
          :global(.navArrow) {
            height: 46px;
            width: 46px;
          }
          :global(.navArrow .icon) {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
