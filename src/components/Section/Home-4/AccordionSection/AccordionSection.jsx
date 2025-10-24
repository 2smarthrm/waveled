"use client";
import Link from "next/link";
import { Accordion } from "react-bootstrap";

const AccordionSection = () => {
  return (
    <div className="section bg-light1 tekup-section-padding accordion-one price-accordion">
      <div className="container">
        <div className="row">
          {/* BLOCO ESQUERDO — TEXTO PRINCIPAL (HOME) */}
          <div className="col-lg-6">
            <div className="tekup-default-content mr-60">
              <h2 className="mb-3">
                Aluguer de Painéis LED para Eventos e Projetos
              </h2>
              <p className="mb-3">
                Precisa de impacto visual profissional sem comprar equipamento?
                O <strong>Aluguer de LED</strong> é a alternativa{" "}
                <strong>mais económica e flexível</strong> para feiras, lançamentos,
                conferências, shows e ativações de marca. Cuidamos de tudo:
                consultoria, logística, montagem, operação e desmontagem.
              </p>

              <p className="mb-3">
                Trabalhamos com tecnologia de última geração e oferecemos
                soluções sob medida para cada ocasião. Seja em ambientes internos
                ou externos, garantimos brilho, contraste e segurança que elevam
                a experiência do público e destacam a sua marca.
              </p>

              <ul className="mb-4">
                <li>Indoor e Outdoor, alto brilho e contraste.</li>
                <li>Formatos modulares: 16:9, panorâmico, totem, telão de palco.</li>
                <li>Pixel pitch variado (P2.6, P3.9, P4.8) conforme distância.</li>
                <li>Equipe técnica dedicada no local (quando contratado).</li>
                <li>Pacotes flexíveis: diária ou evento completo.</li> 
              </ul>

              <div className="tekup-extra-mt d-flex gap-3 flex-wrap">
                <Link className="tekup-default-btn" href="/contact-us">
                  Pedir orçamento rápido <i className="ri-arrow-right-up-line"></i>
                </Link>
                <Link className="d-none tekup-default-btn outline" href="/solutions">
                  Ver casos & setups <i className="ri-image-line"></i>
                </Link>
              </div>

              <small className="d-block mt-2 text-muted">
                *Também vendemos painéis LED. Ajudamos a comparar{" "}
                <strong>compra vs. Aluguer</strong> para o seu cenário.
              </small>                                                                                                                                                                                                                                 
            </div>
          </div>

          {/* BLOCO DIREITO — ACORDEÃO MAIS CURTO */}
          <div className="col-lg-6">
            <Accordion defaultActiveKey="0">
              <div className="tekup-accordion-column">
                <div className="tekup-accordion-wrap mt-0 init-wrap">
                  <Accordion.Item eventKey="0">
                    <div className="p-0">
                      <img
                        src="https://pt.litestar-led.com/Content/ue/net/upload1/Other/199005/6362769619862592384566379.JPG"
                        alt="Palco com painel LED alugado"
                        className="img-fluid w-100 rounded"
                      />
                    </div>
                    <Accordion.Header>
                      <div className="d-block">
                        <br />
                        <div className="text-uppercase fw-semibold small text-muted">
                          Aluguer de LED · Guia Rápido
                        </div>
                        <br />
                        <div> 
                          Como funciona o Aluguer e quais os principais benefícios?
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className="mb-2">
                        No Aluguer você paga apenas pelos <strong>dias de uso</strong>, sem
                        investir em compra, armazenamento ou manutenção. 
                      </p>

                      <p className="mb-2">
                        Nossa equipa cuida de transporte, montagem e desmontagem, e
                        pode operar os painéis durante o evento. Trabalhamos com
                        módulos modulares, adequados a diferentes <em>formatos</em> e{" "}
                        <em>resoluções</em>, tanto <em>indoor</em> como <em>outdoor</em>.
                      </p> 
                    </Accordion.Body>
                  </Accordion.Item>
                </div>
              </div>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionSection;

 

