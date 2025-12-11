 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ItSolutionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(-1); // se não usares, podes remover

  useEffect(() => {
    // Garante que só corre no browser
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const handleScroll = () => {
      const section = document.getElementById("counter-home-four");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const visible = rect.top <= window.innerHeight && rect.bottom >= 0;
      setIsVisible(visible);
    };

    window.addEventListener("scroll", handleScroll);
    // chamar uma vez para atualizar logo no load
    handleScroll();

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
          {/* IMAGEM PRINCIPAL */}
          <div className="col-lg-6 order-lg-2">
            <div className="tekup-thumb ml-60">
              <img
                className="sport-img"
                src="https://ddw.usa18.mega--cloud.com/uploads/image/65fa8c0fab636.jpg"
                alt="Painel LED instalado em contexto desportivo"
              />
            </div>
          </div>

          {/* TEXTO PRINCIPAL */}
          <div className="col-lg-6 d-flex align-items-center">
            <div className="tekup-default-content mr-60">
              <h2>Especialistas em painéis LED para empresas e desporto</h2>
              <p>
                Somos uma equipa especializada na montagem e fornecimento de
                painéis LED para empresas, espaços desportivos e eventos.
                Garantimos soluções personalizadas, tecnologia de ponta e
                equipamentos de elevada fiabilidade, ajudando a sua marca a
                destacar-se todos os dias — em interiores ou exteriores.
              </p>

              <div className="tekup-extra-mt">
                <Link
                  className="tekup-default-btn"
                  href="/solutions?sl=68ff9b5de52f0a547ad28d86"
                >
                  Saiba mais <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARDS DE PRODUTO / SOLUÇÕES */}
      <section className="section py-2 pb-0 tekup-section-padding">
        <div className="home-top-product">
          {/* 1º CARD – TELAS LED PARA QUIOSQUES */}
          <article className="top-product-card">
            <div className="image">
              <img
                src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20(36).png"
                alt="Telas LED em quiosque digital"
              />
            </div>
            <div className="over-card">
              <h3>Telas LED para quiosques e pontos de informação</h3>
              <p>
                <small>
                  Transforme quiosques, receções e pontos de atendimento com
                  telas LED personalizadas. Ideal para menus digitais, sinalética
                  interativa, campanhas promocionais e informação em tempo real.
                </small>
              </p>
              <Link className="tekup-default-btn" href="/contact-us">
                Solicitar projeto{" "}
                <i className="ri-arrow-right-up-line"></i>
              </Link>
            </div>
          </article>

          {/* 2º CARD – TELAS TRANSPARENTES MODERNAS */}
          <article className="top-product-card">
            <div className="image">
              <img
                src="https://ik.imagekit.io/fsobpyaa5i/uh4ur4uh4.jpg"
                alt="Telas LED transparentes em montra"
              />
            </div>
            <div className="over-card">
              <h3>Telas LED transparentes para empresas modernas</h3>
              <p>
                <small>
                  Dê um aspeto futurista à sua empresa com telas LED
                  transparentes para montras, showrooms e escritórios.
                  Perfeitas para comunicar ofertas, reforçar o branding e criar
                  experiências visuais inovadoras sem bloquear a visibilidade.
                </small>
              </p>
              <Link className="tekup-default-btn" href="/contact-us">
                Solicitar projeto{" "}
                <i className="ri-arrow-right-up-line"></i>
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
