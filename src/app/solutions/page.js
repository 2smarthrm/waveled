"use client"
import HeaderFour from '~/components/Section/Common/Header/HeaderFour';
import FooterFour from '~/components/Section/Common/FooterFour';
import CtaThreeSection from '~/components/Section/Common/CtaThree/CtaThreeSection';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from "react-slick";

import Link from 'next/link';
import {SlideshowLightbox} from 'lightbox.js-react'
import Lightbox from "react-awesome-lightbox"; 
import "react-awesome-lightbox/build/style.css";

const SolutionPage = () => {

    const [LoadingStatus,SetLoadingStatus] =  useState(null);
    const [LoadingData, SetLoadingData] =  useState([]); 
    const BaseUrl = "https://waveledserver.vercel.app";

    
    const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: 3.8,
    slidesToScroll:3.8,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 3.2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  
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


  function BlockSection({data}){
    return(
    <aside>
      <h2 className='tekup-section-title pt-0 pb-0 mb-4 text-dark'>{data?.title}</h2>
        <p className='col-lg-8 mt-0 pt-0'>{data?.description}</p>
        <div className={data?.reverse === true ? "reverse images-area"  : 'images-area'}>
          <div className='large-image' >
            <img src={data?.large_img} />
          </div>
          <div className={'block-images'}>
            <div className='md-image'>
              <img src={data?.md_img} />
            </div>
            <div className='group-images'>
              <div className='img'>
                  <img src={data?.img_1}/>
              </div>
              <div className='img'>
                  <img src={data?.img_2}/>
              </div>
            </div>
          </div>
        </div>
    </aside>);   
    }


  return (
    <div className='solutions-page'>
      <HeaderFour />
      <br />
      <section className='section pb-0 mb-0 tekup-section-padding'>
        <div className='container'>
            <BlockSection 
              data={{
                 reverse:false,
                title:"Palestras e Conferências",
                description:"Expositores publicitários leves, sem necessidade de ferramentas e multifuncionais permitem uma organização rápida e eficaz dos espaços de exposição.",
                large_img:"https://www.sryleddisplay.com/wp-content/uploads/2024/11/flexible-led-screen-panel_9.webp",
                md_img:"https://www.doitvision.com/wp-content/uploads/2025/04/flexible-screen-2.jpg",
                img_1:"https://szledworld.com/wp-content/uploads/2022/11/cylinder-flexible-led-screen.jpg" ,
                img_2:"https://www.colorlitled.com/wp-content/uploads/2024/07/exhibition-led-screen-installed-at-the-Exhibition-Booths.webp"  
              }} 
            /> 
          <aside className='section pt-5 pb-0 tekup-section-padding'>
            <h4 className='pt-0 mt-0'>Pode tambem gostar</h4>
            <p>Escolha o produto perfeito para o seu projeto</p>
          </aside> 
        </div>
      </section>
          <div className="products-carousel bg-white pt-0 mt-0 pt-0 mb-0">
            <div className="carousel-featured-products pt-0 mt-0"> 
                {LoadingStatus === true ?
                  <Slider {...settings}>
                    {LoadingData?.map((item, index) => (
                      <div className="d-flex" >
                        <article key={index}>
                          <div style={{ minHeight: "500px" }} className="card-content"  >
                            <strong className="sku">SKU-{item.wl_product?.wl_sku}</strong>
                            <Link href={`single-shop?product=${item?.wl_product?._id}`}>
                              <h5>{item?.wl_product?.wl_name.split("").length > 45 ? item?.wl_product?.wl_name.substring(0, 45) + "..." : item?.wl_product?.wl_name} </h5>
                            </Link>
                            <p>{item.description}</p>
                             <div className="image"> 
                                  <img src={item?.wl_product?.wl_images.length > 0 ? 
                                  BaseUrl + item?.wl_product?.wl_images[0] : ""} alt={item.title} /> 
                            </div>
                          </div>
                        </article>
                        <div style={{ padding: "10px 15px" }}></div>
                      </div>
                    ))}
                  </Slider>
                 : <></>
                } 
            </div>
          </div>

       <div className='mb-0' >
          <div className='section  tekup-section-padding pt-2 mb-0 mt-0 pb-0'>
               <div className='container'>
                    <img style={{borderRadius:"6px"}} src={"https://www.yslv.co.uk/images/solutions/exhibition-hero2.jpg"} />
               </div>
          </div>
       </div>
       <br/> <br/>
       <section className='section pb-0 mb-0 pt-0 tekup-section-padding'>
        <div className='container'> 
           <BlockSection 
              data={{
                reverse:true,
                title:"Paineis publicitarios",
                description:"Expositores publicitários leves, sem necessidade de ferramentas e multifuncionais permitem uma organização rápida e eficaz dos espaços de exposição.",
                large_img:"https://www.installation-international.com/wp-content/uploads/2023/11/UX-Global-Footasylum-Oxford-Street-shoe-fitting-area-with-cube-1-scaled.jpg",
                md_img:"https://s3.mortarr.com/images/project_gallery_images/ledconn-luxfit-led-hanging-light-panels-1.jpeg",
                img_1:"https://www.bibiled.com/wp-content/uploads/2023/10/A-step-by-step-guide-to-purchasing-LED-displays-that-you-must-know-www.bibiled.com1_.jpg" ,
                img_2:"https://images.squarespace-cdn.com/content/v1/63cd18110cbdf5147b6d31b2/41ac1d3e-7910-4a47-97e8-d8036aaa3556/digital-led-screens-indoor-supermarket.jpg?format=1000w" 
              }}
            />
        </div>
      </section> 
       <br/> <br/>
      <section className='video-area'>
          <video autoPlay muted loop 
              src="https://video-previews.elements.envatousercontent.com/h264-video-previews/52fd5315-d222-4c72-9d42-5c30447c8cda/52493336.mp4"> 
          </video>
           <div className="over-video-large">
              <div className="tekup-section-padding"> 
                <div className="container mt-4" 
                style={{
                  display:"flex", 
                  flexDirection:"column",
                  alignItems:"center",
                  justifyContent:"center",
                  textAlign:"center"
                }}>
                <div>
                    <h2>TELAS DESPORTIVAS</h2>
                </div>
                 <div>
                   <h2>PARA TODOS OS MOMENTOS </h2>
                 </div>
                  <br />
                  <Link href="/contact-us">
                    <button className="tekup-default-btn">Solicitar Orçamento</button>
                  </Link>
                </div>
              </div>
            </div>
      </section>
      <br/><br/>
       <section className='section pb-0 pt-0 mb-0 tekup-section-padding'>
        <div className='container'> 
           <BlockSection 
              data={{
                reverse:false,
                title:"Cénarios Desportivos",
                description:"Expositores publicitários leves, sem necessidade de ferramentas e multifuncionais permitem uma organização rápida e eficaz dos espaços de exposição.",
                large_img:"https://5.imimg.com/data5/CT/WJ/NY/SELLER-7711135/stadium-led-display-screen.jpg",
                md_img:"https://www.unit-led.com/wp-content/uploads/2023/01/perimeter-led-display.jpg",
                img_1:"https://www.hdledisplay.com/wp-content/uploads/2019/08/p10-led-display-video.jpg",
                img_2:"https://www.linsnled.com/wp-content/uploads/2020/09/sport-led-billboard.webp"  
              }} 
            />
            <br/>   <br/>   <br/>
        </div>
      </section>  
      <CtaThreeSection /> 
      <FooterFour />
    </div>
  ); 
};

export default SolutionPage;