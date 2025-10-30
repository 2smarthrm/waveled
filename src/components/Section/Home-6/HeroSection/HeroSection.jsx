"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import { useState } from "react";

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentSlide(newIndex);
        }
    };
    return (
        <div className="tekup-hero-section6">
            <Slider {...settings} className="tekup-hero-slider slick-slider-btn">
                <div className="tekup-hero-slider-item2 tekup-hero-slider-item-three">
                    <div className="container">
                        <div className="tekup-hero-content center white-color large-content">
                            <div className={`${currentSlide === 0 ? "animated fadeInRight" : ""}`} data-animation-in="fadeInRight" data-delay-in="1.5">
                                <h5>We provide professional IT services</h5>
                                <h1>Optimize your enterprise with our leading guidance</h1>
                            </div>
                            <div className={`tekup-extra-mt ${currentSlide === 0 ? "animated fadeInUp" : ""}`} data-animation-in="fadeInUp" data-delay-in="0.7">
                                <Link className="tekup-default-btn" href="">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tekup-hero-slider-item2 tekup-hero-slider-item-four">
                    <div className="container">
                        <div className="tekup-hero-content center white-color large-content">
                            <div className={`${currentSlide === 1 ? "animated fadeInRight" : ""}`} data-animation-in="fadeInRight" data-delay-in="1.5">
                                <h5>We provide professional IT services</h5>
                                <h1>Optimize your enterprise with our leading guidance</h1>
                            </div>
                            <div className={`tekup-extra-mt ${currentSlide === 1 ? "animated fadeInUp" : ""}`} data-animation-in="fadeInUp" data-delay-in="0.7">
                                <Link className="tekup-default-btn" href="">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

export default HeroSection;