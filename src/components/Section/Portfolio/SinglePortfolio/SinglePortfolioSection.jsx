// components/SinglePortfolioSection.jsx
"use client";
import Link from "next/link";

export default function SinglePortfolioSection({ item }) {
  const company = item?.data?.wl_company_name || "Cliente";
  const title = item?.data?.wl_title || "Projeto";
  const descHTML = item?.data?.wl_description_html || "";
  const images = Array.isArray(item?.data?.wl_images) ? item?.data?.wl_images : [];
  
  const isBrowser = typeof window !== "undefined";
  const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
  const BASE_API =  protocol === "https"  ?  'https://waveledserver1.vercel.app' : "http://localhost:4000";

  return (
    <div className="section tekup-section-padding">
      <div className="container">
        <div className="tekup-pd-wrap">
          <div className="row">
            <div className="col-lg-8">
              <div className="tekup-pd-content-wrap">
                <div className="tekup-pd-content-item">
                  <h3>Visão geral do projeto</h3> 
                  <p>
                    <b>{title}</b> — desenvolvido para <b>{company}</b>.
                  </p>

                  {/* Se tiveres HTML rico guardado no campo, mostramos aqui */}
                  {descHTML ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: descHTML }}
                    />
                  ) : (
                    <>
                      <p>
                        Projeto implementado com foco em robustez, elevada
                        visibilidade e gestão remota de conteúdos.
                      </p>
                      <p>
                        Inclui componentes adequados a ambientes exteriores e
                        fluxo de trabalho otimizado para a equipa do cliente.
                      </p>
                    </>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="tekup-pd-content-item">
                    <div className="row">
                      {images.slice(0, 2).map((src, i) => (
                        <div className="col" key={i}>
                          <img
                            src={BASE_API+src}
                            alt={`Imagem ${i + 1} do projeto ${title}`}
                            style={{ width: "100%", height: "auto", borderRadius: 4 }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="tekup-pd-content-item">
                  <p>
                    O sistema foi configurado para proporcionar uma operação
                    eficiente e manutenção simples, com potencial para escalar
                    e integrar novos módulos no futuro.
                  </p>
                </div>

                <div className="tekup-icon-list">
                  <ul>
                    <li><i className="ri-check-line"></i> Estrutura robusta</li>
                    <li><i className="ri-check-line"></i> Gestão remota</li>
                    <li><i className="ri-check-line"></i> Eficiência energética</li>
                    <li><i className="ri-check-line"></i> Suporte técnico</li>
                  </ul>
                </div>

                <div className="tekup-pd-content-item">
                  <h3>Resultados</h3>
                  <p>
                    Melhoria na comunicação e na presença da marca{" "}
                    <b>{company}</b>, com maior autonomia na gestão de conteúdos
                    e um ciclo de campanhas mais ágil.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="tekup-pd-sidebar">
                <div className="tekup-pd-sidebar-item">
                  <h5>Detalhes do Projeto</h5>
                  <span>Cliente:</span>
                  <p>{company}</p>
                </div>
                <div className="tekup-pd-sidebar-item">
                  <span>Título:</span>
                  <p>{title}</p>
                </div>
                <div className="tekup-pd-sidebar-item">
                  <span>Redes sociais:</span>
                  <Link href="#" target="_blank">
                    www.facebook.com/@waveled
                  </Link>
                </div>
                {images.length > 2 && (
                  <div className="tekup-pd-sidebar-item">
                    <span>Galeria:</span>
                    <div style={{ display: "grid", gap: 8 }}>
                      {images.slice(2).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Galeria ${i + 1} do projeto ${title}`}
                          style={{ width: "100%", height: "auto", borderRadius: 6 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
