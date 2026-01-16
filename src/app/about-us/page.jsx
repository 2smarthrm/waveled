import CtaSection from "~/components/Section/Common/Cta/CtaSection";
import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import { MdOutlineSell } from "react-icons/md";
import { TbCashRegister } from "react-icons/tb";
import { RiParentLine } from "react-icons/ri";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export const metadata = {
  title: "Sobre nós",
};

const Aboutpage = () => {
  return (
    <div className="about-page-area">
      <HeaderFour className="tekup-header-top bg-light1" />
      <br />
      <br />
      <br />

      {/* 1 - hero */}
      <section className="about-hero">
        <div className="about-over">
          <div className="content">
            <div className="container">
              <br />
              <br />
              <div className="text-center">
                <div>
                  <strong className="service-badge">Sobre nós</strong>
                </div>
                <h4 className="rainbow-text">
                  Precisa de especialistas ? <br />
                  Já encontrou.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 - descrição */}
      <section className="about-description">
        <div className="container">
          <div className="text-area">
            <div className="block block-1">
              <h5>Começamos com uma venda e vivemos como uma referência.</h5>
            </div>
            <div className="block block-2">
              <p>
                Somos especialistas na <strong>venda</strong>, <strong>montagem</strong> e
                <strong> aluguer</strong> de ecrãs LED para eventos, publicidade, empresas e
                projetos especiais.
                <br />
                <br />
                Oferecemos soluções modernas, de alta qualidade e adaptadas a cada cliente.
              </p>
            </div>
          </div>

          <div className="some-services">
            {[
              { title: "Vendas de ecrãs LED", description: "", icon: <MdOutlineSell /> },
              { title: "Aluguer de ecrãs", description: "", icon: <RiParentLine /> },
              { title: "Implementação & Orçamento", description: "", icon: <TbCashRegister /> },
            ].map((item, index) => (
              <article key={index} className="service-item">
                <div className="icon">
                  <div className="svg">{item.icon}</div>
                </div>
                <br />
                <small>{item.description}</small>
                <h6>{item.title}</h6>
              </article>
            ))}
          </div>
        </div>
      </section>

      <br />
      <br />

      {/* 3 - Detalhes + Visão no meio */}
      <section className="about-info">
        <div className="container">
          {/* Block 1 - Missão */}
          <div className="block-data">
            <div className="text">
              <h2>A nossa missão</h2>
              <p>
                A nossa missão é criar soluções LED que fazem a diferença na forma como marcas,
                empresas e eventos comunicam. Acreditamos no impacto visual como uma ferramenta
                forte para captar atenção, valorizar espaços e reforçar a presença das marcas.
              </p>
              <p>
                Cada projeto é pensado à medida — com foco no objetivo, no local e na mensagem a
                transmitir. Trabalhamos com exigência na qualidade e na consistência, para que o
                resultado final seja sólido, profissional e fácil de utilizar.
              </p>
              <p>
                Mais do que vender tecnologia, queremos entregar confiança e resultados que se
                notam.
              </p>
            </div>
            <div className="image">
              <img
                src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20(3).jpg"
                alt="Missão Waveled"
              />
            </div>
          </div>
       </div>
          <br />
          <br />

          {/* Área do meio - Visão / área de negócio */}
          <div className="about-info-section">
             <div className="container">
               <div className="section-title mb-40">
              <span className="subtitle mt-10 mb-15">A nossa visão</span>
              <h2 className="sec-title">
                Soluções LED que transformam ideias em experiências visuais
              </h2>
            </div>

            <p className="summary-text">
              A Waveled atua na área das soluções LED para eventos, publicidade e espaços
              corporativos, ajudando marcas e empresas a comunicar com mais impacto e presença.
              Criamos experiências visuais que tornam qualquer espaço mais apelativo e qualquer
              mensagem mais memorável.
            </p>

            <p className="summary-text">
              Apostamos em soluções práticas e bem implementadas — desde projetos temporários até
              instalações permanentes — sempre com acompanhamento próximo e foco no que realmente
              interessa: o resultado final e a satisfação do cliente.
            </p>

            <ul className="list-style-one my-30">
              <li><FiCheckCircle />Venda e aluguer de ecrãs LED</li>
              <li><FiCheckCircle />Soluções LED para eventos e ativações de marca</li>
              <li><FiCheckCircle />Instalações para empresas e espaços comerciais</li>
              <li><FiCheckCircle />Acompanhamento e assistência em Portugal</li>
            </ul>

            <Link
              href="/contact-us"
              className="tekup-default-btn mt-4"
              data-hover="Contactar"
            >
              <span>Contactar</span>
            </Link> 
             </div>
          </div>

          <br />
          <br />
          {/* Block 2 - Assistência */}
       <div className="container"> 
          <div className="block-data rev">
            <div className="text">
              <h2>Assistência e serviços</h2>
              <p>
                Prestamos apoio completo em Portugal, acompanhando cada cliente em todas as fases
                do projeto. Estamos presentes desde o primeiro contacto, passando pela
                instalação, até à utilização final da solução — com um processo simples e bem
                orientado.
              </p>
              <p>
                A nossa equipa garante resposta rápida, comunicação clara e acompanhamento próximo,
                para que tudo funcione sem stress e com total confiança. Quando é preciso ajustar,
                otimizar ou esclarecer, estamos disponíveis.
              </p>
              <p>
                O objetivo é que o cliente se foque no evento ou no negócio — e nós tratamos do
                resto.
              </p>
            </div>
            <div className="image">
              <img
                src="https://ik.imagekit.io/fsobpyaa5i/image-gen.png"
                alt="Assistência Waveled"
              />
            </div>
          </div>
          
      <br />
      <br />
      <br />
      <br />
        </div>
      </section> 
      <CtaSection />
      <FooterFour noHello className="tekup-footer-section dark-bg" />
    </div>
  );
};

export default Aboutpage;
