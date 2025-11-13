"use client"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import teams from '~/db/teamCardFive.json'
import TeamCardFive from "~/components/Ui/Cards/TeamCardFive";
const TeamSection = () => {
  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1398,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1197,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 5
        }
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 2,

        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };
  return (
    <div className="section bg-light1 tekup-section-padding">
      <div className="container">
        <div className="tekup-section-title center">
          <h2>Meet the team behind techverse</h2>
        </div>
      </div>
      <Slider {...settings}>
        {
          teams?.map((item, idx) => <TeamCardFive key={idx} item={item}></TeamCardFive>)
        }

      </Slider>
    </div>
  );
};

export default TeamSection;