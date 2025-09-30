"use client"

import Image from "next/image";
import Link from "next/link";

const ChooseUsSection = ({className}) => {
return (
  <div className={className}>
    <div className="container">
      <div className="text-center">
        <br />
        <div className="text-content">
          <h1 className="text-white rainbow-run">
            Distribuímos Luz e Imagem para todos os cantos do Globo
          </h1>
          <p className="text-secondary">
            Somos especialistas na venda, montagem e aluguer de ecrãs LED para
            eventos, publicidade, empresas e projetos especiais. Criamos
            soluções modernas, personalizadas e de alta qualidade, adaptadas às
            necessidades de cada cliente.
          </p>
          <Link href={"/contact-us"} className="tekup-default-btn" >Saiba mais</Link>
        </div>
        <br />
      </div>
      <div className="row">
        <div className="col-xl-4 col-md-6">
          <div className="tekup-iconbox-wrap4">
            <div className="tekup-iconbox-icon4">
              <img src="/images/iconbox/icon8.png" alt="Equipa de Especialistas" />
            </div>
            <div className="tekup-iconbox-data4">
              <h4>Equipa Especializada</h4>
              <p>
                Contamos com profissionais qualificados e experientes, prontos
                para apoiar desde a conceção até à instalação.
              </p> 
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6">
          <div className="tekup-iconbox-wrap4">
            <div className="tekup-iconbox-icon4">
              <img src="/images/iconbox/icon9.png" alt="Atendimento Rápido" />
            </div>
            <div className="tekup-iconbox-data4">
              <h4>Atendimento Rápido</h4>
              <p>
                Garantimos um serviço próximo e eficiente, respondendo de forma
                ágil às necessidades de cada cliente e evento.
              </p> 
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-md-6">
          <div className="tekup-iconbox-wrap4">
            <div className="tekup-iconbox-icon4">
              <img src="/images/iconbox/icon10.png" alt="Planos Competitivos" />
            </div>
            <div className="tekup-iconbox-data4">
              <h4>Planos Acessíveis</h4>
              <p>
                Oferecemos soluções competitivas e ajustadas a diferentes
                orçamentos, sem comprometer a qualidade e inovação.
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