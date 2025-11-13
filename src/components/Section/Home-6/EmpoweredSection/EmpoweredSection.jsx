'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const EmpoweredSection = () => {
    const settings = {
        arrows:false,
        dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear"
    };
    return (
        <div className="section">
            <div className="container">
                <div className="tekup-brand-logo-column">
                    <div className="tekup-section-title center">
                        <p>Empowered professionals to connect with top-tier opportunities</p>
                    </div>
                    <Slider {...settings} className="tekup-brand-slider">
                        <div className="tekup-brand-slider-item">
                            <img src="/images/v3/b_1.png" alt="" />
                        </div>
                        <div className="tekup-brand-slider-item">
                            <img src="/images/v3/b_2.png" alt="" />
                        </div>
                        <div className="tekup-brand-slider-item">
                            <img src="/images/v3/b_3.png" alt="" />
                        </div>
                        <div className="tekup-brand-slider-item">
                            <img src="/images/v3/b_4.png" alt="" />
                        </div>
                        <div className="tekup-brand-slider-item">
                            <img src="/images/v3/b_5.png" alt="" />
                        </div>
                        <div className="tekup-brand-slider-item">
                            <img src="/images/v3/b_3.png" alt="" />
                        </div>
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default EmpoweredSection;