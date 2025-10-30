import Link from "next/link";
import FooterFour from '~/components/Section/Common/FooterFour';
import HeaderFour from '~/components/Section/Common/Header/HeaderFour';


const NotFound = () => {
  return (
    <>
      <HeaderFour />
      <div className="tekup-errors-section">
        <div className="container">
          <div className="tekup-errors-content">
            <img src="/images/breadcrumb/errors404.png" alt="Página não encontrada" />
            <h2>Ups! Página não encontrada !</h2>
            <p>
              A página que procura não existe ou já não está disponível.
              Verifique o endereço digitado ou utilize o botão abaixo para regressar ao início.
            </p>
            <div className="tekup-extra-mt">
              <Link className="tekup-default-btn left" href="/">
                 Voltar à página inicial <i className="ri-arrow-right-up-line"></i>
              </Link>
            </div>
          </div>

        </div>
      </div>
      <FooterFour />
    </>
  );
};

 

export default NotFound;