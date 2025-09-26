import Link from "next/link";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import FooterFour from '~/components/Section/Common/FooterFour';


const NotFound = () => {
    return (
    <>
      <HeaderTwo className="tekup-header-top bg-light1 "/>
        <div className="tekup-errors-section">
        <div className="container">
          <div className="tekup-errors-content">
            <img src="/images/breadcrumb/errors404.png" alt=""/>
            <h2>Oops, this page is not found</h2>
            <p>The page you’re looking for can’t be found. Double-check the URL and try again. we invite you to visit our homepage.</p>
            <div className="tekup-extra-mt">
              <Link className="tekup-default-btn left" href="/">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
            </div>
          </div>
        </div>
      </div>
      <FooterFour/>
    </>
    );
};

export default NotFound;