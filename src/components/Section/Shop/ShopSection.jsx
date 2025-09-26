// o video so deve tocar quando o usuario estviver. ver aquela zona do video , nunca quando estiver inivisivel
"use client";
import Link from "next/link";
import React from "react";
import ProductCard from "~/components/Ui/Cards/ProductCard";
import Products from "~/db/products.json";
import Slider from "react-slick";

const ShopSection = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: 3.6,
    slidesToScroll: 3.6,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.6,
          slidesToScroll: 3.6,
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

  const Data = {
    PageTitle: "Outdoors",
    topthree: [
      {
        new: true,
        title: "Durability: Outdoor LED Displays",
        link_1: "",
        link_2: "",
        sku: "IUIY67",
        color: "#f2e9e4",
        image:
          "https://static.vecteezy.com/system/resources/previews/066/340/979/non_2x/blank-outdoor-led-display-board-for-advertising-with-adjustable-supports-and-frame-free-png.png",
      },
      {
        new: true,
        title: " LED Display for Outdoor",
        link_1: "",
        link_2: "",
        sku: "FDUUY",
        color: "#caf0f8",
        image:
          "https://ptcled.usa18.wondercdn.com/uploads/image/634dff1c6a27f.png",
      },
      {
        new: true,
        title: "Advanced Outdoor LED",
        link_1: "",
        link_2: "",
        sku: "76TYHJRG",
        color: "#ffe5ec",
        image:
          "https://shopcdnpro.grainajz.com/1009/upload/custom/4e67f6f4b2a1114d36f9f0437181c7a8af05a79457bfee58bddfc2395fc9db13.png",
      },
    ],
    videosSection_1: {
      source:"https://video-previews.elements.envatousercontent.com/h264-video-previews/2ec50093-3a2f-4608-a78c-0ca3b126791e/58796892.mp4",
      text1:"Orçamentos para medir e no mesmo dia " ,
      text2:"para todo tipo de négocio" ,
    },
    videosSection_2: {
      source:"https://video-previews.elements.envatousercontent.com/h264-video-previews/09240423-e70c-4ede-91d3-dac20b3d3100/58056233.mp4",
      text1:"Orçamentos para medir e no mesmo dia " ,
      text2:"para todo tipo de négocio" ,
    },
    FeaturedSection: {
      title: "3D Series Aluminum Outdoor",
      image:
        "https://ddw.usa18.mega--cloud.com/uploads/image/6548a35a22d0a.jpg",
      link_text: "Saiba mais agora",
      link_source: "#",
    },
    ProductsCarousel: {
      PageTitle: "Waveled o seu local favorito para comprar o display",
      products: [
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://image.made-in-china.com/318f0j00wTKfPerCAloM/mzcled-02-mp4.webp",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://www.macropix.com/wp-content/uploads/Signum-QS-2-42.png",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://www.leyardeurope.eu/files/my_files/pic/products/LED%20Video%20Walls/Luminate%20Pro%20Series/Gen%202/Luminate%20Pro%20Gen%202%20Product.png",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://www.pantallasledlemon.com/wp-content/uploads/2020/10/pantalla-led-lemon-die-cast-outdoor-3-ok.jpg",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://ecdn6.globalso.com/upload/p/1633/image_product/2024-04/662b28fd38e9e52328.png",
        },
        {
          sku: "HJK875",
          title: "Rental LED Screen",
          description:
            "Rental LED screen refers to the LED screen that can be provided to the event organizer for rental.",
          image:
            "https://ptcled.usa18.wondercdn.com/uploads/image/67b41efa349e3.png",
        },
      ],
    },
  };

  return (
    <div>
      <div className="section tekup-section-padding">
        <aside className="featured-top-products">
          <div className="container">
            <h1 className="text-dark">{Data?.PageTitle}</h1>
            <br />
            {/** 3 produtos destaque */}
            <div className="row">
              {Data.topthree.map((item, index) => (
                <article className="featured-article">
                  <div
                    className="image"
                    style={{ backgroundColor: `${item?.color}` }}
                  >
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="newbadge">Novo</div>
                  <h3>{item.title}</h3>
                  <small className="sku-code">
                    <strong>SKU :</strong>
                    <span className="text-primary"> {item.sku} </span>
                  </small>
                  <div className="d-flex   gap-3 mt-3">
                    <a
                      className="tekup-default-btn bg-black"
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Saiba Mais
                    </a>
                    <a
                      className="tekup-default-btn"
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Comprar
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <aside>
        {/** video section */}
        {Data?.videosSection_1 && Data?.videosSection_1?.source ? (
          <div className="video-shop-large-section">
            <div className="video-shop-large">
              <video  src={Data?.videosSection_1?.source}  autoPlay   muted  loop  ></video>
                <div className="over-video-large">
                  <div> 
                    <div className="tekup-section-padding"> 
                       <div className="container">
                         <h2>{Data?.videosSection_1?.text1}</h2>
                      <h2>{Data?.videosSection_1?.text2}</h2> 
                      <br />
                        <Link href={"#"} ><button className="tekup-default-btn">Solicitar Orçamento</button></Link>
                       </div>
                    </div> 
                  </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </aside>
      <aside className="section tekup-section-padding">
        {/** featured product section */}
        {Data?.FeaturedSection ? (
          <div className="container">
            <div className="content-centered-block">
              <h2 className="text-dark">{Data?.FeaturedSection.title}</h2>
              <div className="image text-center">
                <img src={Data?.FeaturedSection.image} alt="" />
              </div>
              <br />
              <button className="tekup-default-btn ">
                {Data?.FeaturedSection.link_text}
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </aside>
      <aside>
        {/** video section */}.
        {Data?.videosSection_2 && Data?.videosSection_2?.source ? (
          <div className="video-shop-large-section">
            <div className="video-shop-large">
              <video  src={Data?.videosSection_2?.source}  autoPlay muted loop></video>
              <div className="over-video-large">
                  <div  > 
                    <div className="tekup-section-padding"> 
                       <div className="container">
                         <h2>{Data?.videosSection_2?.text1}</h2>
                      <h2>{Data?.videosSection_2?.text2}</h2> 
                      <br />
                      <Link href={"#"} ><button className="tekup-default-btn">Solicitar Orçamento</button></Link>
                       </div>
                    </div> 
                  </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </aside>
      <aside>
        {Data?.ProductsCarousel ? <></> : <></>}
        <div className="products-carousel">
          <div className="carousel-featured-products">
            <div className="container">
              <h2>{Data?.ProductsCarousel.PageTitle}</h2>
              <br />
              <Slider {...settings}>
                {Data?.ProductsCarousel?.products.map((item, index) => (
                  <article key={index}>
                    <div className="card-content">
                      <strong className="sku">SKU-{item.sku}</strong>
                      <h5>{item.title}</h5>
                      <p>{item.description}</p>
                      <div className="image">
                        <Link href={"#"}>
                           <img src={item.image} alt={item.title} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ShopSection;
