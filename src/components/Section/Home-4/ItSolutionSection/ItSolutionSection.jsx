"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Link from "next/link";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

function imageLink(path, width, height, size, extension) {
  return `https://images.react-photo-album.com/hiking/${path}.${width}x${height}.${size}w.${extension}`;
}

const photos = [
  { src: "image01.0822d131.2400x1734.jpg", alt: "Hiking boots" },
  {
    src: "image02.7561b5a4.2400x3600.jpg",
    alt: "Purple petaled flowers near a mountain",
  },
  {
    src: "image03.334d8e07.2400x1600.jpg",
    alt: "A person pointing at a beige map",
  },
  {
    src: "image04.635260bf.2400x1601.jpg",
    alt: "Two hikers walking toward a snow-covered mountain",
  },
  {
    src: "image05.9962a853.2400x3600.jpg",
    alt: "A silver and black coffee mug on a brown wooden table",
  },
  {
    src: "image06.607b0ab6.2400x1349.jpg",
    alt: "A worm's eye view of trees at night",
  },
  {
    src: "image07.7a68edb7.2400x1350.jpg",
    alt: "A pine tree forest near a mountain at sunset",
  },
  {
    src: "image08.2c9f5784.2400x1600.jpg",
    alt: "Silhouette photo of three hikers near tall trees",
  },
  {
    src: "image09.6a8477e9.2400x3443.jpg",
    alt: "A person sitting near a bonfire surrounded by trees",
  },
  {
    src: "image10.5536924a.2400x1600.jpg",
    alt: "Green moss on gray rocks in a river",
  },
  {
    src: "image11.fddf96d5.2400x1543.jpg",
    alt: "Landscape photography of mountains",
  },
  {
    src: "image12.761f839b.2400x3600.jpg",
    alt: "A pathway between green trees during daytime",
  },
].map(({ src, ...rest }) => {
  const matcher = src.match(/^(.*)\.(\d+)x(\d+)\.(.*)$/);

  if (!matcher) return null;

  const path = matcher[1];
  const width = parseInt(matcher[2], 10);
  const height = parseInt(matcher[3], 10);
  const extension = matcher[4];

  return {
    src: imageLink(path, width, height, width, extension),
    width,
    height,
    srcSet: breakpoints.map((breakpoint) => ({
      src: imageLink(path, width, height, breakpoint, extension),
      width: breakpoint,
      height: Math.round((height / width) * breakpoint),
    })),
    ...rest,
  };
});

const ItSolutionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("counter-home-four");
      if (section) {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
        setIsVisible(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className="section py-2 pb-0 tekup-section-padding"
      id="counter-home-four"
    >
      <br />
      <div id="tekup-counter"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 order-lg-2">
            <div className="tekup-thumb ml-60">
              <img
                className="sport-img"
                src="https://ddw.usa18.mega--cloud.com/uploads/image/65fa8c0fab636.jpg"
                alt=""
              />
            </div>
          </div>

          <div className="col-lg-6 d-flex align-items-center">
            <div className="tekup-default-content mr-60">
              <h2>Especialistas em painéis desportivos</h2>
              <p>
                Somos uma equipa profissional dedicada à montagem e venda de
                painéis LED para empresas. Garantimos soluções personalizadas,
                tecnologia de ponta e produtos de elevada durabilidade, ajudando
                a sua marca a destacar-se dia e noite.
              </p>

              <div className="tekup-extra-mt">
                <Link className="tekup-default-btn" href="/solutions?sl=68ff9b5de52f0a547ad28d86">
                  Saiba Mais <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="section  py-2 pb-0 tekup-section-padding">
        <div className="home-top-product">
          <article className="top-product-card">
            <div className="image">
              <img  src="https://www.bizzabo.com/wp-content/uploads/2018/11/3686-1024x683.jpg"   alt="#"
              />
            </div>
            <div className="over-card">
              <h3>De destaque a sua apresentação com telas modernas</h3>
              <p>
                <small>
                 Destaque a sua marca e organize o seu espaço com  painéis personalizados para eventos.
                </small>
              </p>
              <Link className="tekup-default-btn" href="/contact-us">
                Solicitar projeto <i className="ri-arrow-right-up-line"></i>
              </Link>
            </div>
          </article>
          <article className="top-product-card">
            <div className="image">
              <img
                src="https://rigardled.com/wp-content/uploads/2024/09/beijing-auto-shows-grand-return-1030x643.png"
                alt="#"
              />
            </div>
            <div className="over-card">
              <h3>Paineis para eventos corporativos e feiras de négocio</h3>
              <p>
                <small>
                  Melhore a sua organização com os nossos calendários para
                  empresas. nossos calendários.
                </small>
              </p>
              <Link className="tekup-default-btn" href="/contact-us">
                Solicitar projeto <i className="ri-arrow-right-up-line"></i>
              </Link>
            </div>
          </article>
        </div>
      </section> 
      <br />
      <br />
    </div>
  );
};

export default ItSolutionSection;
