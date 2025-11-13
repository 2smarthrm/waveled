"use client"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import teams from '~/db/teamCardNine.json'
import TeamCardNine from "~/components/Ui/Cards/TeamCardNine";
const TeamSection = () => {
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
                breakpoint: 1499,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    initialSlide: 5
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div className="section bg-light1 tekup-section-padding">
            <div className="container">
                <div className="tekup-section-title center large-width">
                    <h2>Meet the team behind techverse</h2>
                </div>
            </div>
            <Slider {...settings}>

                {teams.map((item, idx) => (
                    <TeamCardNine key={idx} item={item} className="col-lg-6" />
                ))}
            </Slider>
        </div>
    );
};

export default TeamSection;