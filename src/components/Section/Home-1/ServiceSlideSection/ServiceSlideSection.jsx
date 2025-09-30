'use client'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import deal from '~/db/weDeal.json'
import WeDeal from "~/components/Ui/Cards/WeDeal";

const ServiceSlideSection = () => {
    var settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
        responsive: [

            {
                breakpoint: 1199,
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
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                }
            },

        ]
    };

    return (
        <div className="sectin bg-light1 tekup-section-padding ">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>#We deal with the aspects of professional IT services</h2>
                </div>
                <div className="slider-container">
                    <Slider {...settings} className="">
                        {
                            deal?.map((item, idx) => <WeDeal key={idx} item={item}></WeDeal>)
                        }
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default ServiceSlideSection;