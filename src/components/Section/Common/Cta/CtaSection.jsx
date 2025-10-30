"use client"

import Link from "next/link";

const CtaSection = () => {
    return (
        <div className="section bg-cover" style={{backgroundImage:"url(/images/v1/cta-bg.png)"}}>
        <div className="container">
          <div className="tekup-cta-wrap">
            <div className="tekup-cta-content center">
              <h2>Precisa de um Projeto ?</h2>
              <p>Temos serviços técnicos de top para todo tipo de projecto, desde montagem, manutenção e organização.</p>
              <div className="tekup-extra-mt">
                <Link className="tekup-default-btn tekup-white-btn" href="contact-us">Solicitar um Orçamento <i className="ri-arrow-right-up-line"></i></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default CtaSection;