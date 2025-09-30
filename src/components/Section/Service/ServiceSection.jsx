"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Slider from "react-slick";

export default function ServiceSection() {
  const videoRefs = useRef([]);

    const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: 3.6,
    slidesToScroll: 3.6,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.6,
          slidesToScroll: 3.6,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const isVisible = (el) => el?.dataset?.visible === "true";

    // IntersectionObserver: controla play/pause e marca visibilidade
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          video.dataset.visible = entry.isIntersecting ? "true" : "false";
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 } // ~1/3 no viewport já conta como visível
    );

    // ended -> rebobina e toca outra vez se continuar visível
    const handleEnded = (e) => {
      const v = e.currentTarget;
      if (isVisible(v)) {
        try {
          v.currentTime = 0;
        } catch {}
        v.play().catch(() => {});
      }
    };

    // Se a aba ficar oculta, pausa; quando voltar, retoma se estiver visível
    const handleVisibilityChange = () => {
      videoRefs.current.forEach((v) => {
        if (!v) return;
        if (document.hidden) {
          v.pause();
        } else if (isVisible(v)) {
          v.play().catch(() => {});
        }
      });
    };

    // ligar observador e eventos
    videoRefs.current.forEach((v) => {
      if (!v) return;
      v.dataset.visible = "false";
      observer.observe(v);
      v.addEventListener("ended", handleEnded);
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // cleanup
    return () => {
      videoRefs.current.forEach((v) => {
        if (!v) return;
        observer.unobserve(v);
        v.removeEventListener("ended", handleEnded);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const Sections = [
    {
      video:
        "https://video-previews.elements.envatousercontent.com/h264-video-previews/ff4944d8-11bb-411c-a722-761d19ec76d0/57389351.mp4",
      title: "Aluguer de Ecrãs LED para Eventos e Feiras",
      reverse: false,
      description:
        "Soluções de aluguer chave-na-mão para feiras, congressos, festivais e ativações de marca. Tratamos de transporte, montagem, calibração fina e operação no local, garantindo alta resolução, brilho consistente e cronogramas cumpridos. Equipas especializadas e equipamentos modernos para criar impacto visual imediato — sem dores de cabeça.",
      image: "https://cdnus.globalso.com/rtledsolution/main28.jpg",
      over_text: { text_1: "Eventos memoráveis", text_2: "Aluguer • Montagem • Operação" },
    },
    {
      video:
        "https://video-previews.elements.envatousercontent.com/h264-video-previews/dfb54a0f-40b7-4d07-a2c7-01951cc5996d/59570406.mp4",
      title: "Venda e Instalação — Displays Indoor & Outdoor",
      reverse: true,
      description:
        "Projetamos e instalamos displays LED para lojas, showrooms, auditórios, centros comerciais e fachadas. Soluções indoor de alta definição e painéis outdoor com proteção climática, gestão de conteúdos simples e eficiência energética. Integramos com a identidade da marca e garantimos manutenção para um investimento duradouro.",
      image:
        "https://www.onedisplaygroup.com/wp-content/uploads/2020/09/o-clear-P3.47-indoor-high-transparent-led-display.png",
      over_text: { text_1: "Impacto visual sem limites", text_2: "Indoor • Outdoor • Transparente" },
    },
    {
      video:
        "https://video-previews.elements.envatousercontent.com/h264-video-previews/b4975842-e96a-4eed-bc1d-ba1efb9b4fd2/11066805.mp4",
      title: "Consultoria de Projeto & Suporte Técnico",
      reverse: false,
      description:
        "Aconselhamento desde a ideia até à operação diária: dimensionamento de painéis, pitch ideal, estrutura e eletrificação, workflow de conteúdos e SLA de manutenção. Fazemos auditorias, manutenção preventiva/corretiva e formação de equipas. O objetivo: fiabilidade, segurança e máximo retorno do investimento.",
      image:
        "https://www.hyte-led.com/wp-content/uploads/2023/11/holographicled-display-2.jpg",
      over_text: { text_1: "Tecnologia LED que impulsiona o seu sucesso", text_2: "Consultoria • Integração • Manutenção" },
    },
  ];


     
    const ProductsCarousel = {
      PageTitle: "Waveled o seu local favorito para comprar o display",
      products: [
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://image.made-in-china.com/318f0j00wTKfPerCAloM/mzcled-02-mp4.webp",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://www.macropix.com/wp-content/uploads/Signum-QS-2-42.png",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://www.leyardeurope.eu/files/my_files/pic/products/LED%20Video%20Walls/Luminate%20Pro%20Series/Gen%202/Luminate%20Pro%20Gen%202%20Product.png",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://www.pantallasledlemon.com/wp-content/uploads/2020/10/pantalla-led-lemon-die-cast-outdoor-3-ok.jpg",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://ecdn6.globalso.com/upload/p/1633/image_product/2024-04/662b28fd38e9e52328.png",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://ptcled.usa18.wondercdn.com/uploads/image/67b41efa349e3.png",
        },
      ],
    }

  return (
    <>
      {Sections.map((item, index) => (
        <div key={index}>
          <div className="section bg-light1 tekup-section-padding2">
            <div className="container">
              <div className={`content-area ${item.reverse ? "reverse" : ""}`}>
                <div className="tekup-section-title">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <Link href="/contact-us" className="tekup-default-btn">Saiba mais</Link>
                </div>
                <div className="image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          <section className="video-area">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.video} 
              loop
              muted
              playsInline
              preload="none"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div className="over-video-large">
              <div className="tekup-section-padding">
                <div className="container">
                  <h2>{item.over_text.text_1}</h2>
                  <h2>{item.over_text.text_2}</h2>
                  <br />
                  <Link href="/contact-us">
                    <button className="tekup-default-btn">Solicitar Orçamento</button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      ))}
        <aside> 
        <div className="products-carousel  mb-0">
          <div className="carousel-featured-products">
            <div className="container">
              <h2>{ProductsCarousel.PageTitle}</h2>
              <br />
              <Slider {...settings}>
                {ProductsCarousel?.products.map((item, index) => (
                  <article key={index}>
                    <div className="card-content">
                      <strong className="sku">SKU-{item.sku}</strong>
                      <h5>{item.title}</h5>
                      <p>{item.description}</p>
                      <div className="image">
                        <Link href={"#"}>
                           <img src={item.image} alt={item.title} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
