"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Slider from "react-slick";


const TestimonialSection = () => {
  const blurRef = useRef(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows:false,
    slidesToShow: 3.6,
    slidesToScroll: 3.6,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3, 
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".blur-slide-screen");
      const blurElement = blurRef.current;
      if (!section || !blurElement) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY;

      const progress = Math.min(
        Math.max((scrollY - sectionTop) / sectionHeight, 0),
        1
      );

      const blurValue = progress * 25;

      blurElement.style.backdropFilter = `blur(${blurValue}px) brightness(71.42%)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="section dark-bg blur-slide-screen"
      style={{ position: "relative" }}
    >
      <div className="image-wall">
        <img
          src="https://ik.imagekit.io/fsobpyaa5i/happy-diverse-friends-celebrating-with-sparklers-o-2025-02-13-00-11-44-utc.jpg"
          alt="waveled"
        />
      </div>

      <section className="over-product-blur" ref={blurRef}>
        <div className="products-slide">
          <Slider {...settings}>
            {[
              "https://visualled.com/wp-content/uploads/2025/06/caracteristicas-pantallas-led-para-exteriores-outdoor.webp",
              "https://www.p1led.com.br/wp-content/uploads/2020/06/led.png",
              "https://media.visualled.com/images/pantalla-led-2880-1920-111024.webp",
              "https://media.visualled.com/images/pantalla-led-960-960-111024.webp",
            ].map((item, index) => (
              <article key={index}>
                <div className="image-area">
                  <img src={item} alt="" />
                </div>
                <div className="text">
                  <Link href={"#"}>
                    <h4>Integrated & Creative Indoor LED Display</h4>
                  </Link>
                  <p>
                    Three cabinet sizes, both for indoor (800-1000nits) and
                    semi-outdoor (3500nits)
                  </p>
                </div>
              </article>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default TestimonialSection;
