"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import axios from "axios";


const TestimonialSection = () => {
  const blurRef = useRef(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows:false,
    slidesToShow: 3.6,
    slidesToScroll: 3.6,
    responsive: [
         {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll:2.1, 
        }
      },
      {
        breakpoint: 1070,
        settings: {
          slidesToShow: 1.4,
          slidesToScroll:1.4, 
        }
      },
      {
        breakpoint: 600, 
        settings: {
          slidesToShow: 1.0,
          slidesToScroll: 1.0,
          initialSlide: 1.1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".blur-slide-screen");
      const blurElement = blurRef.current;
      if (!section || !blurElement) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY; 

      const progress = Math.min(
        Math.max((scrollY - sectionTop) / sectionHeight, 0),
        1
      );

      const blurValue = progress * 25;

      blurElement.style.backdropFilter = `blur(${blurValue}px) brightness(71.42%)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    const [LoadingStatus,SetLoadingStatus] =  useState(null);
    const [LoadingData, SetLoadingData] =  useState([]); 

    const isBrowser = typeof window !== "undefined";
    const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
    const BaseUrl = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";
  
     async function LoadData(){
        try {
          const response = await axios.get(BaseUrl+"/api/featured", {withCredentials: true });
          const data = response?.data?.data ? response?.data?.data : [];
          SetLoadingData(data);  
          console.clear();
          console.log(response); 
        } catch (error){
           console.clear();
           console.log(error);
        } finally { 
  
        }
        SetLoadingStatus(true);
      }
  
      useEffect(() => {
         LoadData();
      }, []);
      

           

  return (
    <div className="section dark-bg blur-slide-screen"  style={{position:"relative"}}>
      <div className="image-wall">
        <img src="https://ik.imagekit.io/fsobpyaa5i/happy-diverse-friends-celebrating-with-sparklers-o-2025-02-13-00-11-44-utc.jpg"  alt="waveled" />
      </div>  
      <section className="over-product-blur" ref={blurRef}>
        {LoadingData.length >= 4 ?  
        <div className="products-slide">
          <Slider {...settings}> 
            {LoadingData.map((item, index) => (
              <div className="d-flex" >
                 <article key={index}>   
                  <div className="image-area">
                    <img src={item?.wl_product?.wl_images.length > 0 ?  (item?.wl_product?.wl_images[0].startsWith('http') ?  (item?.wl_product?.wl_images[0])  : (BaseUrl +  item?.wl_product?.wl_images[0]))  : ""}  alt="" />
                  </div> 
                <div className="text">
                  <Link href={`single-shop?product=${item?.wl_product?._id}`}>
                    <h4>{item?.wl_product?.wl_name.split("").length > 70 ? item?.wl_product?.wl_name.substring(0, 70)+"...": item?.wl_product?.wl_name} </h4>
                  </Link>
                  <p>
                     {item?.wl_product?.wl_specs_text.split("").length > 90 ? item?.wl_product?.wl_specs_text.substring(0, 90)+"...": item?.wl_product?.wl_specs_text} 
                  </p>
                </div>
              </article>
               <div style={{padding:"10px 5px"}}></div>
              </div>
            ))}
          </Slider>
        </div>
        : <></>}
      </section>
    </div>
  );
};

export default TestimonialSection;

 