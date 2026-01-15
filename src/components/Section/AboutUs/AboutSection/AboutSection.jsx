import Image from "next/image";
import Link from "next/link";

const AboutSection = () => {
  return (
    <div className="section tekup-section-padding">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6">
            <div className="tekup-thumb about-img-main">
              <img   
                src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20(15).png"
                alt=""
              />
            </div>
          </div> 
          <div className="col-xl-5 offset-xl-1 col-lg-6 d-flex align-items-center">
            <div className="tekup-default-content">
              <h2>WaveLED — Displays LED para todas as necessidades</h2>
              <p>
                Somos especialistas na <strong>venda</strong>,{" "}
                <strong>montagem</strong> e<strong> Aluguer</strong> de ecrãs
                LED para eventos, publicidade, empresas e projetos especiais.
                Oferecemos soluções modernas, de alta qualidade e adaptadas a
                cada cliente.
              </p>
              <div className="tekup-icon-list">
                <ul>
                  <li>
                    <i className="ri-check-line"></i>Displays Indoor e Outdoor
                  </li>
                  <li>
                    <i className="ri-check-line"></i>Aluguer para eventos e
                    feiras
                  </li>
                  <li>
                    <i className="ri-check-line"></i>Montagem e suporte técnico
                    completo
                  </li>
                </ul>
              </div>
              <div className="tekup-extra-mt">
                <Link className="tekup-default-btn" href="contact-us">
                  Saiba mais <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
