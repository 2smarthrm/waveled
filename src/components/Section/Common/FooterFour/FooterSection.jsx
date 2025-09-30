/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import BrandLogo from "~/components/Ui/BrandLogo/BrandLogo";

export default function FooterFore() {
  return (
    <>
      <footer className="tekup-footer-section dark-bg">
        <div className="container">
          <div className="tekup-footer-top tekup-section-padding">
            <div className="row">
              <div className="col-xl-3 col-lg-12">
                <div className="tekup-footer-textarea light-color">
                  <Link href="/">
                    <h3 className="text-light">EXPORTECH</h3>
                  </Link>
                  <p>
                    Waveled é uma empresa inovadora especializada em soluções
                    LED de iluminação e display, unindo eficiência, qualidade e
                    design moderno.
                  </p>
                  <div className="tekup-social-icon-box style-two">
                    <ul>
                      <li>
                        <Link href="#">
                          <i className="ri-facebook-fill" />
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <i className="ri-linkedin-fill" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 offset-xl-1 col-md-3">
                <div className="tekup-footer-menu light-color">
                  <div className="tekup-footer-title light-color">
                    <h5>Empresa</h5>
                  </div>
                  <ul>
                    <li>
                      <Link href="about-us">Sobre Nós</Link>
                    </li>
                    <li>
                      <Link href="#">Casos de estudo</Link>
                    </li>
                    <li>
                      <Link href="/service">Serviços</Link>
                    </li>
                    <li>
                      <Link href="contact-us">Contatos</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="tekup-footer-menu light-color extar-margin">
                  <div className="tekup-footer-title light-color">
                    <h5>Produtos</h5>
                  </div>
                  <ul>
                    <li>
                      <Link href="/shop?category=indoor">Indoor</Link>
                    </li>
                    <li>
                      <Link href="/shop?category=outdoor">Outdoor</Link>
                    </li>
                    <li>
                      <Link href="/shop?category=rent">Aluguer</Link>
                    </li>
                    <li>
                      <Link href="/shop?category=mini_and_micro">Mini & Micro</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="tekup-footer-menu light-color extar-margin">
                  <div className="tekup-footer-title light-color">
                    <h5>Contactos</h5>
                  </div>
                  <ul>
                    <li>
                      <div className="icon"> </div>
                      <span className="text-light text-white">
                        Rua Fernando Farinha nº 2A e 2B Braço de Prata <br />
                        1950-448 Lisboa
                      </span>
                    </li>
                    <li>
                      <div className="icon"> </div>
                        <span className="text-light text-white">
                          Email : geral@waveled.pt
                        </span> 
                    </li>
                     <li>
                      <div className="icon"> </div>
                        <span className="text-light text-white">
                          Tel : +351 210 353 555  
                        </span>
                        <br />
                        <span style={{marginLeft:"40px"}} className="text-light">  +351 212 456 082</span><br />
                        <small  style={{fontSize:"14px"}} className="text-primary">Chamada para a Rede Fixa Nacional</small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="tekup-footer-bottom">
            <div className="row">
              <div className="col-md-6">
                <div className="tekup-copywright light-color right">
                  <p> © {new Date().getFullYear()} waveled. All rights reserved.</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="tekup-footer-menu light-color style-two right mb-0">
                  <ul>
                    <li>
                      <Link href="#">Políticas de Privacidade</Link>
                    </li>
                    <li>
                      <Link href="#">Termos &amp; Condições</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
