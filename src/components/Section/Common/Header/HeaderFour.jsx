/*
/*

HeaderFour — Menu "Soluções" dinâmico a partir da API

- Fetch /api/solutions
- Ordena: orderFirstOldestThenNewest(list.sort())
- Mapeia para cards ({ id, title, img, href })
- Substitui os itens hardcoded por dados reais

*/

"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { GoArrowUpRight } from "react-icons/go";

// ====== Config ======
const API_BASE = "https://waveledserver.vercel.app";
const IMG_HOST = "https://waveledserver.vercel.app";

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

// Ordenação: primeiras adicionadas (ASC) seguidas das mais recentes (DESC)
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

// Fetch JSON defensivo
async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const HeaderFour = () => {
  const [sideBar, setSideBar] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [subMenuArray, setSubMenuArray] = useState([]);
  const [subMenuTextArray, setSubMenuTextArray] = useState([]);
  const [scrollClassName, setScrollClassName] = useState("");
  const [isTransparent, setIsTransparent] = useState(false);
  const [key, setKey] = useState("0");
  const [forceOpaque, setForceOpaque] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [catsError, setCatsError] = useState("");

  // ---- Soluções (submenu) ----
  const [solutions, setSolutions] = useState([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [solutionsError, setSolutionsError] = useState("");

  const headerRef = useRef(null);
  const rafRef = useRef(0);

  // ===== react-multi-carousel settings =====
  const carouselCfg = useMemo(
    () => ({
      responsive: {
        desktop: { breakpoint: { max: 3000, min: 1025 }, items: 5, slidesToSlide: 5 },
        tabletLg: { breakpoint: { max: 1024, min: 601 }, items: 4, slidesToSlide: 4 },
        tablet:   { breakpoint: { max: 600, min: 481 },  items: 3, slidesToSlide: 3 },
        mobile:   { breakpoint: { max: 480, min: 0 },    items: 2, slidesToSlide: 2 },
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

  /** ---------- Transparent quando o header cobre ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const getTargets = () =>
      Array.from(
        document.querySelectorAll(
          ".main-home-hero, .blur-slide-screen, .video-shop-large-section, .service-img, .services-section, .video-area"
        )
      );

    const checkOverlap = () => {
      const header = headerRef.current;
      if (!header) return;

      const headerRect = header.getBoundingClientRect();
      const targets = getTargets();

      if (!targets.length) {
        if (isTransparent) setIsTransparent(false);
        return;
      }

      const overlapping = targets.some((el) => {
        const r = el.getBoundingClientRect();
        const headerBottom = headerRect.bottom;
        const isAnyPartVisible = r.bottom > 0 && r.top < window.innerHeight;
        const isUnderHeaderTopLine = r.top <= headerBottom;
        return isAnyPartVisible && isUnderHeaderTopLine;
      });

      setIsTransparent(overlapping && !forceOpaque);
    };

    const onScrollOrResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(checkOverlap);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    onScrollOrResize();
    const t = setTimeout(onScrollOrResize, 150);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t);
    };
  }, [isTransparent, forceOpaque]);

  // Força header opaco enquanto hover no mega menu
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (forceOpaque) {
      setIsTransparent(false);
    } else {
      window.dispatchEvent(new Event("scroll"));
    }
  }, [forceOpaque]);

  /** ---------- Menu/Mobile ---------- */
  const menuMainClickHandler = (e) => {
    if (typeof window !== "undefined" && window.innerWidth <= 991) {
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active");
      });

      const hasChildren = e.target.closest(".nav-item-has-children");
      if (hasChildren) {
        e.preventDefault();
        if (hasChildren.classList.contains("nav-item-has-children")) {
          showSubMenu(hasChildren);
        }
      }
    }
  };

  const goBackClickHandler = () => {
    const lastItem = subMenuArray.slice(-1)[0];
    const lastItemText = subMenuTextArray.slice(-2)[0];
    setSubMenuArray(subMenuArray.slice(0, -1));
    setSubMenuTextArray(subMenuTextArray.slice(0, -1));
    if (lastItem) {
      if (subMenuArray.length >= 0) {
        const el = document.getElementById(lastItem);
        if (el && !el.classList.contains("nav-item-has-children")) {
          el.style.animation = "slideRight 0.5s ease forwards";
          const titleEl = document.querySelector(".current-menu-title");
          if (titleEl) titleEl.innerHTML = lastItemText || "";
          setTimeout(() => {
            el.classList.remove("active");
          }, 300);
        } else {
          document.querySelector(".go-back")?.classList.remove("active");
        }
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

  const menuTriggerClickHandler = () => toggleMenu();

  const closeMenuClickHandler = () => {
    toggleMenu();
    const submenuAll = document.querySelectorAll(".sub-menu");
    submenuAll.forEach((submenu) => {
      submenu.classList.remove("active");
      submenu.removeAttribute("style");
    });
    document.querySelector(".go-back")?.classList.remove("active");
  };

  const overlayClickHandler = () => toggleMenu();

  const showSubMenu = (hasChildren) => {
    const submenuAll = document.querySelectorAll(".sub-menu");
    submenuAll.forEach((submenu) => submenu.classList.remove("active"));
    const subMenu = hasChildren.querySelector(".sub-menu");
    if (!subMenu) return;
    setSubMenuArray((prev) => [...prev, subMenu.id]);
    subMenu.classList.add("active");
    subMenu.style.animation = "slideLeft 0.5s ease forwards";
    const menuTitle =
      hasChildren.querySelector(".drop-trigger")?.textContent || "";
    setSubMenuTextArray((prev) => [...prev, menuTitle]);
    const titleEl = document.querySelector(".current-menu-title");
    if (titleEl) titleEl.innerHTML = menuTitle;
    document.querySelector(".mobile-menu-head")?.classList.add("active");
  };

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth > 991 && isActive) {
        toggleMenu();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive]);

  /** ---------- Buscar produtos e agrupar por categoria ---------- */
  useEffect(() => {
    let abort = false;
    async function load() {
      setLoadingCats(true);
      setCatsError("");
      try {
        const raw = await fetchJson(`${API_BASE}/api/products`);
        if (abort) return;
        const items = toArray(raw);

        // Agrupar por categoria
        const map = new Map();
        items.forEach((p) => {
          const catName = p?.wl_category?.wl_name || "Outros";
          const catSlug = p?.wl_category?.wl_slug || "Outros";
          const catId = p?.wl_category?._id || "others";
          if (!map.has(catName)) {
            map.set(catName, { category: catName, id: catId, slug: catSlug, series: [] });
          }
          const cover =
            Array.isArray(p?.wl_images) && p.wl_images.length
              ? withHost(p.wl_images[0])
              : withHost(p?.wl_cover);

          map.get(catName).series.push({
            _id: p?._id,
            title: truncate(p?.wl_name || "Produto"),
            image: cover || "https://via.placeholder.com/600x600?text=Produto",
            link: `/single-shop?product=${p?._id}`,
          });
        });

        const arr = Array.from(map.values()).sort((a, b) =>
          a.category.localeCompare(b.category, "pt")
        );
        const maxPerCat = 12;
        arr.forEach((c) => {
          c.series = c.series.slice(0, maxPerCat);
        });

        if (!abort) {
          setCategories(arr);
          setKey(arr.length ? "0" : "0");
        }
      } catch (e) {
        if (!abort) setCatsError(e?.message || "Erro ao carregar categorias.");
      } finally {
        if (!abort) setLoadingCats(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, []);

  /** ---------- Buscar soluções (submenu Soluções) ---------- */
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

        // aplica a ordenação (como pediste)
        const ordered = orderFirstOldestThenNewest(list.sort());
        setSolutions(ordered);
      } catch (e) {
        if (e?.name !== "AbortError") setSolutionsError(e?.message || "Erro ao carregar soluções.");
      } finally {
        setLoadingSolutions(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // cards: id, title, img, href (como pediste)
  const cards = useMemo(() => {
    return (solutions || []).map((item) => {
      const id = String(item?._id || "");
      const title = (typeof item?.title === "string" && item.title.trim()) ? item.title : "Solução";
      const rawImg = item?.image || item?.cover || item?.coverUrl || item?.img || item?.thumbnail || item?.thumbUrl || item?.photo;
      const img = withHost(rawImg);
      const href = `/solutions?sl=${encodeURIComponent(id)}`;
      return { id, title, img, href };
    });
  }, [solutions]);

  // ---------- Hover intent para tabs ----------
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

  /** ---------- Render ---------- */
  return (
    <header
      id="site-header-area"
      ref={headerRef}
      className={`site-header tekup-header-section ${scrollClassName} ${isTransparent ? "transparent-header" : ""}`}
    >
      {/* CSS crítico para o mega menu */}
      <style jsx>{`
        .sub-menu-box { position: relative; overflow: hidden; will-change: opacity, transform; }
        .sub-menu-box .tab-content { position: relative; min-height: 260px; overflow: hidden; contain: layout paint; }
        .sub-menu-box .tab-content > .tab-pane { position: absolute; inset: 0; opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 0.18s ease; }
        .sub-menu-box .tab-content > .tab-pane.active,
        .sub-menu-box .tab-content > .tab-pane.show.active { position: relative; opacity: 1; visibility: visible; pointer-events: auto; }
        .submn-article { display: flex; flexDirection: column; gap: 6px; padding: 8px; text-align: center; }
        .submn-article img { width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px; }
        .submn-article strong { display:block; margin-top:6px; color:#000; }
        .sub-menu-box .react-multi-carousel-track { will-change: transform; }
      `}</style>

      <div className="tekup-header-bottom bg-white">
        <div className="container-fuild">
          <nav className="navbar site-navbar">
            <div className="brand-logo">
              <Link href="/"><h5 className="text-black text-dark">WAVELED</h5></Link>
            </div>

            <div className="menu-block-wrapper">
              <div className="menu-overlay" onClick={overlayClickHandler}></div>
              <nav className={`menu-block ${isActive ? "active" : ""}`} id="append-menu-header">
                <div className="mobile-menu-head">
                  <div className="go-back" onClick={goBackClickHandler}><i className="fa fa-angle-left"></i></div>
                  <div className="current-menu-title"></div>
                  <div className="mobile-menu-close" onClick={closeMenuClickHandler}>&times;</div>
                </div>

                <ul className="site-menu-main" onClick={menuMainClickHandler}>
                  <li className="nav-item">
                    <Link href="/" className="nav-link-item drop-trigger">Início</Link>
                  </li>

                  {/* --------- PRODUTOS / MEGA MENU --------- */}
                  <li
                    className="nav-item sub-menu-item-hover"
                    onMouseEnter={() => setForceOpaque(true)}
                    onMouseLeave={() => setForceOpaque(false)}
                  >
                    <Link href="about-us" className="nav-link-item">Produtos</Link>
                    <div className="sub-menu-box" onMouseEnter={() => setForceOpaque(true)} onMouseLeave={() => setForceOpaque(false)}>
                      {loadingCats ? (
                        <div style={{ padding: "1rem 1.25rem" }}><small>A carregar categorias…</small></div>
                      ) : catsError ? (
                        <div style={{ padding: "1rem 1.25rem", color: "crimson" }}><small>{catsError}</small></div>
                      ) : categories.length === 0 ? (
                        <div style={{ padding: "1rem 1.25rem" }}><small>Sem produtos para listar.</small></div>
                      ) : (
                        <Tabs
                          id="tab-menu"
                          className="mb-3"
                          activeKey={key}
                          onSelect={(k) => setKey((prev) => (prev === k ? prev : k || "0"))}
                          transition={false}
                          mountOnEnter={false}
                          unmountOnExit={false}
                        >
                          {categories.map((cat, index) => (
                            <Tab
                              key={cat.id || index}
                              eventKey={String(index)}
                              mountOnEnter={false}
                              unmountOnExit={false}
                              title={
                                <span
                                  className="text-dark"
                                  onMouseEnter={() => handleTabHover(index)}
                                  onMouseLeave={cancelTabHover}
                                  onFocus={() => setKey(String(index))}
                                  style={{ cursor: "pointer", color: "#000" }}
                                >
                                  {cat.category}
                                </span>
                              }
                            >
                              <div className="mb-6 d-flex text-dark">
                                Ver todos os produtos {" > "}
                                <Link style={{ marginLeft: "10px" }} href={`/shop?category=${cat.id}`}>
                                  {cat.category}
                                </Link>
                              </div>
                              <br />
                              <Carousel
                                responsive={carouselCfg.responsive}
                                arrows={carouselCfg.arrows}
                                infinite={carouselCfg.infinite}
                                transitionDuration={carouselCfg.transitionDuration}
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
                              >
                                {cat.series.map((itemCat) => (
                                  <article className="submn-article" key={itemCat._id}>
                                    <div className="image-header">
                                      <img src={itemCat.image} alt={itemCat.title} loading="lazy" decoding="async" />
                                      <div className="over-image">
                                        <Link href={itemCat.link}>
                                          <div className="link-box"><GoArrowUpRight /></div>
                                        </Link>
                                      </div>
                                    </div>
                                    <Link href={itemCat.link}>
                                      <strong className="text-dark text-black">{itemCat.title}</strong>
                                    </Link>
                                  </article>
                                ))}
                              </Carousel>
                            </Tab>
                          ))}
                        </Tabs>
                      )}
                    </div>
                  </li>

                  <li className="nav-item">
                    <Link href="/service" className="nav-link-item drop-trigger">Serviços</Link>
                  </li>

                  {/* --------- SOLUÇÕES (dinâmico) --------- */}
                  <li
                    className="nav-item sub-menu-item-hover"
                    onMouseEnter={() => setForceOpaque(true)}
                    onMouseLeave={() => setForceOpaque(false)}
                  >
                    <Link href="#" className="nav-link-item">Soluções</Link>
                    <div className="sub-menu-box" onMouseEnter={() => setForceOpaque(true)} onMouseLeave={() => setForceOpaque(false)}>
                      {loadingSolutions ? (
                        <div style={{ padding: "1rem 1.25rem" }}>
                          <small>A carregar soluções…</small>
                        </div>
                      ) : solutionsError ? (
                        <div style={{ padding: "1rem 1.25rem", color: "crimson" }}>
                          <small>{solutionsError}</small>
                        </div>
                      ) : cards.length === 0 ? (
                        <div style={{ padding: "1rem 1.25rem" }}>
                          <small>Sem soluções para listar.</small>
                        </div>
                      ) : (
                        <Carousel
                          responsive={carouselCfg.responsive}
                          arrows={carouselCfg.arrows}
                          infinite={carouselCfg.infinite}
                          transitionDuration={carouselCfg.transitionDuration}
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
                        >
                          {cards.map(({ id, title, img, href }) => (
                            <article className="submn-article" key={id}>
                              <div className="image-header">
                                {img ? (
                                  <img src={img} className="solution-hd-img" alt={title} loading="lazy" decoding="async" />
                                ) : (
                                  <img
                                    src="https://via.placeholder.com/600x338?text=Sem+imagem"
                                    alt="Sem imagem"
                                  />
                                )}
                                <div className="over-image">
                                  <Link href={href}>
                                    <div className="link-box"><GoArrowUpRight /></div>
                                  </Link>
                                </div>
                              </div>
                              <Link href={href}>
                                <strong className="text-dark text-black">{title}</strong>
                              </Link>
                            </article>
                          ))}
                        </Carousel>
                      )}
                    </div>
                  </li>

                  <li className="nav-item">
                    <Link href="contact-us" className="nav-link-item">Contactos</Link>
                  </li>
                  <li className="nav-item">
                    <Link href={"#"}>
                      <div className="start-project">Começe aqui o seu projecto</div>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="header-btn header-btn-l1 ms-auto ">
              <div className="tekup-header-icon">
                <Link href="tel:+351210353555" className="header-icon-info-box">
                  <div className="tekup-header-info-box-wrap">
                    <div className="tekup-header-info-box-icon"><i className="ri-phone-fill"></i></div>
                    <div className="tekup-header-info-box-data">
                      <p>Ligue a qualquer altura</p>
                      <h6>(+351) 210 353 555</h6>
                    </div>
                  </div>
                </Link>
                <div className="tekup-header-barger dark" onClick={() => setSideBar(!sideBar)}>
                  <span></span>
                </div>
              </div>
            </div>

            <div className="mobile-menu-trigger" onClick={menuTriggerClickHandler}><span></span></div>
          </nav>
        </div>
      </div>

      {/* ================= OFFCANVAS ================= */}
      <div className="tekup-sidemenu-wraper">
        <div className={`tekup-sidemenu-column ${sideBar ? "active" : ""}`}>
          <div className="tekup-sidemenu-body">
            <div className="tekup-sidemenu-logo">
              <Link href=""><h5 style={{ fontSize: "20px" }} className="text-dark">LOGO HERE WAVELED</h5></Link>
            </div>
            <p className="mb-3">
              <strong>Soluções LED que unem eficiência, qualidade e design moderno</strong><br />
              A Waveled é uma empresa inovadora especializada em soluções LED de iluminação e display. Apoiamos marcas,
              eventos e espaços comerciais com projetos chave-na-mão: consultoria, conceção, instalação, operação e
              manutenção. O nosso foco é entregar impacto visual, eficiência energética e fiabilidade.
            </p>
            <div className="tekup-sidemenu-thumb">
              <img src="https://exportech.com.pt/static/media/12.98dcb3ffc1bbebba15e1.jpg" alt="Waveled Led Solutions" />
            </div>
            <div className="tekup-contact-info-wrap">
              <div className="tekup-contact-info">
                <i className="ri-map-pin-2-fill"></i>
                <h5>Endereço</h5>
                <p className="m-0">Rua Fernando Farinha nº 2A e 2B<br/>Braço de Prata, 1950-448 Lisboa</p>
              </div>
              <div className="tekup-contact-info">
                <i className="ri-mail-fill"></i>
                <h5>Contactos</h5>
                <p className="m-0">
                  <Link href="mailto:geral@waveled.pt">geral@waveled.pt</Link><br/>
                  <Link href="tel:+351210353555">+351 210 353 555</Link>
                </p>
              </div>
            </div>
            <div className="tekup-social-icon-box">
              <ul>
                <li><Link href="https://www.facebook.com/"><i className="ri-facebook-fill"></i></Link></li>
                <li><Link href="https://www.linkedin.com/"><i className="ri-linkedin-fill"></i></Link></li>
                <li><Link href="https://twitter.com/"><i className="ri-twitter-fill"></i></Link></li>
                <li><Link href="https://www.instagram.com/"><i className="ri-instagram-fill"></i></Link></li>
              </ul>
            </div>
          </div>
          <span className="tekup-sidemenu-close" onClick={() => setSideBar(false)}><i className="ri-close-line"></i></span>
        </div>
        <div className="offcanvas-overlay" onClick={() => setSideBar(false)}></div>
      </div>
      <div className={`offcanvas-overlay ${sideBar ? "active" : ""}`} onClick={() => setSideBar(false)}></div>
    </header>
  );
};

export default HeaderFour;
