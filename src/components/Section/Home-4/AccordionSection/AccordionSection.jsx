"use client";
import Link from "next/link";
import { Accordion } from "react-bootstrap";

const AccordionSection = () => {
  return (
    <div className="section bg-light1 tekup-section-padding accordion-one price-accordion">
      <div className="container">
        <div className="row"> 
          <div className="col-lg-6">
            <div className="tekup-default-content mr-60">
              <h2 className="mb-3">
                Aluguer de Painéis LED para Eventos e Projetos
              </h2>

              <p className="mb-3">
                Quer criar impacto visual profissional sem investir em
                equipamento próprio? O <strong>Aluguer de LED</strong> é a opção{" "}
                <strong>mais económica, prática e flexível</strong> para feiras,
                lançamentos, conferências, espetáculos e ativações de marca.
                Tratamos de tudo: consultoria, logística, montagem, operação e
                desmontagem.
              </p>

              <p className="mb-3">
                Trabalhamos com tecnologia de última geração e desenvolvemos
                soluções ajustadas a cada evento. Em ambientes interiores ou
                exteriores, garantimos brilho, contraste e fiabilidade para
                elevar a experiência do público e destacar a sua marca.
              </p>

              <ul className="mb-4">
                <li>Indoor e Outdoor, com brilho e contraste superiores.</li>
                <li>Formatos modulares: 16:9, panorâmico, totem, palco e mais.</li>
                <li>Vários pixel pitch (P2.6, P3.9, P4.8) conforme distância.</li>
                <li>Equipa técnica no local (opcional).</li>
                <li>Planos flexíveis: diária ou evento completo.</li>
              </ul>

              <div className="tekup-extra-mt d-flex gap-3 flex-wrap">
                <Link className="tekup-default-btn" href="/contact-us">
                  Pedir orçamento rápido <i className="ri-arrow-right-up-line"></i>
                </Link>

                <Link className="d-none tekup-default-btn outline" href="/solutions">
                  Ver casos & setups <i className="ri-image-line"></i>
                </Link>
              </div> 
            </div>
          </div>
 
          <div className="col-lg-6">
            <Accordion defaultActiveKey="0">
              <div className="tekup-accordion-column">
                <div className="tekup-accordion-wrap mt-0 init-wrap">
                  <Accordion.Item eventKey="0">
                    <div className="p-0">
                      <img
                        src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20(41).png"
                        alt="Palco com painel LED alugado"
                        style={{ maxHeight: "400px", objectFit: "cover" }}
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
                          Como funciona o aluguer e quais são os principais benefícios?
                        </div>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body>
                      <p className="mb-2">
                        No modelo de aluguer paga apenas pelos{" "}
                        <strong>dias de utilização</strong>, sem necessidade de
                        investir em compra, transporte, armazenamento ou manutenção.
                      </p>

                      <p className="mb-2">
                        A nossa equipa trata de todo o processo: transporte, montagem
                        e desmontagem, podendo também operar os equipamentos durante
                        o evento. Utilizamos módulos LED versáteis, adequados a
                        diferentes <em>formatos</em> e <em>resoluções</em>, tanto{" "}
                        <em>indoor</em> como <em>outdoor</em>.
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
