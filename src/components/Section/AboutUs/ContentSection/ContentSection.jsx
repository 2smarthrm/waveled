import Image from "next/image";

const ContentSection = () => {
  const successRate1 = 86;
  const successRate2 = 72;
  const successRate3 = 95;
  return (
    <div className="section bg-light1 tekup-section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 order-lg-2">
            <div className="tekup-thumb ml-30">
              <img  
                src="https://www.sryleddisplay.com/wp-content/uploads/2024/09/led-display-installation_2.webp"
                alt=""
              />
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center">
            <div className="tekup-default-content mr-60">
              <h2>Tecnologia LED que impulsiona o seu sucesso</h2>
              <p>
                Fornecemos <strong>displays LED modernos</strong> para eventos,
                publicidade e empresas, garantindo qualidade, impacto visual e
                soluções adaptadas a cada projeto. Mais do que ecrãs, criamos
                experiências que aproximam marcas e pessoas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
