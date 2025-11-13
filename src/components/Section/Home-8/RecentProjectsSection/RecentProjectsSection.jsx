
"use client"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import projects from '~/db/recentProjectsEight.json'
import RecentProjectsCardEight from "~/components/Ui/Cards/RecentProjectsCardEight";
const RecentProjectsSection = () => {
    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3.7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1499,
                settings: {
                    slidesToShow: 2.8,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 2.5,
                    slidesToScroll: 1,
                    initialSlide: 5
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1.5,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1.5,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div className="tekup-portfolio-section tekup-section-padding-top">
            <div className="container">
                <div className="tekup-section-title center light-color">
                    <h2>Explore our recent projects</h2>
                </div>
            </div>
            <Slider {...settings} >
                {projects.map((item, idx) => (
                    <RecentProjectsCardEight key={idx} item={item} className="col-lg-6" />
                ))}
            </Slider>
        </div>
    );
};

export default RecentProjectsSection;