
// #f2f3fc -      
"use client"

import Image from "next/image";
import Link from "next/link";

const ChooseUsSection = ({ className }) => {
  return (
    <div className={"main-area"}>
      <div className="container">
        <div className="text-center">
          <br /><br /><br /><br /><br /><br /><br />
          <div className="text-content service-header">
            <span className="service-badge">Serviços</span>
            <h1 className="text-dark rainbow-run rainbow-text">
               Distribuímos Luz  e imagem para  todos os  cantos do Globo 
            </h1>
            <p className="text-secondary">
              Somos uma empresa focada na <strong>distribuição de displays LED </strong> 
              para publicidade, eventos, design, decoração , arquitetura e ambientes imersivos.  
              Combinamos tecnologia, criatividade e experiência para oferecer 
              soluções visuais impactantes e adaptadas a cada necessidade — 
              desde o planeamento à instalação e manutenção.
            </p>
            <Link href={"/contact-us"} className="tekup-default-btn">
              Saiba mais
            </Link>
          </div>
          <br />
        </div>

        <div className="row">
          {/* PLANEAMENTO */}
          <div className="col-xl-4 col-md-6">
            <div className="tekup-iconbox-wrap4">
              <div className="tekup-iconbox-icon4">
                <img src="/images/iconbox/icon8.png" alt="Planeamento" />
              </div>
              <div className="tekup-iconbox-data4">
                <h4>Planeamento</h4>
                <p>
                  Desenvolvemos cada projeto com base em objetivos claros, 
                  estudando o espaço, público e impacto visual para garantir 
                  o melhor resultado técnico e estético.
                </p>
              </div>
            </div>
          </div>

          {/* IMPLEMENTAÇÃO */}
          <div className="col-xl-4 col-md-6">
            <div className="tekup-iconbox-wrap4">
              <div className="tekup-iconbox-icon4">
                <img src="/images/iconbox/icon9.png" alt="Implementação" />
              </div>
              <div className="tekup-iconbox-data4">
                <h4>Implementação</h4>
                <p>
                  Realizamos a instalação completa dos ecrãs LED com precisão, 
                  segurança e cumprimento de prazos, assegurando máxima qualidade 
                  de imagem.
                </p>
              </div>
            </div>
          </div>

          {/* ASSISTÊNCIA TÉCNICA */}
          <div className="col-xl-4 col-md-6">
            <div className="tekup-iconbox-wrap4">
              <div className="tekup-iconbox-icon4">
                <img src="/images/iconbox/icon10.png" alt="Assistência Técnica" />
              </div>
              <div className="tekup-iconbox-data4">
                <h4>Assistência Técnica</h4>
                <p>
                  Prestamos suporte contínuo, manutenção preventiva e corretiva, 
                  garantindo o funcionamento ideal e a longevidade dos sistemas LED.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseUsSection;
