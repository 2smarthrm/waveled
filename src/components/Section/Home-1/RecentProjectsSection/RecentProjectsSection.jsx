'use client';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import projects from '~/db/recentProjects.json'
import RecentProjectsCard from "~/components/Ui/Cards/RecentProjectsCard";

export default function Home() {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3.7,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        responsive: [

            {
                breakpoint: 1492,
                settings: {
                    slidesToShow: 2.7,
                }
            },
            {
                breakpoint: 1183,
                settings: {
                    slidesToShow: 1.7,
                }
            },
            {
                breakpoint: 1183,
                settings: {
                    slidesToShow: 1.7,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1.5,
                }
            },
            {
                breakpoint: 766,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    };

    return (
        <div className="tekup-portfolio-section tekup-section-padding-top pb-5 ">
            <div className="container">
                <div className="tekup-section-title center light-color">
                    <h2>Explore our recent projects</h2>
                </div>
            </div>
            <div>
                <div className="slider-container">
                    <Slider {...settings} className="">
                        {
                            projects?.map((item, idx) => <RecentProjectsCard key={idx} item={item}></RecentProjectsCard>)
                        }
                    </Slider>
                </div>
            </div>
        </div>
    );
}
