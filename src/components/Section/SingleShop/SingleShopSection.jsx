/* eslint-disable @next/next/no-img-element */
/*
  SingleShopSection.jsx
*/
"use client";

import Link from "next/link";
import { useState } from "react";

const SingleShopSection = () => {
  // ====== IMAGENS DO PRODUTO ======
  const images = [
    "https://klibtech.com/cdn/shop/files/pantalla-led-pitch-456810-fixed-outdoor-klibtech-3_f29d3fa1-9cf1-4931-8b8a-46879d4986d6.jpg?v=1692492873&width=1445",
    "https://klibtech.com/cdn/shop/files/pantalla-led-pitch-456810-fixed-outdoor-klibtech-7_a0c90691-ba23-4911-827e-618e8993a85c.jpg?v=1692492885&width=1445",
    "https://s.alicdn.com/@sc04/kf/H855852c7c660401ab0c49e76ad431b61K.jpg",
    "https://www.yipinglink.com/uploads/155.jpg",
  ];

  // ====== PRODUTOS RELACIONADOS ======
  const related = [
    {
      title: "Display LED 43” P4 – Indoor",
      img: "https://nevonexpress.in/wp-content/uploads/2022/07/43-inch-P4-led-Display.jpg",
      href: "#",
      sku: "WVL-P4-IND-43",
    },
    {
      title: "Vídeo Wall P3 – Indoor",
      img: "https://5.imimg.com/data5/SELLER/Default/2024/11/463895414/DK/FS/MZ/222880805/video-wall-display-standee-p3-indoor-led-500x500.jpg",
      href: "#",
      sku: "WVL-P3-IND-STD",
    },
    {
      title: "P3 LED Wall – Outdoor",
      img: "https://5.imimg.com/data5/SELLER/Default/2025/5/508504000/JE/AO/SN/69913678/p3-led-wall-waterproof-outdoor-led-screen-500x500.jpg",
      href: "#",
      sku: "WVL-P3-OUT-500",
    },
    {
      title: "LED Modular – Indoor 500×500",
      img: "https://5.imimg.com/data5/SELLER/Default/2025/6/517217846/CV/JW/XK/239087133/indoor-led-display-500x500.jpg",
      href: "#",
      sku: "WVL-MOD-IND-500",
    },
  ];

  // ====== ESTADO ======
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  // Substituir “preço” por SKU
  const sku = "WVL-FIXED-OUT-456810";

  return (
    <>
      <div className="section tekup-section-padding-top">
        <div className="container">
          <div className="row">
            {/* GALERIA */}
            <div className="col-lg-6">
              <div className="tekup-tab-slider">
                <div className="tekup-tabs-container">
                  <div className="tekup-tabs-wrapper">
                    <div className="tabContent">
                      <img
                        src={images[activeImage]}
                        alt="Waveled — Solução LED Outdoor"
                        style={{ width: "100%", borderRadius: 12 }}
                      />
                    </div>
                  </div>
                </div>

                <ul className="tekup-tabs-menu" style={{ gap: 12 }}>
                  {images.map((src, idx) => (
                    <li
                      key={src}
                      className={activeImage === idx ? "active" : ""}
                      onMouseEnter={() => setActiveImage(idx)}
                      onClick={() => setActiveImage(idx)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={src}
                        alt={`Waveled — Imagem ${idx + 1}`}
                        style={{
                          width: 110,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                          border:
                            activeImage === idx
                              ? "2px solid var(--bs-primary, #0d6efd)"
                              : "1px solid rgba(0,0,0,.1)",
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DETALHES */}
            <div className="col-lg-6">
              <div className="tekup-details-content">
                <h2>Painel LED Outdoor Fixo — Alta Performance</h2>

                {/* “Preço” substituído por SKU */}
                <h6 style={{ marginTop: 8 }}>
                  <strong>SKU:</strong>{" "}
                  <span className="text-secondary">{sku}</span>
                </h6>

                <p className="mt-3">
                  <strong>Waveled</strong> é uma empresa inovadora especializada
                  em soluções LED de iluminação e display, unindo{" "}
                  <strong>eficiência</strong>, <strong>qualidade</strong> e{" "}
                  <strong>design moderno</strong>. Este painel LED foi concebido
                  para ambientes externos exigentes, oferecendo brilho elevado,
                  excelente contraste e estrutura robusta para operação
                  contínua.
                </p>

                <ul className="mt-3">
                  <li>Brilho alto e legibilidade sob luz solar direta.</li>
                  <li>Módulos frontais e traseiros para manutenção fácil.</li>
                  <li>Gabinetes modulares para composições personalizadas.</li>
                  <li>
                    Índice de proteção adequado a exterior (IP) e longa
                    durabilidade.
                  </li>
                </ul>

                <div className="tekup-product-wrap mt-4">
                  <Link className="tekup-product-btn" href="/contact-us">
                     Comprar Agora
                  </Link>
                </div>

                <div className="tekup-product-info mt-4">
                  <h5>Informação rápida</h5>
                  <ul>
                    <li>
                      <span>Categoria: </span>
                      <Link href="#">Display LED</Link>
                    </li>
                    <li>
                      <span>Tags: </span>
                      <Link href="#">Waveled,</Link>{" "}
                      <Link href="#">Outdoor</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section tekup-section-padding">
        <div className="container">
          <div className="tekup-product-tab">
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "description" ? "active" : ""
                  }`}
                  id="pills-description-tab"
                  onClick={() => setActiveTab("description")}
                >
                  Descrição
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "specification" ? "active" : ""
                  }`}
                  id="pills-specification-tab"
                  onClick={() => setActiveTab("specification")}
                >
                  Especificações
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "downloads" ? "active" : ""
                  }`}
                  id="pills-downloads-tab"
                  onClick={() => setActiveTab("downloads")}
                >
                  Downloads
                </button>
              </li>
            </ul>

            <div className="tab-content" id="pills-tabContent">
              <div
                className={`tab-pane fade ${
                  activeTab === "description" ? "show active" : ""
                }`}
                id="pills-description"
                role="tabpanel"
                aria-labelledby="pills-description-tab"
                tabIndex={0}
              >
                <p className="mt-3">
                  Na <strong>Waveled</strong>, desenvolvemos e integramos
                  soluções LED que elevam a comunicação visual em eventos,
                  fachadas, retail, corporate e smart cities. Os nossos painéis
                  permitem layouts à medida, calibragem de cor precisa e elevada
                  confiabilidade em operação 24/7, com manutenção simplificada.
                </p>
                <p>
                  Suportamos todo o ciclo: consultoria, projeto, instalação,
                  configuração, operação e manutenção. Focamos em eficiência
                  energética, longevidade e qualidade de imagem — para
                  resultados consistentes e impacto real.
                </p>
              </div>

              <div
                className={`tab-pane fade ${
                  activeTab === "specification" ? "show active" : ""
                }`}
                id="pills-specification"
                role="tabpanel"
                aria-labelledby="pills-specification-tab"
                tabIndex={0}
              >
                <div className="row mt-3">
                  <div className="col-md-6">
                    <ul>
                      <li>Pixel pitch: P3–P10 (variante conforme projeto)</li>
                      <li>Brilho típico: ≥ 4.500–6.500 nits (outdoor)</li>
                      <li>Taxa de atualização: ≥ 1.920–3.840 Hz</li>
                      <li>Ângulo de visão amplo (H/V)</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul>
                      <li>IP adequado a exterior (frente e traseira)</li>
                      <li>Gabinete modular (ex.: 500×500 / 500×1000)</li>
                      <li>Manutenção frontal e traseira</li>
                      <li>Consumo otimizado e gestão térmica eficiente</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* DOWNLOADS */}
              <div
                className={`tab-pane fade ${
                  activeTab === "downloads" ? "show active" : ""
                }`}
                id="pills-downloads"
                role="tabpanel"
                aria-labelledby="pills-downloads-tab"
                tabIndex={0}
              >
                <div className="d-flex flex-wrap gap-3 mt-3">
                  <a   className="tekup-default-btn"  href="#"   target="_blank"   rel="noopener noreferrer"   >
                    Download Datasheet
                  </a>
                  <a   className="tekup-default-btn"  href="#"  target="_blank"  rel="noopener noreferrer"  >
                    Manual de Instalação
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUTOS RELACIONADOS */}
      <div className="tekup-related-product-section">
        <div className="container">
          <div className="tekup-section-title center">
            <h2>Produtos relacionados</h2>
          </div>
          <div className="row">
            {related.map((p) => (
              <div key={p.title} className="col-xl-3 col-lg-4 col-md-6">
                <div className="tekup-shop-wrap">
                  <div className="tekup-shop-thumb">
                    <Link href="single-shop">
                      <img
                        style={{ maxHeight: "300px" }}
                        src={p.img}
                        alt={p.title}
                      />
                    </Link>
                    <Link className="tekup-shop-btn" href="my-cart">
                      Saiba Mais
                    </Link>
                    <Link
                      className={p?.sale ? "tekup-shop-badge" : ""}
                      href={p.href}
                    >
                      {p?.sale === true ? "Sale" : ""}
                    </Link>
                  </div>
                  <div className="tekup-shop-data">
                    <Link href={p.href}>
                      <h5>{p.title}</h5>
                    </Link>
                    <h6>
                      SKU: <span className="text-secondary">{p.sku}</span>
                    </h6>
                  </div>
                </div>
              </div>
            ))}  
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleShopSection;
