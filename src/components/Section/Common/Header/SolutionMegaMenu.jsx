// ...existing code...
"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function SolutionMegaMenu() {
  const isBrowser = typeof window !== "undefined";
  const protocol =
    isBrowser && window.location.protocol === "https:" ? "https" : "http";
  const API_BASE =
    protocol === "https"
      ? "https://waveledserver.vercel.app"
      : "http://localhost:4000";
  const IMG_HOST = API_BASE;

  function normalizeImg(src) {
    if (!src) return "";
    const s = String(src);
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    return `${IMG_HOST}${s.startsWith("/") ? "" : "/"}${s}`;
  }

  async function fetchJson(url) {
    const r = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error || "Falha ao carregar");
    return data;
  }

  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 160);
  }

  function closeNow() {
    clearCloseTimer();
    setOpen(false);
  }

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

  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    function checkSize() {
      if (!isBrowser) return;
      setIsLargeScreen(window.innerWidth > 1300);
    }
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, [isBrowser]);

  const [sliderItems, setSliderItems] = useState([]);
  const [sliderLoading, setSliderLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadBanners() {
      setSliderLoading(true);
      try {
        const data = await fetchJson(`${API_BASE}/api/cms/megamenu-banners`);
        const list = (data?.data || [])
          .map((b) => {
            const productId = b?.wl_product?._id || b?.wl_product || "";
            return {
              title: b?.wl_title || "",
              desc: b?.wl_description || "",
              image: normalizeImg(b?.wl_image),
              productId,
              link: b?.wl_product?.wl_link || "",
            };
          })
          .filter((x) => x.image);

        if (alive) setSliderItems(list);
      } catch {
        if (alive) setSliderItems([]);
      } finally {
        if (alive) setSliderLoading(false);
      }
    }

    loadBanners();
    return () => {
      alive = false;
    };
  }, [API_BASE]);

  const [idx, setIdx] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (!open || pause || !sliderItems.length) return;
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % sliderItems.length);
    }, 4500);
    return () => clearInterval(t);
  }, [open, pause, sliderItems.length]);

  useEffect(() => {
    if (open) setIdx(0);
  }, [open]);

  function next() {
    if (!sliderItems.length) return;
    setIdx((p) => (p + 1) % sliderItems.length);
  }

  function prev() {
    if (!sliderItems.length) return;
    setIdx((p) => (p - 1 + sliderItems.length) % sliderItems.length);
  }

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") closeNow();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current =
    sliderItems[idx] || {
      title: sliderLoading ? "A carregar…" : "",
      desc: "",
      image: "",
      productId: "",
      link: "",
    };

  const sliderCtaHref = current.productId
    ? `single-shop?product=${encodeURIComponent(current.productId)}`
    : current.link || "#";

  const [tabs, setTabs] = useState([]);
  const [tabsLoading, setTabsLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadApplicationAreas() {
      setTabsLoading(true);
      try {
        const data = await fetchJson(`${API_BASE}/api/cms/application-areas`);
        const raw = data?.data || [];

        // Map each solution group but include only areas that have solutions
        const mapped = raw
          .map((doc, i) => {
            const key = String(doc?._id || `tab-${i}`);
            const label = String(doc?.wl_solution_title || `Solução ${i + 1}`);
            const areas = Array.isArray(doc?.areas) ? doc.areas : [];
            const industries = areas
              .filter((a) => Array.isArray(a?.solutions) && a.solutions.length > 0)
              .map((a) => a?.title)
              .filter(Boolean)
              .map(String);

            return {
              key,
              label,
              heading: `${label} — Áreas de Aplicação`,
              hasIndustries: true,
              industries,
              __raw: doc,
            };
          })
          // keep only solution groups that have at least one area with solutions
          .filter((t) => t.industries?.length);

        // Do not create an aggregated "Todas" tab — use only mapped groups
        const finalTabs = mapped;

        if (alive) setTabs(finalTabs);
      } catch {
        if (alive) setTabs([]);
      } finally {
        if (alive) setTabsLoading(false);
      }
    }

    loadApplicationAreas();
    return () => {
      alive = false;
    };
  }, [API_BASE]);

  const [activeTab, setActiveTab] = useState("");
  useEffect(() => {
    if (!activeTab && tabs.length) setActiveTab(tabs[0].key);
  }, [tabs, activeTab]);

  const active = useMemo(
    () => tabs.find((t) => t.key === activeTab) || tabs[0] || null,
    [tabs, activeTab]
  );

  const [activeIndustry, setActiveIndustry] = useState("");
  useEffect(() => {
    if (active?.hasIndustries) {
      setActiveIndustry(active?.industries?.[0] || "");
    } else {
      setActiveIndustry("");
    }
  }, [activeTab, active?.hasIndustries, active?.industries]);

  function getCardsNoRepeat(tab, industry) {
    const doc = tab?.__raw;
    const areas = Array.isArray(doc?.areas) ? doc.areas : [];
    const area = areas.find((a) => a?.title === industry) || areas[0];
    const sols = Array.isArray(area?.solutions) ? area.solutions : [];

    const base = sols
      .map((s) => ({
        img: normalizeImg(s?.image),
        tag: s?.title || (s?.product?.wl_name || ""),
        _id: s?.product?._id || s?.product || s?._id || "",
      }))
      .filter((x) => x.img);

    if (!base.length) return [];

    const seed = tab?.hasIndustries ? hashString(`${tab.key}::${industry}`) : 0;
    const rotated = base
      .map((x, i) => ({ ...x, __i: i }))
      .sort((a, b) => ((a.__i + seed) % 97) - ((b.__i + seed) % 97))
      .map(({ __i, ...rest }) => rest);

    const wanted = isLargeScreen ? 4 : 4;
    return rotated.slice(0, Math.min(wanted, rotated.length));
  }

  const cards = useMemo(
    () => getCardsNoRepeat(active, activeIndustry),
    [active, activeIndustry, isLargeScreen]
  );

  const hasTabs = tabs.length > 0;
  const hasIndustries = (active?.industries?.length || 0) > 0;
  const hasSolutionsForIndustry = cards.length > 0;

  const hasAnySolutionsContent = hasTabs && hasIndustries && hasSolutionsForIndustry;

  const showGlobalEmptyMessage =
    !tabsLoading &&
    !sliderLoading &&
    sliderItems.length === 0 &&
    !hasAnySolutionsContent;

  const emptyMessageText = "Ainda não foram adicionadas soluções.";

  function slugify(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // CTA href for the active tab: prefer parent solution id when available
  const ctaHref = useMemo(() => {
    if (!active) return "/solutions";
    const parentId = active.__raw?._id;
    if (parentId) return `/shop?area=${encodeURIComponent(parentId)}`;
    // fallback slug
    return `/shop?area=${slugify(active.label || active.key)}`;
  }, [active]);

  function handleLinkClick() {
    closeNow();
  }

  const compactHeight = showGlobalEmptyMessage
    ? "min(240px, calc(100vh - 170px))"
    : sliderItems.length
    ? "min(520px, calc(100vh - 170px))"
    : "min(420px, calc(100vh - 170px))";

  return (
    <div className="wl-mega-root">
      <div
        className="product-menu"
        ref={triggerRef}
        onMouseEnter={() => {
          clearCloseTimer();
          setOpen(true);
          requestAnimationFrame(updateMenuPosition);
        }}
        onMouseLeave={scheduleClose}
      >
        <a
          href="/solutions"
          className={`wl-navlink ${open ? "is-open" : ""}`}
          onClick={(e) => {
            e.preventDefault();
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
        style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
        onMouseEnter={() => {
          clearCloseTimer();
          setOpen(true);
        }}
        onMouseLeave={scheduleClose}
      >
        <div className="wl-mega-inner" style={{ maxHeight: compactHeight }}>
          <div className="content-box">
            {sliderItems.length ? (
              <div className="content-slide">
                <div
                  className="wl-slider"
                  onMouseEnter={() => setPause(true)}
                  onMouseLeave={() => setPause(false)}
                >
                  <div className="wl-slide-bg">
                    {current.image ? (
                      <img
                        src={current.image}
                        alt={current.title}
                        className="wl-slide-img"
                        loading="eager"
                      />
                    ) : null}

                    <div className="wl-slide-overlay" />

                    <div className="wl-slide-content">
                      <div className="text-content">
                        <h3 className="wl-slide-title">
                          {sliderLoading ? "A carregar…" : current.title}
                        </h3>
                        {current.desc ? (
                          <p className="wl-slide-desc">{current.desc}</p>
                        ) : null}
                      </div>

                      <div className="space-div">
                        <Link
                          href={sliderCtaHref}
                          className="wl-slide-cta text-dark"
                          onClick={handleLinkClick}
                        >
                          <span>Explorar soluções</span>
                        </Link>

                        <div className="wl-dots" aria-label="Paginação">
                          {sliderItems.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              className={`wl-dot ${i === idx ? "active" : ""}`}
                              onClick={() => setIdx(i)}
                              aria-label={`Ir para slide ${i + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="wl-right">
              <button
                type="button"
                className="close-icon wl-close-top"
                onClick={closeNow}
                aria-label="Fechar menu"
                title="Fechar"
              >
                ✕
              </button>

              {showGlobalEmptyMessage ? (
                <div className="wl-empty-compact">
                  <div className="wl-empty-text ">{emptyMessageText}</div>
                  <Link href="/solutions" className="wl-empty-link d-none" onClick={handleLinkClick}>
                    Ver página de soluções
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-div">
                    <div>
                      <h5 className="wl-heading">
                        {tabsLoading ? "A carregar…" : active?.heading || "Soluções"}
                      </h5>

                      {/* Tabs bar: pill tabs, only solution groups that have areas with solutions are present */}
                      <div className="wl-tabs" role="tablist" aria-label="Soluções tabs">
                        {tabs.map((t) => (
                          <button
                            key={t.key}
                            type="button"
                            className={`wl-tab-item ${t.key === activeTab ? "is-active" : ""}`}
                            onClick={() => {
                              setActiveTab(t.key);
                              // reset industry to first of new tab
                              setActiveIndustry(t.industries?.[0] || "");
                            }}
                            role="tab"
                            aria-selected={t.key === activeTab}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <span style={{ width: 36, height: 36 }} />
                  </div>

                  <div style={{ margin: "15px 0px" }}>
                    <hr />
                  </div>

                  {hasAnySolutionsContent ? (
                    <div className="wl-body">
                      <div className="wl-two">
                        <div className="wl-list" role="listbox" aria-label="Áreas de aplicação">
                          {(active.industries || []).map((it, i) => {
                            const isActive = it === activeIndustry;
                            return (
                              <button
                                key={`${active.key}-${i}`}
                                type="button"
                                className={`wl-list-item ${isActive ? "is-active" : ""}`}
                                onClick={() => setActiveIndustry(it)}
                                role="option"
                                aria-selected={isActive}
                              >
                                <span>{it}</span>
                                {isActive ? <span className="wl-arrow">→</span> : null}
                              </button>
                            );
                          })}
                        </div>

                        <div className="images-area-grid">
                          <div className="wl-grid">
                            {cards.map((f, i) => {
                              if (!f?._id) return null;
                              return (
                                <Link
                                  key={`${active.key}-${activeIndustry}-img-${i}`}
                                  href={`single-shop?product=${encodeURIComponent(f._id)}`}
                                  className="wl-card"
                                  title={`${f.tag}${activeIndustry ? ` — ${activeIndustry}` : ""}`}
                                  onClick={handleLinkClick}
                                >
                                  <img
                                    src={f.img}
                                    alt={f.tag}
                                    className="wl-card-img"
                                    loading="lazy"
                                  />
                                  <div className="wl-card-shade" />
                                </Link>
                              );
                            })}
                          </div>

                          <div style={{ marginTop: 8 }}>
                            <Link href={ctaHref} className="wl-all" onClick={handleLinkClick}>
                              Ver mais soluções
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="wl-empty-compact">
                      <div className="wl-empty-text">{emptyMessageText}</div>
                      <Link href="/solutions" className="wl-empty-link" onClick={handleLinkClick}>
                        Ver página de soluções
                      </Link>
                    </div>
                  )}
                </>
              )}

              <button type="button" className="wl-close d-lg-none" onClick={closeNow}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .wl-mega-root {
          position: relative;
          display: inline-block;
        }

        .wl-navlink {
          gap: 8px;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
          display: inline-flex;
          align-items: center;
          font-size:20px;
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
          transition: opacity 0.18s ease, transform 0.18s ease;
          z-index: 999999;
          padding: 0px 60px;
          min-height:630px;
        }
        .wl-mega.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .wl-mega-inner {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          width: 100%;
          min-height:620px;
        }

        .content-box {
          display: flex;
          width: 100%;
          max-height: inherit;
        }

        .content-slide {
          flex: 0 0 auto;
        }

        .wl-slider {
          height: 100%;
          min-height: 670px;
          min-width: 460px;
          max-width: 460px; 
        }

        .wl-slide-bg {
          position: relative;
          height: 100%;
          min-height: 420px;
          background: #0b0f18;
          overflow: hidden;
        }

        .wl-slide-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.02);
          filter: saturate(1.05);
        }

        .wl-slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, #000);
        }

        .wl-slide-content {
          position: relative;
          z-index: 2;
          height: 100%;
          padding: 22px 20px 16px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .space-div {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .wl-slide-title {
          color: #fff;
          font-size: 24px;
          line-height: 1.15;
          margin: 0 0 6px;
          font-weight: 900;
          text-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        .wl-slide-desc {
          color: rgba(255, 255, 255, 0.82);
          margin: 0 0 12px;
          max-width: 44ch;
          font-size: 16px;
        }

        .wl-slide-cta {
          width: fit-content;
          background: #fff;
          color: #0b0f18 !important;
          text-decoration: none;
          font-weight: 800;
          padding: 10px 14px;
          border-radius: 12px;
          transition: transform 0.15s ease;
          white-space: nowrap;
        }
        .wl-slide-cta:hover {
          transform: translateY(-1px);
        }

        .wl-dots {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 12px;
        }

        .wl-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 0;
          background: #fff;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease,
            width 0.15s ease;
        }

        .wl-dot.active {
          background: #0019ff;
          width: 26px;
        }

        .wl-right {
          padding: 18px 18px 16px;
          min-width: 0;
          flex: 1 1 auto;
          position: relative;
        }

        .wl-heading {
          font-size: 20px;
          font-weight: 900;
          color: #111827;
          margin: 0;
        }

        .wl-close-top {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 5;
        }

        /* tabs: pill style, blue with white text when active */
        .wl-tabs {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .wl-tab-item {
          padding: 6px 20px;
          border-radius: 10px;
          background-color: #F2F3FC;
          border-radius: 100px;
          font-weight: 550;
          font-size: 16px;
          color: #000;

          min-width:130px;
          transition: background 0.12s ease, color 0.12s ease, transform 0.12s ease;
          font-size: 16px;
        }
        .wl-tab-item:hover {
          transform: translateY(-1px);
        }
        .wl-tab-item.is-active {
          color: #ffffff;
          background: #0019ff;
        }

        .wl-two {
          display: flex; 
          gap: 16px;
          align-items: start;
          justify-content:space-between;
               width:100%; 
        }

        .wl-list {
          display: grid;
          width:80%;
          gap: 10px;
          padding-right: 6px;
          max-height: 420px;
          overflow: auto;
        }

        .wl-list-item {
          border: 0;
          background: transparent;
          width: 100%;
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #6b7280;
          font-weight: 900;
          padding: 2px 10px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 10px;
          transition: background 0.12s ease, color 0.12s ease;
        }

        .wl-list-item:hover {
          background: rgba(13, 110, 253, 0.06);
          color: #0019ff;
        }

        .wl-list-item.is-active {
          color: #0019ff;
        }

        .wl-arrow {
          color: #0019ff;
          font-weight: 900;
        }

        .wl-grid { 
          display: grid;
          gap: 12px;  
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .images-area-grid{ 
          min-width:600px;
          max-width:600px !important; 
        }

        @media (min-width: 1301px) {
          .wl-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .wl-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          height: 200px;
          text-decoration: none; 
        }

        .wl-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.02);
        }

        .wl-card-shade {
          position: absolute;
          inset: 0; 
        }

        .wl-all {
          display: inline-block;
          margin-top: 10px;
          font-weight: 900;
          color: #0019ff;
          text-decoration: none;
        }

        .wl-close {
          width: 100%;
          border: 0;
          margin-top: 14px;
          background: #0019ff;
          color: #fff;
          font-weight: 900;
          padding: 12px 14px;
          border-radius: 12px;
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
          font-weight: 900;
          transition: transform 0.12s ease, background 0.12s ease;
          flex: 0 0 auto;
        }

        .close-icon:hover {
          transform: scale(1.04);
          background: rgba(0, 0, 0, 0.06);
        }

        .wl-empty-compact {
          padding: 36px 10px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
          min-height: 160px;
        }

        .wl-empty-text {
          color: #6b7280;
          font-weight: 900;
          font-size: 15px;
          line-height: 1.35;
        }

        .wl-empty-link {
          display: inline-flex;
          width: fit-content;
          font-weight: 900;
          color: #0019ff;
          text-decoration: none;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(0, 25, 255, 0.06);
        }

        .wl-empty-link:hover {
          background: rgba(0, 25, 255, 0.1);
        }

        @media (max-width: 991.98px) {
          .wl-mega {
            padding: 0 12px;
          }

          .content-box {
            display: block;
          }

          .wl-slider {
            min-height: 260px;
            min-width: unset;
            max-width: unset;
          }

          .wl-slide-bg {
            min-height: 260px;
          }

          .wl-right {
            padding: 14px 14px 14px;
          }

          .wl-two {
            grid-template-columns: 1fr;
          }

          .wl-list {
            max-height: 220px;
          }
        }

        @media (max-width: 420px) {
          .wl-slide-title {
            font-size: 20px;
          }
          .wl-grid {
            grid-template-columns: 1fr;
          }
          .wl-card {
            min-height: 110px;
          }
        }
      `}</style>
    </div>
  );
}
// ...existing code...