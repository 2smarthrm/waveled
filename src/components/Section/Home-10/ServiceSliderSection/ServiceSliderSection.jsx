"use client"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import services from '~/db/weDealTen.json'
import ServiceCardTen from "~/components/Ui/Cards/ServiceCardTen";
const ServiceSliderSection = () => {
    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1398,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1198,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 574,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };
    return (
        <div className="sectin tekup-section-padding">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>We deal with the aspects of professional IT services</h2>
                </div>
            </div>
            <Slider {...settings} >
                {services?.map((item, idx) => (
                    <ServiceCardTen key={idx} item={item} />
                ))}
            </Slider>
        </div>
    );
};

export default ServiceSliderSection;