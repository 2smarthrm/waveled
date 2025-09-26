import Link from "next/link";


const CtaThreeSection = () => {
    return (
        <div className="tekup-cta-section tekup-section-padding" style={{backgroundImage:'url(/images/v4/cta-bg.png)'}}>
    <div className="container">
      <div className="row">
        <div className="col-xl-6 col-lg-8">
          <div className="tekup-cta-content">
            <h2>Vamos trabalhar ! </h2>
            <p>Somos uma empresa inovadora com mais de 13 anos de experiencia , com serviços de excelencia e produtos de qualidade.</p>
          </div>
        </div>
        <div className="col-xl-6 col-lg-4 d-flex align-items-center justify-content-end">
          <div className="tekup-cta-btn">
            <Link className="tekup-default-btn tekup-white-btn" href="/contact-us">Comece o seu Projecto <i className="ri-arrow-right-up-line"></i></Link>
          </div>
        </div>
      </div>
    </div>
  </div>
    );
};

export default CtaThreeSection;