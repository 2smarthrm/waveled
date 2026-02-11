"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { GoArrowUpRight } from "react-icons/go";
import LanguageSwitcher from "~/components/components/lang-switcher/lang-switcher";
import { GoSun } from "react-icons/go";
import { RiMoonFoggyLine } from "react-icons/ri";

const ProductMegaMenu = dynamic(() => import("./ProductMegaMenu"), {
  ssr: false,
  loading: () => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 24,
        width: 90,
      }}
    />
  ),
});

const SolutionMegaMenu = dynamic(() => import("./SolutionMegaMenu"), {
  ssr: false,
  loading: () => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 24,
        width: 90,
      }}
    />
  ),
});

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

const LOGO_DARK =
  "https://ik.imagekit.io/fsobpyaa5i/Waveled_logo-02%20(1)%20(4).png";
const LOGO_LIGHT =
  "https://ik.imagekit.io/fsobpyaa5i/Waveled_logo-03%20(1).png";

const isAbsoluteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const withHost = (u) => (u ? (isAbsoluteUrl(u) ? u : `${IMG_HOST}${u}`) : "");
const truncate = (s, n = 60) =>
  s && s.length > n ? s.substring(0, n).trimEnd() + "…" : s || "";

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const HeaderFourInner = () => {
  const [sideBar, setSideBar] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [scrollClassName, setScrollClassName] = useState("");
  const [isTransparent, setIsTransparent] = useState(false);

  const [solutions, setSolutions] = useState([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [solutionsError, setSolutionsError] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  const headerRef = useRef(null);
  const rafRef = useRef(0);
  const [IsSiteDark, setIsSiteDark] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  
  useEffect(() => {
    checkDarkMode();
    setActiveMenu(null);
    setIsActive(false); 
    setTimeout(() => {
      if(typeof window !== "undefined"){  
        window.scrollBy(0, 4);
        setTimeout(() => {
          window.scrollBy(0, -104);
        }, 500);
        setIsTransparent(computeShouldBeTransparent());
      }
    }, 10);
  }, [pathname, searchParams?.toString()]);
 

  const computeShouldBeTransparent = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (activeMenu) return false;

    const header = headerRef.current;
    if (!header) return false;

    const headerRect = header.getBoundingClientRect();
    const headerBottom = headerRect.bottom;

    const targets = Array.from(
      document.querySelectorAll(
        ".blur-slide-screen, .video-shop-large-section, body.dark-wave, body.dark-wave section, body.dark-wave .tekup-related-product-section,body.dark-wave .about-page-area,  body.dark-wave .service-img,  body.dark-wave.services-section, body.dark-wave .video-area,    .heroFull,  body.dark-wave .section, body.dark-wave .product-area, body.dark-wave .categorie-page,  body.dark-wave, body.dark-wave .product-category-section"
      )
    );
    if (!targets.length) return false;

    return targets.some((el) => {
      const r = el.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < window.innerHeight;
      const underHeaderLine = r.top <= headerBottom && r.bottom >= 0;
      return visible && underHeaderLine;
    });
  }, [activeMenu]);

 
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    setIsTransparent(computeShouldBeTransparent());
  }, [computeShouldBeTransparent]);

 
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsTransparent(computeShouldBeTransparent());
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [computeShouldBeTransparent]);

 
  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setIsTransparent(computeShouldBeTransparent());
    };

    const onScrollOrResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    onScrollOrResize();
    const t = setTimeout(onScrollOrResize, 140);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t);
    };
  }, [computeShouldBeTransparent]);

  useEffect(() => {
    const handleScrollSticky = () => {
      if (window.scrollY > 100) setScrollClassName("sticky-menu");
      else setScrollClassName("");
    };
    window.addEventListener("scroll", handleScrollSticky, { passive: true });
    handleScrollSticky();
    return () => window.removeEventListener("scroll", handleScrollSticky);
  }, []);

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

  useEffect(() => {
    const ac = new AbortController();

    const byOrderAsc = (a, b) => {
      const ao = Number.isFinite(Number(a?.order))
        ? Number(a.order)
        : Number.POSITIVE_INFINITY;
      const bo = Number.isFinite(Number(b?.order))
        ? Number(b.order)
        : Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;

      const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return ad - bd;
    };

    (async () => {
      try {
        setLoadingSolutions(true);
        setSolutionsError("");
        const json = await fetchJson(`${API_BASE}/api/solutions/`);
        const list = Array.isArray(json?.data) ? json.data : [];
        setSolutions([...list].sort(byOrderAsc));
      } catch (e) {
        if (e?.name !== "AbortError") {
          setSolutionsError(e?.message || "Erro ao carregar soluções.");
        }
      } finally {
        setLoadingSolutions(false);
      }
    })();

    return () => ac.abort();
  }, []);

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
      return { id, title: truncate(title, 44), img, href };
    });
  }, [solutions]);

  const carouselCfg = useMemo(
    () => ({
      responsive: {
        desktop: { breakpoint: { max: 3000, min: 1025 }, items: 5, slidesToSlide: 5 },
        tabletLg: { breakpoint: { max: 1304, min: 1000 }, items: 4, slidesToSlide: 4 },
        tablet: { breakpoint: { max: 600, min: 481 }, items: 1, slidesToSlide: 1 },
        mobile: { breakpoint: { max: 480, min: 0 }, items: 1, slidesToSlide: 1 },
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

  const onMegaLinkClick = useCallback(() => {
    setActiveMenu(null);
    setIsActive(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!activeMenu) return;
      const menuEl = document.querySelector(".sub-menu-box");
      const triggerElSolutions = document.querySelector('[data-trigger="solutions"]');
      const isInsideMenu = menuEl && menuEl.contains(e.target);
      const isOnTrigger = triggerElSolutions && triggerElSolutions.contains(e.target);
      if (!isInsideMenu && !isOnTrigger) setActiveMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  const [WindowSize, SetWindowSize] = useState(0);
  useEffect(() => {
    SetWindowSize(window.innerWidth);
    window.addEventListener("resize", (e) => {
      SetWindowSize(e.target.innerWidth);
    });
  }, []);

  const headerIsWhite = !!activeMenu || !isTransparent;
  const logoSrc = headerIsWhite ? LOGO_DARK : LOGO_LIGHT;
  const logoAlt = headerIsWhite ? "Waveled (logo preto)" : "Waveled (logo branco)";

 
  function checkDarkMode() {
    let status = true;
    if (!localStorage.getItem("theme-status")) {
      localStorage.setItem("theme-status", "true");
      document.body.classList.add("dark-wave");
      status = true;
    } else if (localStorage.getItem("theme-status") === "true") {
      document.body.classList.add("dark-wave");
      status = true;
    } else {
      document.body.classList.remove("dark-wave");
      status = false;
    }
    setIsSiteDark(status);
  }

  function ToggleTheme() {
    const isDark = localStorage.getItem("theme-status");
    let status = isDark === "true";
    if (!status) {
      localStorage.setItem("theme-status", "true");
      document.body.classList.add("dark-wave");
      setIsSiteDark(true);
    } else {
      localStorage.setItem("theme-status", "false");
      document.body.classList.remove("dark-wave");
      setIsSiteDark(false);
    }
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("scroll"));
      }
    }, 10);
  }

  return (
    <header
      id="site-header-area"
      ref={headerRef}
      className={`site-header tekup-header-section ${scrollClassName} ${
        isTransparent ? "transparent-header" : ""
      } ${activeMenu ? "header-force-white" : ""}`}
      data-header-mode={headerIsWhite ? "white" : "glass"}
    >
      <style jsx>{`
        #site-header-area .tekup-header-bottom {
          transition: background 0.18s ease, box-shadow 0.18s ease;
        }
        .contact-badge {
          padding: 2px 20px;
          border-radius: 10px;
          border: 1px solid #ffff;
          border-radius: 60px;
        }
        .ml-4 {
          margin-left: 20px !important;
        }
        .site-menu-main .nav-item a {
          font-size: 13px !important;
        }
        .transparent-header .tekup-header-bottom {
          background: transparent !important;
          box-shadow: none !important;
        }
        #site-header-area[data-header-mode="white"] .tekup-header-bottom {
          background: #fff !important;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.06);
        }
        #site-header-area[data-header-mode="glass"] .nav-link-item,
        #site-header-area[data-header-mode="glass"] .nav-link-item.drop-trigger,
        #site-header-area[data-header-mode="glass"] .tekup-header-info-box-data h6,
        #site-header-area[data-header-mode="glass"] .tekup-header-info-box-data p {
          color: rgba(255, 255, 255, 0.92) !important;
        }
        #site-header-area[data-header-mode="glass"] .nav-link-item:hover {
          color: #fff !important;
        }
        #site-header-area[data-header-mode="white"] .nav-link-item,
        #site-header-area[data-header-mode="white"] .nav-link-item.drop-trigger,
        #site-header-area[data-header-mode="white"] .tekup-header-info-box-data h6,
        #site-header-area[data-header-mode="white"] .tekup-header-info-box-data p {
          color: #111 !important;
        }
        .header-force-white .tekup-header-bottom {
          background: #fff !important;
        }
        .sub-menu-box {
          position: relative;
          overflow: hidden;
          will-change: opacity, transform;
          z-index: 999999;
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
      `}</style>

      <div className="tekup-header-bottom">
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
              <div className="menu-overlay" onClick={() => setIsActive(false)}></div>

              <nav className={`menu-block ${isActive ? "active" : ""}`} id="append-menu-header">
                <div className="mobile-menu-head">
                  <div>
                    <Link href={"/"}>
                      <img
                        src="https://ik.imagekit.io/fsobpyaa5i/Waveled_logo-02%20(1)%20(4).png"
                        style={{ maxWidth: "160px", marginLeft: "20px" }}
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="current-menu-title"></div>
                  <div className="mobile-menu-close" onClick={() => setIsActive(false)}>
                    &times;
                  </div>
                </div>

                <ul className="site-menu-main" onClick={menuMainClickHandler}>
                  <li className="nav-item d-none">
                    <Link href="/" className="nav-link-item drop-trigger" onClick={onMegaLinkClick}>
                      Início
                    </Link>
                  </li>
                  <li className="nav-item ml-4">
                    {WindowSize >= 900 ? (
                      <ProductMegaMenu />
                    ) : (
                      <Link
                        style={{ paddingLeft: "20px" }}
                        className="nav-link-item drop-trigger"
                        href="/products"
                      >
                        Produtos
                      </Link>
                    )}
                  </li>
                  <li className="nav-item">
                    <Link href="/service" className="nav-link-item drop-trigger" onClick={onMegaLinkClick}>
                      Serviços
                    </Link>
                  </li>
                  <li className="nav-item">
                    {WindowSize >= 900 ? (
                      <SolutionMegaMenu />
                    ) : (
                      <Link
                        className="nav-link-item drop-trigger"
                        href="//solution?area=695b880b926032a07bbefef7"
                      >
                        Soluções
                      </Link>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
            <div className="header-btn d-flex header-btn-l1 ms-auto">
              <li className="nav-item contact-badge ">
                <Link href="contact-us" className="nav-link-item" onClick={onMegaLinkClick}>
                  Contactos
                </Link>
              </li>

              <div className="toggle-dark-theme" onClick={() => ToggleTheme()}>
                {IsSiteDark ? <GoSun /> : <RiMoonFoggyLine />}
              </div>
              <div className="tekup-header-icon">
                <div className="tekup-header-barger dark" onClick={() => setSideBar(!sideBar)}>
                  <span></span>
                </div>
              </div>
            </div>

            <div className="d-flex">
              <div className="lang-block">
                <LanguageSwitcher />
              </div>
              <div className="mobile-menu-trigger" onClick={() => setIsActive(true)}>
                <span></span>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="tekup-sidemenu-wraper">
        <div className={`tekup-sidemenu-column ${sideBar ? "active" : ""}`}>
          <div className="tekup-sidemenu-body">
            <div className="tekup-sidemenu-logo">
              <Link href="%" onClick={() => setSideBar(false)}>
                <h5 style={{ fontSize: "20px" }} className="text-dark">
                  <img
                    className="dark-logo"
                    src={LOGO_DARK}
                    style={{ maxHeight: "60px", marginBottom: "10px" }}
                    alt=""
                  />
                  <img
                    className="light-logo"
                    src={LOGO_LIGHT}
                    style={{ maxHeight: "60px", marginBottom: "10px" }}
                    alt=""
                  />
                </h5>
              </Link>
            </div>

            <p className="mb-3">
              <strong>Soluções LED que unem eficiência, qualidade e design moderno</strong>
              <br />
              A Waveled é uma empresa inovadora especializada em soluções LED de iluminação e display.
              Apoiamos marcas, eventos e espaços comerciais com projetos chave-na-mão: consultoria,
              conceção, instalação, operação e manutenção. O nosso foco é entregar impacto visual,
              eficiência energética  e fiabilidade.
            </p>

            <div className="tekup-sidemenu-thumb">
              <img src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20(29).jpg"  alt="Waveled Led Solutions"  />
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
                  <Link href="mailto:sales@waveled.com">sales@waveled.com</Link>
                  <Link href="tel:+351210353555">+351 210 353 555</Link>
                </p>
              </div>
            </div>
          </div>

          <span className="tekup-sidemenu-close" onClick={() => setSideBar(false)}>
            <i className="ri-close-line"></i>
          </span>
        </div>

        <div className="offcanvas-overlay" onClick={() => setSideBar(false)}></div>
      </div>

      <div className={`offcanvas-overlay ${sideBar ? "active" : ""}`} onClick={() => setSideBar(false)}></div>
    </header>
  );
};

const HeaderFour = () => (
  <Suspense fallback={null}>
    <HeaderFourInner />
  </Suspense>
);

export default HeaderFour;