 
 
/*
  Header com mega menu de Produtos + Soluções
*/

"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { GoArrowUpRight } from "react-icons/go";

// ====== Config ======
const isBrowser = typeof window !== "undefined";
const protocol =
  isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE =
  protocol === "https"
    ? "https://waveledserver.vercel.app"
    : "http://localhost:4000";
const IMG_HOST =
  protocol === "https"
    ? "https://waveledserver.vercel.app"
    : "http://localhost:4000";

// ====== LOGOS ======
const LOGO_DARK =
  "https://ik.imagekit.io/fsobpyaa5i/Waveled_logo-02%20(1)%20(4).png"; // preto
const LOGO_LIGHT =
  "https://ik.imagekit.io/fsobpyaa5i/Waveled_logo-03%20(1).png"; // branco

// ====== Helpers ======
const isAbsoluteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const withHost = (u) => (u ? (isAbsoluteUrl(u) ? u : `${IMG_HOST}${u}`) : "");
const toArray = (raw) =>
  Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.items)
    ? raw.items
    : [];
const truncate = (s, n = 60) =>
  s && s.length > n ? s.substring(0, n).trimEnd() + "…" : s || "";

const orderFirstOldestThenNewest = (arr) => {
  const items = Array.isArray(arr) ? arr.slice() : [];
  const getTime = (x) => {
    const d = x?.createdAt ? new Date(x.createdAt) : null;
    const t = d && !isNaN(d.getTime()) ? d.getTime() : 0;
    return t;
  };
  const oldestAsc = items.slice().sort((a, b) => getTime(a) - getTime(b));
  const newestDesc = items.slice().sort((a, b) => getTime(b) - getTime(a));
  const seen = new Set();
  const merged = [];
  for (const it of [...oldestAsc, ...newestDesc]) {
    const id = String(it?._id || "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    merged.push(it);
  }
  return merged;
};

// Fetch JSON
async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// extrai categorias do produto
function extractProductCategories(p) {
  const list = [];
  if (Array.isArray(p?.wl_categories)) {
    for (const c of p.wl_categories) {
      const id = c?._id || c;
      if (!id) continue;
      list.push({
        id: String(id),
        name: c?.wl_name || c?.name || String(id),
        slug: c?.wl_slug || c?.slug || "",
      });
    }
  }
  if (!list.length && p?.wl_category) {
    const c = p.wl_category;
    const id = c?._id || c;
    if (id) {
      list.push({
        id: String(id),
        name: c?.wl_name || c?.name || String(id),
        slug: c?.wl_slug || c?.slug || "",
      });
    }
  }
  return list;
}

const HeaderFourInner = () => {
  const [sideBar, setSideBar] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [scrollClassName, setScrollClassName] = useState("");
  const [isTransparent, setIsTransparent] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [catsError, setCatsError] = useState("");

  const [solutions, setSolutions] = useState([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [solutionsError, setSolutionsError] = useState("");

  // soluções associadas por categoria (catId -> [solutions...])
  const [solutionsByCat, setSolutionsByCat] = useState({});

  const [key, setKey] = useState("0");

  // ——— Estado de megamenu
  const [activeMenu, setActiveMenu] = useState(null); // 'products' | 'solutions' | null
  const [isLocked, setIsLocked] = useState(false);

  // ——— Forçar header branco enquanto megamenu/hover ativos
  const [forceWhite, setForceWhite] = useState(false);
  const forceTimer = useRef(null);

  const headerRef = useRef(null);
  const rafRef = useRef(0);
  const postUnlockRafRef = useRef(0);

  // ===== Roteamento (fechar megamenu ao navegar, inclusive query changes) =====
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setActiveMenu(null);
    setForceWhite(false);
    setIsLocked(false);
    setIsActive(false);
    if (forceTimer.current) clearTimeout(forceTimer.current);
    cancelAnimationFrame(postUnlockRafRef.current);
    cancelAnimationFrame(rafRef.current);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        setIsTransparent(computeShouldBeTransparent());
      }
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  // ======= Deve estar transparente? =======
  const computeShouldBeTransparent = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (forceWhite || isLocked || activeMenu) return false;

    const header = headerRef.current;
    if (!header) return false;

    const headerRect = header.getBoundingClientRect();
    const targets = Array.from(
      document.querySelectorAll(
        ".main-home-hero, .blur-slide-screen, .video-shop-large-section, .service-img, .services-section, .video-area"
      )
    );
    if (!targets.length) return false;

    const overlapping = targets.some((el) => {
      const r = el.getBoundingClientRect();
      const headerBottom = headerRect.bottom;
      const isAnyPartVisible = r.bottom > 0 && r.top < window.innerHeight;
      const isUnderHeaderTopLine = r.top <= headerBottom;
      return isAnyPartVisible && isUnderHeaderTopLine;
    });

    return overlapping;
  }, [forceWhite, isLocked, activeMenu]);

  const incLock = useCallback(() => setIsLocked(true), []);
  const decLock = useCallback(() => setIsLocked(false), []);

  const setWhiteOn = useCallback(() => {
    if (forceTimer.current) clearTimeout(forceTimer.current);
    setForceWhite(true);
    incLock();
  }, [incLock]);

  const setWhiteOff = useCallback(() => {
    if (forceTimer.current) clearTimeout(forceTimer.current);
    forceTimer.current = setTimeout(() => {
      setForceWhite(false);
      decLock();
      setIsTransparent(computeShouldBeTransparent());
      let start = 0;
      const tick = (t) => {
        if (!start) start = t;
        const elapsed = t - start;
        setIsTransparent(computeShouldBeTransparent());
        if (elapsed < 250)
          postUnlockRafRef.current = requestAnimationFrame(tick);
      };
      cancelAnimationFrame(postUnlockRafRef.current);
      postUnlockRafRef.current = requestAnimationFrame(tick);
    }, 120);
  }, [computeShouldBeTransparent, decLock]);

  // ===== react-multi-carousel settings =====
  const carouselCfg = useMemo(
    () => ({
      responsive: {
        desktop: {
          breakpoint: { max: 3000, min: 1025 },
          items: 5,
          slidesToSlide: 5,
        },
        tabletLg: {
          breakpoint: { max: 1304, min: 1000 },
          items: 4,
          slidesToSlide: 4,
        },
        tablet: {
          breakpoint: { max: 600, min: 481 },
          items:1,
          slidesToSlide: 1,
        },
        mobile: {
          breakpoint: { max: 480, min: 0 },
          items: 1,
          slidesToSlide: 1,
        },
      },
      arrows: true,
      infinite: false,
      transitionDuration: 400,
      swipeable: true,
      draggable: true,
      keyBoardControl: true,
      renderDotsOutside: false,
      showDots: false,
      lazyLoad: true,
      ssr: false,
      minimumTouchDrag: 60,
      containerClass: "rmc-container",
      itemClass: "rmc-item",
      sliderClass: "rmc-slider",
    }),
    []
  );

  /** ---------- Sticky ao fazer scroll ---------- */
  useEffect(() => {
    const handleScrollSticky = () => {
      if (window.scrollY > 100) setScrollClassName("sticky-menu");
      else setScrollClassName("");
    };
    window.addEventListener("scroll", handleScrollSticky, { passive: true });
    handleScrollSticky();
    return () => window.removeEventListener("scroll", handleScrollSticky);
  }, []);

  /** ---------- Transparência automática ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkOverlap = () => {
      if (isLocked || forceWhite || activeMenu) {
        setIsTransparent(false);
        return;
      }
      setIsTransparent(computeShouldBeTransparent());
    };

    const onScrollOrResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(checkOverlap);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    onScrollOrResize();
    const t = setTimeout(onScrollOrResize, 120);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t);
      cancelAnimationFrame(postUnlockRafRef.current);
      if (forceTimer.current) clearTimeout(forceTimer.current);
    };
  }, [isLocked, forceWhite, activeMenu, computeShouldBeTransparent]);

  useEffect(() => {
    if (activeMenu) {
      setForceWhite(true);
      incLock();
    } else {
      setWhiteOff();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu]);

  /** ---------- Mobile menu ---------- */
  const [subMenuArray, setSubMenuArray] = useState([]);
  const [subMenuTextArray, setSubMenuTextArray] = useState([]);

  const menuMainClickHandler = (e) => {
    if (typeof window !== "undefined" && window.innerWidth <= 991) {
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active");
      });

      const hasChildren = e.target.closest(
        ".nav-item-has-children, .sub-menu-item-hover"
      );
      if (hasChildren) {
        e.preventDefault();
        const submenuAll = document.querySelectorAll(".sub-menu");
        submenuAll.forEach((submenu) => submenu.classList.remove("active"));
        const subMenu = hasChildren.querySelector(".sub-menu");
        if (!subMenu) return;
        setSubMenuArray((prev) => [...prev, subMenu.id]);
        subMenu.classList.add("active");
        subMenu.style.animation = "slideLeft 0.5s ease forwards";
        const menuTitle =
          hasChildren.querySelector(".drop-trigger, .nav-link-item")
            ?.textContent || "";
        setSubMenuTextArray((prev) => [...prev, menuTitle]);
        const titleEl = document.querySelector(".current-menu-title");
        if (titleEl) titleEl.innerHTML = menuTitle;
        document.querySelector(".mobile-menu-head")?.classList.add("active");
      }
    }
  };

  const goBackClickHandler = () => {
    const lastItem = subMenuArray.slice(-1)[0];
    const lastItemText = subMenuTextArray.slice(-2)[0];
    setSubMenuArray(subMenuArray.slice(0, -1));
    setSubMenuTextArray(subMenuTextArray.slice(0, -1));
    if (lastItem) {
      const el = document.getElementById(lastItem);
      if (el && !el.classList.contains("nav-item-has-children")) {
        el.style.animation = "slideRight 0.5s ease forwards";
        const titleEl = document.querySelector(".current-menu-title");
        if (titleEl) titleEl.innerHTML = lastItemText || "";
        setTimeout(() => el.classList.remove("active"), 300);
      } else {
        document.querySelector(".go-back")?.classList.remove("active");
      }
    }
    if (subMenuArray.length === 1) {
      document.querySelector(".mobile-menu-head")?.classList.remove("active");
    }
  };

  const toggleMenu = () => {
    setIsActive((prev) => !prev);
    document.querySelector(".menu-overlay")?.classList.toggle("active");
  };

  /** ---------- Fetch Produtos (agrupado por categoria) ---------- */
  useEffect(() => {
    let abort = false;
    async function load() {
      setLoadingCats(true);
      setCatsError("");
      try {
        const raw = await fetchJson(`${API_BASE}/api/products`);
        if (abort) return;
        const items = toArray(raw);

        const byCatId = new Map();

        items.forEach((p) => {
          const productCats = extractProductCategories(p);
          const catList = productCats.length
            ? productCats
            : [{ id: "others", name: "Outros", slug: "outros" }];

          const cover =
            Array.isArray(p?.wl_images) && p?.wl_images?.length
              ? withHost(p.wl_images[0])
              : withHost(p?.wl_cover);

          const card = {
            _id: p?._id,
            title: truncate(p?.wl_name || "Produto"),
            image: cover || "https://via.placeholder.com/600x600?text=Produto",
            link: `/single-shop?product=${p?._id}`,
          };

          for (const c of catList) {
            if (!byCatId.has(c.id)) {
              byCatId.set(c.id, {
                category: c.name || "Outros",
                id: c.id,
                slug: c.slug || "",
                series: [],
                _seen: new Set(),
              });
            }
            const bucket = byCatId.get(c.id);
            if (!bucket._seen.has(card._id)) {
              bucket.series.push(card);
              bucket._seen.add(card._id);
            }
          }
        });

        let arr = Array.from(byCatId.values()).map((c) => {
          const { _seen, ...rest } = c;
          return rest;
        });

        arr.sort((a, b) => a.category.localeCompare(b.category, "pt"));
        const maxPerCat = 12;
        arr.forEach((c) => (c.series = c.series.slice(0, maxPerCat)));

        if (!abort) {
          setCategories(arr);
          setKey(arr.length ? "0" : "0");
        }
      } catch (e) {
        if (!abort)
          setCatsError(e?.message || "Erro ao carregar categorias.");
      } finally {
        if (!abort) setLoadingCats(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, []);

  /** ---------- Fetch Soluções (todas para o menu "Soluções") ---------- */
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoadingSolutions(true);
        setSolutionsError("");
        const res = await fetch(`${API_BASE}/api/solutions/`, {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        const ordered = orderFirstOldestThenNewest(list.sort());
        setSolutions(ordered);
      } catch (e) {
        if (e?.name !== "AbortError")
          setSolutionsError(e?.message || "Erro ao carregar soluções.");
      } finally {
        setLoadingSolutions(false);
      }
    })();
    return () => ac.abort();
  }, []);

  /** ---------- Fetch soluções por categoria (para o link "Ver soluções associadas") ---------- */
  useEffect(() => {
    if (!categories || !categories.length) return;

    let abort = false;

    (async () => {
      const map = {};
      for (const cat of categories) {
        const catId = cat.id;
        if (!catId) continue;
        try {
          const res = await fetch(
            `${API_BASE}/api/categories/${catId}/solutions`,
            { cache: "no-store" }
          );

 


          if (!res.ok) continue;
          const json = await res.json();
          const list = Array.isArray(json?.data?.solutions)
            ? json.data.solutions
            : [];
          if (list.length) {
            map[catId] = list;
          }


        } catch {
          // silencioso – se falhar, simplesmente não mostra o link de soluções
        }
        if (abort) break;
      }
      if (!abort) {
        setSolutionsByCat(map);
      }
    })();

    return () => {
      abort = true;
    };
  }, [categories]);

  // cards para soluções (menu Soluções)
  const solutionCards = useMemo(() => {
    return (solutions || []).map((item) => {
      const id = String(item?._id || "");
      const title =
        typeof item?.title === "string" && item.title.trim()
          ? item.title
          : "Solução";
      const rawImg =
        item?.image ||
        item?.cover ||
        item?.coverUrl ||
        item?.img ||
        item?.thumbnail ||
        item?.thumbUrl ||
        item?.photo;
      const img = withHost(rawImg);
      const href = `/solutions?sl=${encodeURIComponent(id)}`;
      return { id, title, img, href };
    });
  }, [solutions]);

  // Hover intent para tabs (produtos)
  const hoverTimerRef = useRef(null);
  const handleTabHover = useCallback((nextIndex) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      const nextKey = String(nextIndex);
      setKey((prev) => (prev === nextKey ? prev : nextKey));
    }, 120);
  }, []);
  const cancelTabHover = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  // ======= Close helpers =======
  const closeMega = useCallback(() => {
    cancelTabHover();
    setActiveMenu(null);
    setWhiteOff();
  }, [cancelTabHover, setWhiteOff]);

  const onMegaLinkClick = useCallback(() => {
    setActiveMenu(null);
    setForceWhite(false);
    setIsLocked(false);
    setIsActive(false);
    if (forceTimer.current) clearTimeout(forceTimer.current);
  }, []);

  // ESC fecha menu
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeMega();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMega]);

  // click fora fecha megamenu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!activeMenu) return;
      const menuEl = document.querySelector(".sub-menu-box");
      const triggerElProducts = document.querySelector(
        '[data-trigger="products"]'
      );
      const triggerElSolutions = document.querySelector(
        '[data-trigger="solutions"]'
      );
      const isInsideMenu = menuEl && menuEl.contains(e.target);
      const isOnTrigger =
        (triggerElProducts && triggerElProducts.contains(e.target)) ||
        (triggerElSolutions && triggerElSolutions.contains(e.target));
      if (!isInsideMenu && !isOnTrigger) {
        closeMega();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu, closeMega]);

  // ---------- Render ----------
  const logoSrc = isTransparent ? LOGO_LIGHT : LOGO_DARK;
  const logoAlt = isTransparent ? "Waveled (logo branco)" : "Waveled (logo preto)";

  return (
    <header
      id="site-header-area"
      ref={headerRef}
      className={`site-header tekup-header-section ${scrollClassName} ${
        isTransparent ? "transparent-header" : ""
      } ${forceWhite || isLocked ? "header-force-white" : ""}`}
    >
      {/* CSS crítico */}
      <style jsx>{`
        .sub-menu-box {
          position: relative;
          overflow: hidden;
          will-change: opacity, transform;
        }
        .sub-menu-box .tab-content {
          position: relative;
          min-height: 260px;
          overflow: hidden;
          contain: layout paint;
        }
        .sub-menu-box .tab-content > .tab-pane {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.18s ease;
        }
        .sub-menu-box .tab-content > .tab-pane.active,
        .sub-menu-box .tab-content > .tab-pane.show.active {
          position: relative;
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .submn-article {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 8px;
          text-align: center;
        }
        .submn-article img {
          width: 100%;
          max-height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }
        .submn-article strong {
          display: block;
          margin-top: 6px;
          color: #000;
        }
        .sub-menu-box .react-multi-carousel-track {
          will-change: transform;
        }
        .transparent-header .tekup-header-bottom {
          background: transparent !important;
        }
        .header-force-white .tekup-header-bottom {
          background: #fff !important;
        }
        .header-force-white .nav-link-item,
        .header-force-white .tekup-header-info-box-data h6,
        .header-force-white .tekup-header-info-box-data p {
          color: #111 !important;
        }
      `}</style>

      <div className="tekup-header-bottom bg-white">
        <div className="container-fuild">
          <nav className="navbar site-navbar">
            <div className="brand-logo-nav">
              <Link href="/" aria-label="Waveled - Página inicial">
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  style={{
                    maxHeight: "45px",
                    width: "auto",
                    marginRight: "15px",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = LOGO_DARK;
                  }}
                />
              </Link>
            </div>

            <div className="menu-block-wrapper">
              <div
                className="menu-overlay"
                onClick={() => setIsActive(false)}
              ></div>
              <nav
                className={`menu-block ${isActive ? "active" : ""}`}
                id="append-menu-header"
              >
                <div className="mobile-menu-head">
                  <div className="go-back" onClick={goBackClickHandler}>
                    <i className="fa fa-angle-left"></i>
                  </div>
                  <div className="current-menu-title"></div>
                  <div
                    className="mobile-menu-close"
                    onClick={() => setIsActive(false)}
                  >
                    &times;
                  </div>
                </div>

                <ul className="site-menu-main" onClick={menuMainClickHandler}>
                  {/* INÍCIO */}
                  <li className="nav-item">
                    <Link
                      href="/"
                      className="nav-link-item drop-trigger"
                      onClick={onMegaLinkClick}
                    >
                      Início
                    </Link>
                  </li>

                  {/* --------- PRODUTOS --------- */}
                  <li
                    className="nav-item sub-menu-item-hover"
                    data-trigger="products"
                    onMouseEnter={() => {
                      setWhiteOn();
                      setActiveMenu("products");
                    }}
                    onMouseLeave={() => {
                      setWhiteOff();
                      setActiveMenu(null);
                    }}
                    onFocus={() => {
                      setWhiteOn();
                      setActiveMenu("products");
                    }}
                    onBlur={() => {
                      setWhiteOff();
                      setActiveMenu(null);
                    }}
                  >
                    <Link
                      href="#"
                      className="nav-link-item"
                      onClick={onMegaLinkClick}
                    >
                      Produtos
                    </Link>

                    <div
                      className={`sub-menu-box ${
                        activeMenu === "products" ? "" : ""
                      }`}
                      role="dialog"
                      aria-hidden={activeMenu !== "products"}
                      onMouseEnter={setWhiteOn}
                      onMouseLeave={setWhiteOff}
                    >
                      {loadingCats ? (
                        <div style={{ padding: "1rem 1.25rem" }}>
                          <small>A carregar categorias…</small>
                        </div>
                      ) : catsError ? (
                        <div
                          style={{ padding: "1rem 1.25rem", color: "crimson" }}
                        >
                          <small>{catsError}</small>
                        </div>
                      ) : categories.length === 0 ? (
                        <div style={{ padding: "1rem 1.25rem" }}>
                          <small>Sem produtos para listar.</small>
                        </div>
                      ) : (
                        <div
                          onMouseEnter={setWhiteOn}
                          onMouseLeave={setWhiteOff}
                        >
                          <Tabs
                            id="tab-menu"
                            className="mb-3"
                            activeKey={key}
                            onSelect={(k) =>
                              setKey((prev) => (prev === k ? prev : k || "0"))
                            }
                            transition={false}
                            mountOnEnter={false}
                            unmountOnExit={false}
                          >
                            {categories.map((cat, index) => {
                              const catId = cat.id;
                              const catSolutions =
                                solutionsByCat[catId] || [];
                              const firstSol = catSolutions[0] || null;
                              const solutionHref = firstSol
                                ? `/solutions?sl=${encodeURIComponent(
                                    String(firstSol._id)
                                  )}`
                                : null;

                              return (
                                <Tab
                                  key={catId || index}
                                  eventKey={String(index)}
                                  mountOnEnter={false}
                                  unmountOnExit={false}
                                  title={
                                    <span
                                      className="text-dark"
                                      onMouseEnter={() => {
                                        handleTabHover(index);
                                        setWhiteOn();
                                      }}
                                      onMouseLeave={() => {
                                        cancelTabHover();
                                      }}
                                      onFocus={() => {
                                        setKey(String(index));
                                        setWhiteOn();
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        color: "#000",
                                      }}
                                    >
                                      {cat.category}
                                    </span>
                                  }
                                >
                                  {/* Linha de ações por categoria */}
                                  <div className="mb-6 d-flex products-links-header align-items-center gap-3 text-dark">
                                    <span className="d-flex">
                                      Ver todos os produtos {" > "}
                                      <Link
                                        style={{ marginLeft: "6px" }}
                                        href={`/shop?category=${catId}`}
                                        onClick={onMegaLinkClick}
                                      >
                                        {cat.category}
                                      </Link>
                                    </span>

                                    {solutionHref && (
                                      <span className="d-flex">
                                        Ver soluções associadas à categoria{" "}
                                        {" > "}
                                        <Link
                                          style={{ marginLeft: "6px" }}
                                          href={solutionHref}
                                          onClick={onMegaLinkClick}
                                        >
                                          {"Ver soluções" || "Solução"}
                                        </Link>
                                      </span>
                                    )}
                                  </div>

                                  <br />
                                  <Carousel
                                    responsive={carouselCfg.responsive}
                                    arrows={carouselCfg.arrows}
                                    infinite={carouselCfg.infinite}
                                    transitionDuration={
                                      carouselCfg.transitionDuration
                                    }
                                    swipeable={carouselCfg.swipeable}
                                    draggable={carouselCfg.draggable}
                                    keyBoardControl={
                                      carouselCfg.keyBoardControl
                                    }
                                    renderDotsOutside={
                                      carouselCfg.renderDotsOutside
                                    }
                                    showDots={carouselCfg.showDots}
                                    lazyLoad={carouselCfg.lazyLoad}
                                    ssr={carouselCfg.ssr}
                                    minimumTouchDrag={
                                      carouselCfg.minimumTouchDrag
                                    }
                                    containerClass={carouselCfg.containerClass}
                                    itemClass={carouselCfg.itemClass}
                                    sliderClass={carouselCfg.sliderClass}
                                    onMouseEnter={setWhiteOn}
                                    onMouseLeave={setWhiteOff}
                                  >
                                    {cat.series.map((itemCat) => (
                                      <article
                                        className="submn-article"
                                        key={`${catId}-${itemCat._id}`}
                                      >
                                        <div
                                          className="image-header"
                                          onMouseEnter={setWhiteOn}
                                          onMouseLeave={setWhiteOff}
                                        >
                                          <img
                                            src={
                                              itemCat.image.startsWith("http")
                                                ? itemCat.image
                                                : API_BASE + itemCat.image
                                            }
                                            alt={itemCat.title}
                                            loading="lazy"
                                            decoding="async"
                                          />
                                          <div className="over-image">
                                            <Link
                                              href={itemCat.link}
                                              onClick={onMegaLinkClick}
                                            >
                                              <div className="link-box">
                                                <GoArrowUpRight />
                                              </div>
                                            </Link>
                                          </div>
                                        </div>
                                        <Link
                                          href={itemCat.link}
                                          onClick={onMegaLinkClick}
                                        >
                                          <strong className="text-dark text-black">
                                            {itemCat.title}
                                          </strong>
                                        </Link>
                                      </article>
                                    ))}
                                  </Carousel>
                                </Tab>
                              );
                            })}
                          </Tabs>
                        </div>
                      )}
                    </div>
                  </li>

                  {/* --------- SOLUÇÕES --------- */}
                  <li
                    className="nav-item sub-menu-item-hover"
                    data-trigger="solutions"
                    onMouseEnter={() => {
                      setWhiteOn();
                      setActiveMenu("solutions");
                    }}
                    onMouseLeave={() => {
                      setWhiteOff();
                      setActiveMenu(null);
                    }}
                    onFocus={() => {
                      setWhiteOn();
                      setActiveMenu("solutions");
                    }}
                    onBlur={() => {
                      setWhiteOff();
                      setActiveMenu(null);
                    }}
                  >
                    <Link
                      href="#"
                      className="nav-link-item"
                      onClick={onMegaLinkClick}
                    >
                      Soluções
                    </Link>

                    <div
                      className="sub-menu-box"
                      role="dialog"
                      aria-hidden={activeMenu !== "solutions"}
                      onMouseEnter={setWhiteOn}
                      onMouseLeave={setWhiteOff}
                    >
                      {loadingSolutions ? (
                        <div style={{ padding: "1rem 1.25rem" }}>
                          <small>A carregar soluções…</small>
                        </div>
                      ) : solutionsError ? (
                        <div
                          style={{ padding: "1rem 1.25rem", color: "crimson" }}
                        >
                          <small>{solutionsError}</small>
                        </div>
                      ) : solutionCards.length === 0 ? (
                        <div style={{ padding: "1rem 1.25rem" }}>
                          <small>Sem soluções para listar.</small>
                        </div>
                      ) : (
                        <Carousel
                          responsive={carouselCfg.responsive}
                          arrows={carouselCfg.arrows}
                          infinite={carouselCfg.infinite}
                          transitionDuration={
                            carouselCfg.transitionDuration
                          }
                          swipeable={carouselCfg.swipeable}
                          draggable={carouselCfg.draggable}
                          keyBoardControl={carouselCfg.keyBoardControl}
                          renderDotsOutside={carouselCfg.renderDotsOutside}
                          showDots={carouselCfg.showDots}
                          lazyLoad={carouselCfg.lazyLoad}
                          ssr={carouselCfg.ssr}
                          minimumTouchDrag={carouselCfg.minimumTouchDrag}
                          containerClass={carouselCfg.containerClass}
                          itemClass={carouselCfg.itemClass}
                          sliderClass={carouselCfg.sliderClass}
                          onMouseEnter={setWhiteOn}
                          onMouseLeave={setWhiteOff}
                        >
                          {solutionCards.map(({ id, title, img, href }) => (
                            <article className="submn-article" key={id}>
                              <div
                                className="image-header"
                                onMouseEnter={setWhiteOn}
                                onMouseLeave={setWhiteOff}
                              >
                                {img ? (
                                  <img
                                    src={img.startsWith("http") ? img : API_BASE + img}
                                    className="solution-hd-img"
                                    alt={title}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                ) : (
                                  <img
                                    src="https://via.placeholder.com/600x338?text=Sem+imagem"
                                    alt="Sem imagem"
                                  />
                                )}
                                <div className="over-image">
                                  <Link href={href} onClick={onMegaLinkClick}>
                                    <div className="link-box">
                                      <GoArrowUpRight />
                                    </div>
                                  </Link>
                                </div>
                              </div>
                              <Link href={href} onClick={onMegaLinkClick}>
                                <strong className="text-dark text-black">
                                  {title}
                                </strong>
                              </Link>
                            </article>
                          ))}
                        </Carousel>
                      )}
                    </div>
                  </li>

                  {/* --------- SERVIÇOS --------- */}
                  <li className="nav-item">
                    <Link
                      href="/service"
                      className="nav-link-item drop-trigger"
                      onClick={onMegaLinkClick}
                    >
                      Serviços
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      href="contact-us"
                      className="nav-link-item"
                      onClick={onMegaLinkClick}
                    >
                      Contactos
                    </Link>
                  </li>
                  <li className="d-none nav-item">
                    <Link href={"#"} onClick={onMegaLinkClick}>
                      <div className="start-project">
                        Começe aqui o seu projecto
                      </div>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="header-btn header-btn-l1 ms-auto ">
              <div className="tekup-header-icon">
                <Link
                  href="tel:+351210353555"
                  className="header-icon-info-box"
                  onClick={onMegaLinkClick}
                >
                  <div className="tekup-header-info-box-wrap">
                    <div className="tekup-header-info-box-icon">
                      <i className="ri-phone-fill"></i>
                    </div>
                    <div className="tekup-header-info-box-data">
                      <p>Ligue a qualquer altura</p>
                      <h6>(+351) 210 353 555</h6>
                    </div>
                  </div>
                </Link>
                <div
                  className="tekup-header-barger dark"
                  onClick={() => setSideBar(!sideBar)}
                >
                  <span></span>
                </div>
              </div>
            </div>

            <div
              className="mobile-menu-trigger"
              onClick={() => setIsActive(true)}
            >
              <span></span>
            </div>
          </nav>
        </div>
      </div>

      {/* ================= OFFCANVAS ================= */}
      <div className="tekup-sidemenu-wraper">
        <div className={`tekup-sidemenu-column ${sideBar ? "active" : ""}`}>
          <div className="tekup-sidemenu-body">
            <div className="tekup-sidemenu-logo">
              <Link href="%" onClick={() => setSideBar(false)}>
                <h5 style={{ fontSize: "20px" }} className="text-dark">
                  <img
                    src="https://ik.imagekit.io/fsobpyaa5i/Waveled_logo-02%20(1)%20(4).png"
                    style={{ maxHeight: "60px", marginBottom: "10px" }}
                    alt=""
                  />
                </h5>
              </Link>
            </div>
            <p className="mb-3">
              <strong>
                Soluções LED que unem eficiência, qualidade e design moderno
              </strong>
              <br />
              A Waveled é uma empresa inovadora especializada em soluções LED de
              iluminação e display. Apoiamos marcas, eventos e espaços
              comerciais com projetos chave-na-mão: consultoria, conceção,
              instalação, operação e manutenção. O nosso foco é entregar impacto
              visual, eficiência energética e fiabilidade.
            </p>
            <div className="tekup-sidemenu-thumb">
              <img
                src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20(29).jpg"
                alt="Waveled Led Solutions"
              />
            </div>
            <div className="tekup-contact-info-wrap">
              <div className="tekup-contact-info">
                <i className="ri-map-pin-2-fill"></i>
                <h5>Endereço</h5>
                <p className="m-0">
                  Rua Fernando Farinha nº 2A e 2B
                  <br />
                  Braço de Prata, 1950-448 Lisboa
                </p>
              </div>
              <div className="tekup-contact-info">
                <i className="ri-mail-fill"></i>
                <h5>Contactos</h5>
                <p className="m-0">
                  <Link href="mailto:sales@waveled.com">
                    sales@waveled.com
                  </Link>
                  <Link href="tel:+351210353555">+351 210 353 555</Link>
                </p>
              </div>
            </div>
          </div>
          <span
            className="tekup-sidemenu-close"
            onClick={() => setSideBar(false)}
          >
            <i className="ri-close-line"></i>
          </span>
        </div>
        <div
          className="offcanvas-overlay"
          onClick={() => setSideBar(false)}
        ></div>
      </div>
      <div
        className={`offcanvas-overlay ${sideBar ? "active" : ""}`}
        onClick={() => setSideBar(false)}
      ></div>
    </header>
  );
};

// Wrapper com Suspense para cumprir o requisito do Next
const HeaderFour = () => (
  <Suspense fallback={null}>
    <HeaderFourInner />
  </Suspense>
);

export default HeaderFour;
