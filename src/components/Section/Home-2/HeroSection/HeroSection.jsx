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
    <div className="tekup-hero-section2">
      <Slider {...settings} className="tekup-hero-slider slick-slider-btn">
        <div className="tekup-hero-slider-item tekup-hero-slider-item-one">
          <div className="container">
            <div className="tekup-hero-content center white-color large-content">
              <div className={`${currentSlide === 0 ? "animated fadeInRight" : ""}`} data-animation-in="fadeInRight" data-delay-in="1.5" >
                <h1>The best innovative technology solutions</h1>
                <p>We are architects of innovation, trailblazers of technological advancement</p>
              </div>
              <div className={`tekup-extra-mt ${currentSlide === 0 ? "animated fadeInUp" : ""}`} data-animation-in="fadeInUp" data-delay-in="0.7">
                <Link className="tekup-default-btn tekup-white-btn" href="contact-us">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="tekup-hero-slider-item tekup-hero-slider-item-two">
          <div className="container">
            <div className="tekup-hero-content center white-color large-content">
              <div className={`${currentSlide === 1 ? "animated fadeInRight" : ""}`} data-animation-in="fadeInRight" data-delay-in="1.5">
                <h1>The best innovative technology solutions</h1>
                <p>We are architects of innovation, trailblazers of technological advancement</p>
              </div>
              <div className={`tekup-extra-mt ${currentSlide === 1 ? "animated fadeInUp" : ""}`} data-animation-in="fadeInUp" data-delay-in="0.7">
                <Link className="tekup-default-btn tekup-white-btn" href="contact-us">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
              </div>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default HeroSection;
