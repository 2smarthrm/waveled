"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function ProductMegaMenu() {
  const router = useRouter();

  const isBrowser = typeof window !== "undefined";
  const protocol =
    isBrowser && window.location.protocol === "https:" ? "https" : "http";

  const API_BASE =
    protocol === "https"
      ? "https://waveledserver1.vercel.app"
      : "http://localhost:4000";

  const IMG_HOST =
    protocol === "https"
      ? "https://waveledserver1.vercel.app"
      : "http://localhost:4000";

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

  function goTo(url) {
    closeNow();
    router.push(url);
  }

  function goToProduct(id) {
    if (!id) return;
    goTo(`/single-shop?product=${encodeURIComponent(id)}`);
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

  // =========================
  // Slider
  // =========================
  const [sliderItems, setSliderItems] = useState([]);
  const [sliderLoading, setSliderLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadSlider() {
      setSliderLoading(true);
      try {
        const data = await fetchJson(
          `${API_BASE}/api/cms/vertical-solutions?featured=1`
        );

        const list = (data?.data || []).map((x) => ({
          title: x?.wl_title || "Solução",
          desc: x?.wl_description || "",
          image: normalizeImg(x?.wl_image),
          id: x?.wl_product?._id || "",
        }));

        if (alive) setSliderItems(list);
      } catch {
        if (alive) setSliderItems([]);
      } finally {
        if (alive) setSliderLoading(false);
      }
    }

    loadSlider();
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
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const current =
    sliderItems[idx] || {
      title: "WaveLED — Produtos & Soluções",
      desc: "Venda, montagem e aluguer com suporte técnico completo.",
      image: "",
      id: "",
    };

  // =========================
  // Tabs
  // =========================
  const [tabs, setTabs] = useState([]);
  const [tabsLoading, setTabsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadTabsFromProducts() {
      setTabsLoading(true);
      try {
        const data = await fetchJson(`${API_BASE}/api/products`);
        const items = data?.data || [];
        const map = new Map();

        items.forEach((p) => {
          const cats = [];
          if (p?.wl_category?._id) cats.push(p.wl_category);
          if (Array.isArray(p?.wl_categories)) cats.push(...p.wl_categories);

          cats.forEach((c) => {
            if (!c?._id) return;
            const id = String(c._id);
            const slug = String(c.wl_slug || "");
            const name = String(c.wl_name || "Categoria");
            if (!map.has(id)) {
              map.set(id, { id, key: slug || id, label: name, heading: name });
            }
          });
        });

        const arr = Array.from(map.values()).sort((a, b) =>
          String(a.label).localeCompare(String(b.label))
        );

        if (alive) {
          setTabs(arr);
          setActiveTab((prev) => prev || arr[0]?.key || "");
        }
      } catch {
        if (alive) {
          setTabs([]);
          setActiveTab("");
        }
      } finally {
        if (alive) setTabsLoading(false);
      }
    }

    loadTabsFromProducts();
    return () => {
      alive = false;
    };
  }, [API_BASE]);

  const active = useMemo(() => {
    return tabs.find((t) => t.key === activeTab) || tabs[0] || null;
  }, [tabs, activeTab]);

  // =========================
  // Products
  // =========================
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!activeTab) return;

    async function loadProductsByCategory() {
      setProductsLoading(true);
      try {
        const url = `${API_BASE}/api/products?category=${encodeURIComponent(
          activeTab
        )}`;
        const data = await fetchJson(url);
        if (alive) setProducts(data?.data || []);
      } catch {
        if (alive) setProducts([]);
      } finally {
        if (alive) setProductsLoading(false);
      }
    }

    loadProductsByCategory();
    return () => {
      alive = false;
    };
  }, [API_BASE, activeTab]);

  const productWrapperRef = useRef(null);

  // =========================
  // Tabs arrows (overflow)
  // =========================
  const tabsScrollerRef = useRef(null);
  const [tabsOverflow, setTabsOverflow] = useState(false);
  const [tabsAtLeft, setTabsAtLeft] = useState(true);
  const [tabsAtRight, setTabsAtRight] = useState(false);

  useEffect(() => {
    const el = tabsScrollerRef.current;
    if (!el) return;

    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const overflow = el.scrollWidth > el.clientWidth + 2;
        const left = el.scrollLeft <= 1;
        const right = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
        setTabsOverflow(overflow);
        setTabsAtLeft(left);
        setTabsAtRight(right);
      });
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [tabs.length, open]);

  function scrollTabs(dir) {
    const el = tabsScrollerRef.current;
    if (!el) return;
    const step = Math.max(180, Math.round(el.clientWidth * 0.65));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  // =========================
  // Visible products + see more logic
  // =========================
  const [initialCount, setInitialCount] = useState(6);
  const [showAll, setShowAll] = useState(false);

  const [hasScroll, setHasScroll] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [wasAtBottomByButton, setWasAtBottomByButton] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;

    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1500) return 12;
      if (w >= 1300) return 10;
      if (w >= 1100) return 9;
      if (w >= 900) return 8;
      if (w >= 700) return 6;
      return 6;
    };

    const apply = () => setInitialCount(calc());
    apply();

    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [isBrowser]);

  useEffect(() => {
    setShowAll(false);
    setWasAtBottomByButton(false);
    requestAnimationFrame(() => {
      const el = productWrapperRef.current;
      if (el) el.scrollTo({ top: 0 });
    });
  }, [activeTab]);

  const visibleProducts = useMemo(() => {
    const min = Math.max(5, initialCount);
    return showAll ? products : products.slice(0, min);
  }, [products, showAll, initialCount]);

  useEffect(() => {
    const el = productWrapperRef.current;
    if (!el) return;

    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const overflow = el.scrollHeight > el.clientHeight + 2;
        const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        setHasScroll(overflow);
        setAtBottom(overflow ? bottom : true);
        if (!bottom) setWasAtBottomByButton(false);
      });
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [open, productsLoading, visibleProducts.length, showAll]);

  const showButton = useMemo(() => {
    if (productsLoading) return false;
    if (!products?.length) return false;
    if (!hasScroll) return false;
    if (!showAll) return true;
    if (atBottom && wasAtBottomByButton) return false;
    return !atBottom;
  }, [
    productsLoading,
    products,
    hasScroll,
    showAll,
    atBottom,
    wasAtBottomByButton,
  ]);

  function handleSeeMore() {
    const el = productWrapperRef.current;
    if (!el) return;

    if (!showAll) {
      setShowAll(true);
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        setTimeout(() => {
          const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
          if (bottom) setWasAtBottomByButton(true);
        }, 420);
      });
      return;
    }

    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setTimeout(() => {
      const bottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      if (bottom) setWasAtBottomByButton(true);
    }, 420);
  }

  // min-height 520px quando existir conteúdo
  const hasMenuContent =
    tabsLoading ||
    productsLoading ||
    (tabs && tabs.length > 0) ||
    (products && products.length > 0) ||
    (sliderItems && sliderItems.length > 0);

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
          href="/products"
          className={`wl-navlink ${open ? "is-open" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            setOpen((s) => !s);
            requestAnimationFrame(updateMenuPosition);
          }}
          aria-haspopup="true"
          aria-expanded={open}
        >
          Produtos <span className={`wl-caret ${open ? "up" : ""}`} />
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
        <div className={`wl-mega-inner ${hasMenuContent ? "has-content" : ""}`}>
          <div className="content-box">
            {/* LEFT (slider) */}
            <div className="content-slide">
              <div
                className="wl-slider"
                onMouseEnter={() => setPause(true)}
                onMouseLeave={() => setPause(false)}
              >
                <div className="wl-slide-bg">
                  {current?.image ? (
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
                      <h3 className="wl-slide-title">{current.title}</h3>
                      <p className="wl-slide-desc mb-4">
                        {current?.desc?.length > 90
                          ? current?.desc?.substring(0, 90) + " ..."
                          : current?.desc}
                      </p>
                    </div>

                    <div className="space-div">
                      <button
                        type="button"
                        className="wl-slide-cta text-dark"
                        onClick={() => goToProduct(current.id)}
                        disabled={!current?.id}
                      >
                        <span>Explorar soluções</span>
                      </button>

                      <div className="wl-dots" aria-label="Paginação">
                        {(sliderLoading
                          ? Array.from({ length: 5 })
                          : sliderItems
                        ).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            className={`wl-dot ${i === idx ? "active" : ""}`}
                            onClick={() => setIdx(i)}
                            aria-label={`Ir para slide ${i + 1}`}
                            disabled={!sliderItems.length}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="wl-right">
              <div className="space-div">
                <div>
                  <h5 className="wl-heading">
                    Produtos <FaLongArrowAltRight />{" "}
                    {active?.heading || "Categorias"}
                  </h5>
                </div>

                <button
                  type="button"
                  className="close-icon"
                  onClick={closeNow}
                  aria-label="Fechar menu"
                  title="Fechar"
                >
                  ✕
                </button>
              </div>

              <div
                className="wl-tabs-wrap"
                role="tablist"
                aria-label="Categorias"
              >
                {tabsOverflow && !tabsAtLeft ? (
                  <button
                    type="button"
                    className="wl-tabs-arrow left"
                    onClick={() => scrollTabs(-1)}
                    aria-label="Scroll tabs para a esquerda"
                    title="Anterior"
                  >
                    <FaChevronLeft />
                  </button>
                ) : (
                  <span className="wl-tabs-arrow-spacer" />
                )}

                <div className="wl-tabs" ref={tabsScrollerRef}>
                  {tabsLoading && !tabs.length ? (
                    <div className="text-muted" style={{ padding: "6px 10px" }}>
                      A carregar categorias…
                    </div>
                  ) : (
                    tabs.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        className={`wl-tab ${
                          activeTab === t.key ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(t.key)}
                        role="tab"
                        aria-selected={activeTab === t.key}
                        title={t.label}
                      >
                        {t.label}
                      </button>
                    ))
                  )}
                </div>

                {tabsOverflow && !tabsAtRight ? (
                  <button
                    type="button"
                    className="wl-tabs-arrow right"
                    onClick={() => scrollTabs(1)}
                    aria-label="Scroll tabs para a direita"
                    title="Seguinte"
                  >
                    <FaChevronRight />
                  </button>
                ) : (
                  <span className="wl-tabs-arrow-spacer" />
                )}
              </div>

              <div style={{ margin: "12px 0px" }}>
                <hr />
              </div>

              <div className="wl-body product-wrapper">
                <div className="wl-wrap" ref={productWrapperRef}>
                  {productsLoading ? (
                    Array.from({ length: Math.max(6, initialCount) }).map(
                      (_, i) => (
                        <article key={`sk-${i}`} className="wl-skeleton">
                          <div className="image" />
                          <small className="wl-prod-name"> </small>
                        </article>
                      )
                    )
                  ) : visibleProducts?.length ? (
                    visibleProducts.map((p) => {
                      const img = p?.wl_images?.[0] || "";
                      const name = p?.wl_name || "Produto";
                      return (
                        <article key={p._id} className="wl-prod">
                          <button
                            type="button"
                            className="wl-prod-link"
                            onClick={() => goToProduct(p?._id)}
                            title={name}
                          >
                            <div className="image">
                              <img
                                src={normalizeImg(img)}
                                alt={name}
                                loading="lazy"
                              />
                            </div>
                            <small className="wl-prod-name">
                              {name.length > 40
                                ? name.substring(0, 40) + "..."
                                : name}
                            </small>
                          </button>
                        </article>
                      );
                    })
                  ) : (
                    <div className="text-muted" style={{ padding: 10 }}>
                      Sem produtos para esta categoria.
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="view-all">
                    {showButton ? (
                      <button
                        type="button"
                        className="see-more-btn"
                        onClick={handleSeeMore}
                      >
                        Ver todos
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="wl-close d-lg-none"
                onClick={closeNow}
              >
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
        }

        .wl-mega-inner.has-content {
          min-height: 520px;
        }

        .content-box {
          display: flex;
          width: 100%;
          align-items: stretch;
        }

        .content-slide {
          flex: 0 0 auto;
          display: flex;
          align-self: stretch;
        }

        .wl-slider {
          width: 500px;
          min-width: 500px;
          max-width: 500px; 
          height: 620px; 
          min-height:620px !important;
          background:red;
          display: flex; 
        }

        .wl-slide-bg {
          position: relative;
          height: 100%;
          width: 100%;
          background: #0b0f18;
          overflow: hidden;
          display: flex;
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
          width: 100%;
          padding: 26px 22px 18px;
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
          font-size: 28px;
          line-height: 1.1;
          margin: 0 0 8px;
          font-weight: 800;
          text-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        .wl-slide-desc {
          color: rgba(255, 255, 255, 0.82);
          margin: 0 0 14px;
          max-width: 44ch;
          font-size: 18px;
        }

        .wl-slide-cta {
          width: fit-content;
          background: #fff;
          color: #0b0f18;
          text-decoration: none;
          font-weight: 700;
          padding: 10px 14px;
          border-radius: 12px;
          transition: transform 0.15s ease;
          white-space: nowrap;
          border: 0;
          cursor: pointer;
        }
        .wl-slide-cta:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .wl-slide-cta:hover {
          transform: translateY(-1px);
        }

        .wl-dots {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 14px;
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
          padding: 22px 22px 18px;
          min-width: 0;
          flex: 1 1 auto;

          /* <- para ficar com a mesma altura do slider */
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .wl-heading {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          margin: 0;
        }

        .wl-tabs-wrap {
          display: grid;
          grid-template-columns: 40px 1fr 40px;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .wl-tabs {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 8px 10px;
          border-radius: 999px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .wl-tabs::-webkit-scrollbar {
          display: none;
        }

        .wl-tabs-arrow {
          border: 1px solid rgba(0, 0, 0, 0.25);
          background: #000;
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: 900;
          transition: transform 0.12s ease, background 0.12s ease;
          font-size: 16px;
        }
        .wl-tabs-arrow:hover {
          transform: scale(1.04);
          background: #111;
        }
        .wl-tabs-arrow-spacer {
          width: 40px;
          height: 40px;
        }

        .wl-tab {
          border: 0;
          background: #f5f7fb;
          padding: 7px 16px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 16px;
          white-space: nowrap;
          color: #111827;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .wl-tab:hover {
          background: rgba(0, 0, 0, 0.04);
        }

        .wl-tab.active {
          background: #0019ff;
          color: #fff;
        }

        .wl-body {
          margin-top: 6px;

          /* <- deixa o corpo “crescer” e manter altura consistente */
          flex: 1 1 auto;
          min-height: 0;
        }

        .product-wrapper .wl-wrap {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 18px;
          row-gap: 20px;
          align-content: start;
          max-height: min(520px, calc(100vh - 280px));
          overflow-y: auto;
          overflow-x: hidden;
          padding: 6px 10px 12px 2px;
          box-sizing: border-box;
        }

        .wl-prod {
          min-width: 0;
        }

        .wl-prod-link {
          width: 100%;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
          border-radius: 14px;
          border: 0;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }

        .wl-prod .image,
        .wl-skeleton .image {
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.06);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wl-prod .image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          background: #fff;
        }

        .wl-prod-name {
          display: block;
          font-weight: 800;
          font-size: 15px;
          color: #111827;
          line-height: 1.25;
          text-align: center;
          margin: 0;
          padding: 0 8px;
        }

        .see-more-btn {
          border: 0;
          background: transparent;
          font-weight: 900;
          color: #0019ff;
          cursor: pointer;
          padding: 10px 0 0;
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
          margin-top: 2px;
        }

        .close-icon:hover {
          transform: scale(1.04);
          background: rgba(0, 0, 0, 0.06);
        }

        @media (max-width: 991.98px) {
          .wl-mega {
            padding: 0 12px;
          }
          .content-box {
            display: block;
          }

          /* mobile: slider “auto height” */
          .wl-slider {
            width: 100%;
            min-width: unset;
            max-width: unset;
            height: auto;
          }
          .wl-slide-bg {
            min-height: 300px;
            height: 300px;
          }

          .wl-right {
            padding: 16px 14px 14px;
            height: auto;
          }

          .product-wrapper .wl-wrap {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            max-height: min(520px, calc(100vh - 320px));
            gap: 16px;
            row-gap: 18px;
          }
        }

        @media (max-width: 520px) {
          .product-wrapper .wl-wrap {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }

        @media (max-width: 420px) {
          .wl-slide-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
