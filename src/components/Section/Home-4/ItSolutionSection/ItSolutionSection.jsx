"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Link from "next/link";

const ItSolutionSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("counter-home-four");
      if (section) {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
        setIsVisible(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div  className="section py-2 pb-0 tekup-section-padding"  id="counter-home-four">
      <br />
      <div id="tekup-counter"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 order-lg-2">
            <div className="tekup-thumb ml-60">
              <img
                src="https://dreamwayled.com/wp-content/uploads/2022/12/Stage-LED-Screen-Events.webp"
                alt=""
              />
            </div>
          </div>

          <div className="col-lg-6 d-flex align-items-center">
            <div className="tekup-default-content mr-60">
              <h2>
                Especialistas em painéis publicitários LED de alta qualidade
              </h2>
              <p>
                Somos uma equipa profissional dedicada à montagem e venda de
                painéis LED para empresas. Garantimos soluções personalizadas,
                tecnologia de ponta e produtos de elevada durabilidade, ajudando
                a sua marca a destacar-se dia e noite.
              </p>

              <div className="tekup-extra-mt">
                <Link className="tekup-default-btn" href="about-us">
                  Saiba Mais <i className="ri-arrow-right-up-line"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItSolutionSection;
