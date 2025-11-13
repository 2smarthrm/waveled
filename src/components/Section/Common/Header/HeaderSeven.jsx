"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import BrandLogo from "~/components/Ui/BrandLogo/BrandLogo";


const HeaderSeven = () => {
  const [sideBar, setSideBar] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [subMenuArray, setSubMenuArray] = useState([]);
  const [subMenuTextArray, setSubMenuTextArray] = useState([]);
  const [scrollClassName, setScrollClassName] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollClassName("sticky-menu");
      } else {
        setScrollClassName("");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        if (
          !document
            .getElementById(lastItem)
            .classList.contains("nav-item-has-children")
        ) {
          document.getElementById(lastItem).style.animation =
            "slideRight 0.5s ease forwards";
          document.querySelector(".current-menu-title").innerHTML =
            lastItemText;
          setTimeout(() => {
            document.getElementById(lastItem).classList.remove("active");
          }, 300);
        } else {
          document.querySelector(".go-back").classList.remove("active");
        }
      }
    }
    if (subMenuArray.length === 1) {
      document.querySelector(".mobile-menu-head").classList.remove("active");
    }
  };

  const menuTriggerClickHandler = () => {
    toggleMenu();
  };

  const closeMenuClickHandler = () => {
    toggleMenu();
    const submenuAll = document.querySelectorAll(".sub-menu");
    submenuAll.forEach((submenu) => {
      submenu.classList.remove("active");
      submenu.style.animation = "";
    });

    document.querySelector(".go-back").classList.remove("active");
  };

  const overlayClickHandler = () => {
    toggleMenu();
  };

  const toggleMenu = () => {
    setIsActive(!isActive);
    document.querySelector(".menu-overlay").classList.toggle("active");
  };

  const showSubMenu = (hasChildren) => {
    const submenuAll = document.querySelectorAll(".sub-menu");
    submenuAll.forEach((submenu) => submenu.classList.remove());
    const subMenu = hasChildren.querySelector(".sub-menu");
    setSubMenuArray([...subMenuArray, subMenu.id]);
    subMenu.classList.add("active");
    subMenu.style.animation = "slideLeft 0.5s ease forwards";
    const menuTitle = hasChildren.querySelector(".drop-trigger").textContent;
    setSubMenuTextArray([...subMenuTextArray, menuTitle]);
    document.querySelector(".current-menu-title").innerHTML = menuTitle;
    document.querySelector(".mobile-menu-head").classList.add("active");
  };

  useEffect(() => {
    const handleResize = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth > 991 &&
        isActive
      ) {
        toggleMenu();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive]);
  return (
    <header className={`site-header tekup-header-section ${scrollClassName}`}>
      <div className="bg-light1">
        <div className="container-fuild">
          <div className="tekup-header-bottom border_bottom3">
            <nav className="navbar site-navbar">
              <div className="brand-logo">
                <Link href="/">
                  <BrandLogo logoImage="/images/logo/logo-dark.svg" />
                </Link>
              </div>
              <div className="menu-block-wrapper">
                <div className="menu-overlay"></div>
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
                      onClick={closeMenuClickHandler}
                    >
                      {" "}
                      &times;
                    </div>
                  </div>
                  <ul className="site-menu-main" onClick={menuMainClickHandler}>
                    <li className="nav-item nav-item-has-children">
                      <Link href="#" className="nav-link-item drop-trigger">Demo <i className="ri-arrow-down-s-line"></i></Link>
                      <ul className="sub-menu" id="submenu-1">
                        <li className="sub-menu--item">
                          <Link href="/">
                            <span className="menu-item-text">Home 01</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="home-2">
                            <span className="menu-item-text">home 02</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="home-3">
                            <span className="menu-item-text">home 03</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="home-4">
                            <span className="menu-item-text">home 04</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="home-5">
                            <span className="menu-item-text">home 05</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="home-6">
                            <span className="menu-item-text">home 06</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="home-7">
                            <span className="menu-item-text">home 07</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="home-8">
                            <span className="menu-item-text">home 08</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="home-9">
                            <span className="menu-item-text">home 09</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="home-10">
                            <span className="menu-item-text">home 10</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link href="about-us" className="nav-link-item">About Us</Link>
                    </li>
                    <li className="nav-item nav-item-has-children">
                      <Link href="#" className="nav-link-item drop-trigger">Pages <i className="ri-arrow-down-s-line"></i></Link>
                      <ul className="sub-menu" id="submenu-2">
                        <li className="sub-menu--item">
                          <Link href="about-us">
                            <span className="menu-item-text">About Us</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="pricing">
                            <span className="menu-item-text">Pricing</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item nav-item-has-children">
                          <Link href="#" data-menu-get="h3" className="drop-trigger">blog <i className="ri-arrow-down-s-line"></i></Link>
                          <ul className="sub-menu shape-none" id="submenu-3">
                            <li className="sub-menu--item">
                              <Link href="blog">
                                <span className="menu-item-text">Blog</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="blog-grid">
                                <span className="menu-item-text">Blog grid</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="single-blog">
                                <span className="menu-item-text">blog details</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="sub-menu--item nav-item-has-children">
                          <Link href="#" data-menu-get="h3" className="drop-trigger">Service<i className="ri-arrow-down-s-line"></i>
                          </Link>
                          <ul className="sub-menu shape-none" id="submenu-4">
                            <li className="sub-menu--item">
                              <Link href="service">
                                <span className="menu-item-text">service</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="single-service">
                                <span className="menu-item-text">service details</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="sub-menu--item nav-item-has-children">
                          <Link href="#" data-menu-get="h3" className="drop-trigger">Team<i className="ri-arrow-down-s-line"></i>
                          </Link>
                          <ul className="sub-menu shape-none" id="submenu-5">
                            <li className="sub-menu--item">
                              <Link href="team">
                                <span className="menu-item-text">team</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="single-team">
                                <span className="menu-item-text">team details</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="sub-menu--item nav-item-has-children">
                          <Link href="#" data-menu-get="h3" className="drop-trigger">Portfolio<i className="ri-arrow-down-s-line"></i>
                          </Link>
                          <ul className="sub-menu shape-none" id="submenu-6">
                            <li className="sub-menu--item">
                              <Link href="portfolio-01">
                                <span className="menu-item-text">Portfolio Grid</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="portfolio-02">
                                <span className="menu-item-text">Portfolio masonry</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="single-portfolio">
                                <span className="menu-item-text">Single Portfolio</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="sub-menu--item nav-item-has-children">
                          <Link href="#" data-menu-get="h3" className="drop-trigger">Utility<i className="ri-arrow-down-s-line"></i>
                          </Link>
                          <ul className="sub-menu shape-none" id="submenu-7">
                            <li className="sub-menu--item">
                              <Link href="faq">
                                <span className="menu-item-text">faq</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="errors-404">
                                <span className="menu-item-text">Error 404</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="testimonial">
                                <span className="menu-item-text">testimonial</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="sub-menu--item nav-item-has-children">
                          <Link href="#" data-menu-get="h3" className="drop-trigger">Shop<i className="ri-arrow-down-s-line"></i>
                          </Link>
                          <ul className="sub-menu shape-none" id="submenu-8">
                            <li className="sub-menu--item">
                              <Link href="shop">
                                <span className="menu-item-text">shop</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="single-shop">
                                <span className="menu-item-text">Shop Details</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="my-cart">
                                <span className="menu-item-text">My Cart</span>
                              </Link>
                            </li>
                            <li className="sub-menu--item">
                              <Link href="checkout">
                                <span className="menu-item-text">Checkout</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item nav-item-has-children">
                      <Link href="#" className="nav-link-item drop-trigger">Blog <i className="ri-arrow-down-s-line"></i></Link>
                      <ul className="sub-menu" id="submenu-9">
                        <li className="sub-menu--item">
                          <Link href="blog">
                            <span className="menu-item-text">blog</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="blog-grid">
                            <span className="menu-item-text">Blog grid</span>
                          </Link>
                        </li>
                        <li className="sub-menu--item">
                          <Link href="single-blog">
                            <span className="menu-item-text">blog Details</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link href="contact-us" className="nav-link-item">Contact Us</Link>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="header-btn header-btn-l1 ms-auto ">
                <div className="tekup-header-icon">
                  <Link href="tel:123" className="header-icon-info-box">
                    <div className="tekup-header-info-box-wrap">
                      <div className="tekup-header-info-box-icon">
                        <i className="ri-phone-fill"></i>
                      </div>
                      <div className="tekup-header-info-box-data">
                        <p>Call anytime</p>
                        <h6>518-564-3200</h6>
                      </div>
                    </div>
                  </Link>
                  <div className="tekup-header-barger dark" onClick={() => setSideBar(!sideBar)}>
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
        <div className="tekup-sidemenu-wraper">
          <div className={`tekup-sidemenu-column ${sideBar ? "active" : ""}`}>
            <div className="tekup-sidemenu-body">
              <div className="tekup-sidemenu-logo">
                <Link href=""><img   src="/images/v1/logo.svg" alt="" /></Link>
              </div>
              <p>Vast numbers of employees now work remotely, and it’s too late to develop a set of remote-work policies if you didn’t already have one.</p>
              <div className="tekup-sidemenu-thumb">
                <img   src="/images/hero/hero-bg1.png" alt="" />
              </div>
              <div className="tekup-contact-info-wrap">
                <div className="tekup-contact-info">
                  <i className="ri-map-pin-2-fill"></i>
                  <h5>Address</h5>
                  <p>1791 Yorkshire Circle Kitty<br />
                    Hawk, NC 279499</p>
                </div>
                <div className="tekup-contact-info">
                  <i className="ri-mail-fill"></i>
                  <h5>Contact</h5>
                  <Link href="mailto:name@email.com">info@mthemeus.com</Link>
                  <Link href="tel:123">518-564-3200</Link>
                </div>
              </div>
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
          <div className="offcanvas-overlay"></div>
        </div>
        <div className={`offcanvas-overlay ${sideBar ? "active" : ""}`} onClick={() => setSideBar(false)}></div>
      </div>
    </header>
  );
};

export default HeaderSeven;