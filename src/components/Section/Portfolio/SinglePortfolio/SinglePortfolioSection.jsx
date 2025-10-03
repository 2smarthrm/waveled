import Link from "next/link";

const SinglePortfolioSection = () => {
  return (
    <div className="section tekup-section-padding">
      <div className="container">
        <div className="tekup-pd-thumb">
          <img
            src="https://d2pi0n2fm836iz.cloudfront.net/328379/0704202322044464a4977ccc32e.png"
            alt="Outdoor LED instalado pela Waveled para Exportech Portugal"
          />
        </div>
        <div className="tekup-pd-wrap">
          <div className="row">
            <div className="col-lg-8">
              <div className="tekup-pd-content-wrap">
                <div className="tekup-pd-content-item">
                  <h3>Visão geral do projeto</h3>
                  <p>
                    A Waveled desenvolveu e instalou para a <b>Exportech Portugal </b> 
                    um outdoor LED de última geração, projetado para exibir anúncios 
                    publicitários de forma dinâmica e com elevada luminosidade.
                  </p>
                  <p>
                    O sistema foi pensado para garantir máxima visibilidade em 
                    ambientes externos, mesmo sob luz solar direta, oferecendo 
                    fiabilidade, baixo consumo energético e gestão de conteúdos 
                    remota através de um software CMS dedicado.
                  </p>
                </div>

                <div className="tekup-pd-content-item">
                  <h3>O desafio</h3>
                  <p>
                    A Exportech Portugal precisava de uma solução de comunicação 
                    impactante para o exterior das suas instalações. O principal 
                    desafio era assegurar visibilidade em todas as condições 
                    climáticas e permitir uma gestão rápida e flexível das campanhas 
                    de anúncios.
                  </p>
                </div>

                <div className="tekup-pd-content-item">
                  <div className="row">
                    <div className="col-lg-6">
                      <img
                        src="https://5.imimg.com/data5/SELLER/Default/2025/3/494824247/AC/XO/LN/225706220/outdoor-flexible-led-screen.jpg"
                        alt="Outdoor LED flexível instalado pela Waveled"
                      />
                    </div>
                    <div className="col-lg-6">
                      <img
                        src="https://5.imimg.com/data5/SELLER/Default/2024/6/424784138/AL/CG/EX/143500992/outdoor-led-display-video-wall.jpeg"
                        alt="Estrutura de outdoor LED para anúncios"
                      />
                    </div>
                  </div>
                </div>

                <div className="tekup-pd-content-item">
                  <p>
                    O outdoor LED foi configurado com painéis de alta resolução, 
                    resistentes a intempéries, e integra tecnologia de controlo 
                    remoto para facilitar a programação e alteração de campanhas 
                    em tempo real.
                  </p>
                </div>

                <div className="tekup-icon-list">
                  <ul>
                    <li>
                      <i className="ri-check-line"></i> Estrutura resistente a 
                      condições climáticas
                    </li>
                    <li>
                      <i className="ri-check-line"></i> Brilho ajustável para dia 
                      e noite
                    </li>
                    <li>
                      <i className="ri-check-line"></i> Gestão remota de anúncios 
                      e conteúdos
                    </li>
                    <li>
                      <i className="ri-check-line"></i> Eficiência energética 
                      otimizada
                    </li>
                    <li>
                      <i className="ri-check-line"></i> Suporte e manutenção 
                      técnica contínua
                    </li>
                  </ul>
                </div>

                <div className="tekup-pd-content-item">
                  <h3>Resultados finais</h3>
                  <p>
                    A instalação trouxe maior visibilidade à marca Exportech 
                    Portugal, permitindo uma comunicação clara e moderna com o 
                    público. O outdoor LED passou a ser uma ferramenta de destaque 
                    na divulgação de campanhas, fortalecendo a imagem da empresa 
                    e atraindo novos clientes.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="tekup-pd-sidebar">
                <div className="tekup-pd-sidebar-item">
                  <h5>Detalhes do Projeto</h5>
                  <span>Cliente:</span>
                  <p>Exportech Portugal</p>
                </div>
                <div className="tekup-pd-sidebar-item">
                  <span>Categoria:</span>
                  <p>Outdoor LED / Publicidade</p>
                </div> 
                <div className="tekup-pd-sidebar-item">
                  <span>Redes sociais :</span>
                  <Link href="#" target="_blank">
                    www.facebook..com/@waveled
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePortfolioSection;
