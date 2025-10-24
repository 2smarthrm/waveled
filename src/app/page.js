"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

import AccordionSection from "~/components/Section/Home-4/AccordionSection";
import HeroSection from "~/components/Section/Home-4/HeroSection";
import ItSolutionSection from "~/components/Section/Home-4/ItSolutionSection";
import TestimonialSection from "~/components/Section/Home-7/TestimonialSection";
import ServiceSection from "~/components/Section/Home-4/ServiceSection";
import WorkProcess from "~/components/Section/Common/WorkProcess";
import RecentProjectsSection from "~/components/Section/Home-4/RecentProjectsSection";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import FooterFour from "~/components/Section/Common/FooterFour";
import CtaThreeSection from "~/components/Section/Common/CtaThree/CtaThreeSection";

// Import dinâmico: evita avaliar no SSR
const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false });
import "react-multi-carousel/lib/styles.css";

// Helper seguro (não quebra no SSR)
const isMobileUA = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

 

 
const responsive = { 
  ultraDesktop: { breakpoint: { max: 4000, min: 2560 }, items: 6 }, 
  xlDesktop:    { breakpoint: { max: 2560, min: 1920 }, items: 6 }, 
  lgDesktop:    { breakpoint: { max: 1920, min: 1536 }, items: 6 }, 
  desktop:      { breakpoint: { max: 1536, min: 1280 }, items: 6 }, 
  smDesktop:    { breakpoint: { max: 1280, min: 1024 }, items: 4 }, 
  lgTablet:     { breakpoint: { max: 1024, min: 834 },  items: 4 }, 
  tablet:       { breakpoint: { max: 834,  min: 768 },  items: 3 }, 
  phablet:      { breakpoint: { max: 768,  min: 576 },  items: 2 }, 
  mobile:       { breakpoint: { max: 576,  min: 375 },  items: 2 }, 
  miniMobile:   { breakpoint: { max: 375,  min: 0 },    items: 1 },
};




const productsFeatured = [
  { image:"https://hdtvtest.co.uk/static_data/content/JACEVyP324UY2vG8FfjijD-970-80-6427a854-4551-412c-93d5-aadb9a0f21af.jpg", title: "Painel comercial transparente", link: "#" },
  { image:"https://ledexpert.com.br/wp-content/uploads/2025/05/projeto-led-transparente-3.png", title: "Decoração digital", link: "#" },
  { image:"https://www.dshow.com.br/blog/wp-content/uploads/painel_de_led_23.jpeg", title: "Painel led para lojas", link: "#" },
  { image:"https://led10.com.br/wp-content/uploads/2023/04/01-One.jpg", title: "Publicidade Exterior", link: "#" },
  { image:"https://mir-s3-cdn-cf.behance.net/project_modules/1400/41534292646225.5e502845cc366.jpg", title: "Estações de Metro", link: "#" },
  { image:"https://theled.com.br/wp-content/uploads/2023/09/colunas.png", title:"Publicidade para lojas", link:"#"}
];

const HomeFour = ({ deviceType: deviceTypeProp }) => {
  const deviceType = deviceTypeProp || (isMobileUA() ? "mobile" : "desktop");
  const autoPlay = deviceType !== "mobile";

  return (
    <div>
      <HeaderFour />
      <HeroSection />

      <section>
        <div className="section home-featured-items tekup-section-padding2 pt-5 pb-3">
          <div className="container-fluid">
            <div className="tekup-section-title text-center">
              <h3 className="text-dark">Explorar todas as categorias</h3>
            </div>

            <div className="row-featured">
              <Carousel
                swipeable
                draggable
                showDots
                responsive={responsive}
                infinite
                autoPlay={autoPlay}
                autoPlaySpeed={2500}
                pauseOnHover
                keyBoardControl
                customTransition="all .5s ease"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                renderDotsOutside
                aria-label="Carrossel de categorias">
                {productsFeatured.map((item, i) => (
                  <article key={i} className="featured-card">
                    <Link href={item.link} aria-label={item.title}>
                      <div className="image">
                        <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                      </div>
                      <strong>{item.title}</strong>
                    </Link>
                  </article>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </section> 
      <ServiceSection />
      <ItSolutionSection /> 
      <RecentProjectsSection />
      <TestimonialSection />
      <AccordionSection />
      <CtaThreeSection />
      <FooterFour />
    </div>
  );
};

export default HomeFour;
