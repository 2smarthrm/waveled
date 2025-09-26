 
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

const HeaderFour = () => {
  const [sideBar, setSideBar] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [subMenuArray, setSubMenuArray] = useState([]);
  const [subMenuTextArray, setSubMenuTextArray] = useState([]);
  const [scrollClassName, setScrollClassName] = useState("");
  const [isTransparent, setIsTransparent] = useState(false);
  const [key, setKey] = useState("0");
  const [forceOpaque, setForceOpaque] = useState(false);

  const headerRef = useRef(null);
  const rafRef = useRef(0);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 600, settings: { slidesToShow: 3, slidesToScroll: 3, initialSlide: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

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
          ".main-home-hero, .blur-slide-screen, .video-shop-large-section, .service-img"
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

  /** ---------- Dados do Mega Menu (exemplo) ---------- */
  const Categories = [
    {
      category: "Mini & Micro",
      series: [
        { title: "Umicro", image: "https://www.unilumin.com/media/thumbs/products/Usign/1%20600%20600.png", link: "#" },
        { title: "Umini pro", image: "https://www.unilumin.com/media/thumbs/600_2x.png", link: "#" },
        { title: "Umini W", image: "https://www.unilumin.com/media/thumbs/900_11.png", link: "#" },
        { title: "Umini P", image: "https://www.unilumin.com/media/thumbs/600Minip_1.png", link: "#" },
        { title: "Umicro", image: "https://www.unilumin.com/media/thumbs/products/Usign/1%20600%20600.png", link: "#" },
        { title: "Umini pro", image: "https://www.unilumin.com/media/thumbs/600_2x.png", link: "#" },
        { title: "Umini W", image: "https://www.unilumin.com/media/thumbs/900_11.png", link: "#" },
        { title: "Umini P", image: "https://www.unilumin.com/media/thumbs/600Minip_1.png", link: "#" },
      ],
    },
    {
      category: "Indoor",
      series: [
        { title: "U-Natural", image: "https://www.unilumin.com/media/thumbs/CASE%20NEW/ICE2025/600%20%20600-un.png", link: "#" },
        { title: "Umate LM", image: "https://www.unilumin.com/media/thumbs/products/Umate%20LM/Umate-LM_F.png", link: "#" },
        { title: "Umate PN", image: "https://www.unilumin.com/media/thumbs/products/Umate%20PN%20SERIES/Umate-PN-SERIES_F.png", link: "#" },
        { title: "FCQ", image: "https://www.unilumin.com/media/thumbs/900_19.png", link: "#" },
        { title: "Uslim III", image: "https://www.unilumin.com/media/thumbs/products/Uslim%E2%85%A2/Uslim%E2%85%A2%20600%20600.png", link: "#" },
        { title: "Uslim S2", image: "https://www.unilumin.com/media/thumbs/products/Uslim%20S2/600%20%20600-uslims2.png", link: "#" },
      ],
    },
    {
      category: "Outdoor",
      series: [
        { title: "Usurfacell pRO", image: "https://www.unilumin.com/media/thumbs/products/UsurfaceIIIpro/IIIPRO-600%20600.png", link: "#" },
        { title: "Umate LM O", image: "https://www.unilumin.com/media/thumbs/products/Umate%20LM%20O/Umate%20LM%20O-600%20%20600.png", link: "#" },
        { title: "Umate SF", image: "https://www.unilumin.com/media/thumbs/products/Umate%20SF/new/Umate-SF_f600.png", link: "#" },
        { title: "Usign", image: "https://www.unilumin.com/media/thumbs/products/Usign/1%20600%20600.png", link: "#" },
        { title: "Usurface III", image: "https://www.unilumin.com/media/thumbs/products/USURFACEIII/600x600.png", link: "#" },
        { title: "Ustorm III", image: "https://www.unilumin.com/media/thumbs/products/UstormIII/600x600.png", link: "#" },
      ],
    },
    {
      category: "Aluguel",
      series: [
        { title: "Utile EA series", image: "https://www.unilumin.com/media/thumbs/600_17.png", link: "#" },
        { title: "UpadIV ME Series", image: "https://www.unilumin.com/media/thumbs/600_16.png", link: "#" },
        { title: "UpadIV series", image: "https://www.unilumin.com/media/thumbs/Upad4-900.png", link: "#" },
        { title: "XF Series", image: "https://www.unilumin.com/media/thumbs/600_15.png", link: "#" },
        { title: "XV", image: "https://www.unilumin.com/media/thumbs/LargeFile/900_1.png", link: "#" },
      ],
    },
  ];

  /** ---------- Render ---------- */
  return (
    <header
      id="site-header-area"
      ref={headerRef}
      className={`site-header tekup-header-section ${scrollClassName} ${
        isTransparent ? "transparent-header" : ""
      }`}
    >
      <div className="tekup-header-bottom bg-white">
        <div className="container-fuild">
          <nav className="navbar site-navbar">
            <div className="brand-logo">
              <Link href="/home-4">
                <h5 className="text-black text-dark">EXPORTECH</h5>
              </Link>
            </div>

            <div className="menu-block-wrapper">
              <div className="menu-overlay" onClick={overlayClickHandler}></div>
              <nav
                className={`menu-block ${isActive ? "active" : ""}`}
                id="append-menu-header"
              >
                <div className="mobile-menu-head">
                  <div className="go-back" onClick={goBackClickHandler}>
                    <i className="fa fa-angle-left"></i>
                  </div>
                  <div className="current-menu-title"></div>
                  <div className="mobile-menu-close" onClick={closeMenuClickHandler}>
                    &times;
                  </div>
                </div>

                <ul className="site-menu-main" onClick={menuMainClickHandler}>
                  <li className="nav-item">
                    <Link href="/home-4" className="nav-link-item drop-trigger">
                      Início
                    </Link>
                  </li>

                  {/* --------- PRODUTOS / MEGA MENU --------- */}
                  <li
                    className="nav-item sub-menu-item-hover"
                    onMouseEnter={() => setForceOpaque(true)}
                    onMouseLeave={() => setForceOpaque(false)}
                  >
                    <Link href="about-us" className="nav-link-item">
                      Produtos
                    </Link>

                    <div
                      className="sub-menu-box"
                      onMouseEnter={() => setForceOpaque(true)}
                      onMouseLeave={() => setForceOpaque(false)}
                    >
                      <Tabs
                        id="tab-menu"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                      >
                        {Categories.map((item, index) => (
                          <Tab
                            key={index}
                            eventKey={String(index)}
                            title={
                              <span
                                onMouseEnter={() => setKey(String(index))}
                                onFocus={() => setKey(String(index))}
                                style={{ cursor: "pointer" }}
                              >
                                {item.category}
                              </span>
                            }
                          >
                            <Slider {...settings}>
                              {item?.series.map((itemCat, indexKey) => (
                                <Link href={"/single-shop"} key={indexKey}>
                                  <article className="submn-article">
                                    <img   src={itemCat?.image} alt={itemCat?.title} />
                                    <strong>{itemCat?.title}</strong>
                                  </article>
                                </Link>
                              ))}
                            </Slider>
                          </Tab>
                        ))}
                      </Tabs>
                    </div>
                  </li>

                  <li className="nav-item">
                    <Link href="#" className="nav-link-item drop-trigger">
                      Serviços
                    </Link>
                  </li>

                  <li className="nav-item ">
                    <Link href="/about-us" className="nav-link-item drop-trigger">
                      Sobre nós
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="contact-us" className="nav-link-item">
                      Contactos
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="header-btn header-btn-l1 ms-auto ">
              <div className="tekup-header-icon">
                <Link href="tel:+351210353555" className="header-icon-info-box">
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

            <div className="mobile-menu-trigger" onClick={menuTriggerClickHandler}>
              <span></span>
            </div>
          </nav>
        </div>
      </div>

      {/* ================= OFFCANVAS (WAVELED) ================= */}
      <div className="tekup-sidemenu-wraper">
        <div className={`tekup-sidemenu-column ${sideBar ? "active" : ""}`}>
          <div className="tekup-sidemenu-body">
            <div className="tekup-sidemenu-logo">
              <Link href="">
                 <h5 style={{fontSize:"20px"}} className="text-dark" >LOGO HERE KIOSSO</h5>
              </Link>
            </div>

            {/* Texto institucional */}
            <p className="mb-3">
              <strong>Soluções LED que unem eficiência, qualidade e design moderno</strong><br />
              A Waveled é uma empresa inovadora especializada em soluções LED de iluminação e
              display. Apoiamos marcas, eventos e espaços comerciais com projetos chave-na-mão:
              consultoria, conceção, instalação, operação e manutenção. O nosso foco é entregar
              impacto visual, eficiência energética e fiabilidade.
            </p>

            {/* Imagem destacada */}
            <div className="tekup-sidemenu-thumb">
              <img  
                src="https://exportech.com.pt/static/media/12.98dcb3ffc1bbebba15e1.jpg"
                alt="Waveled LED Solutions"
              />
            </div>

            {/* Contactos */}
            <div className="tekup-contact-info-wrap">
              <div className="tekup-contact-info">
                <i className="ri-map-pin-2-fill"></i>
                <h5>Endereço</h5>
                <p className="m-0">
                  Rua Fernando Farinha nº 2A e 2B<br />
                  Braço de Prata, 1950-448 Lisboa
                </p>
              </div>

              <div className="tekup-contact-info">
                <i className="ri-mail-fill"></i>
                <h5>Contactos</h5>
                <p className="m-0">
                  <Link href="mailto:geral@waveled.pt">geral@waveled.pt</Link><br />
                  <Link href="tel:+351210353555">+351 210 353 555</Link>
                </p>
              </div>
            </div>

       

            {/* Redes sociais (mantive exemplo) */}
            <div className="tekup-social-icon-box">
              <ul>
                <li>
                  <Link href="https://www.facebook.com/">
                    <i className="ri-facebook-fill"></i>
                  </Link>
                </li>
                <li>
                  <Link href="https://www.linkedin.com/">
                    <i className="ri-linkedin-fill"></i>
                  </Link>
                </li>
                <li>
                  <Link href="https://twitter.com/">
                    <i className="ri-twitter-fill"></i>
                  </Link>
                </li>
                <li>
                  <Link href="https://www.instagram.com/">
                    <i className="ri-instagram-fill"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <span className="tekup-sidemenu-close" onClick={() => setSideBar(false)}>
            <i className="ri-close-line"></i>
          </span>
        </div>

        <div className="offcanvas-overlay" onClick={() => setSideBar(false)}></div>
      </div>

      <div
        className={`offcanvas-overlay ${sideBar ? "active" : ""}`}
        onClick={() => setSideBar(false)}
      ></div>
    </header>
  );
};

export default HeaderFour;
