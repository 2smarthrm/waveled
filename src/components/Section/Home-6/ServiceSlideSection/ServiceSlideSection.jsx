"use client"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import deals from '~/db/weDealSix.json'
import ServicesCardSix from "~/components/Ui/Cards/ServicesCardSix";
const WeDealSection = () => {
    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [

            {
                breakpoint: 1397,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 990,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 766,
                settings: {
                    slidesToShow: 1,
                }
            }

        ]
    }
    return (
        <div className="section tekup-section-padding">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>We deal with the aspects of professional IT services</h2>
                </div>
                <Slider  {...settings} >
                    {
                        deals?.map((item, idx) => <ServicesCardSix key={idx} item={item}></ServicesCardSix>)
                    }
                </Slider>
            </div>
        </div>
    );
};

export default WeDealSection;