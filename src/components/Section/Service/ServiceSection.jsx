"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import axios from "axios";

export default function ServiceSection() {
  const videoRefs = useRef([]);

 const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 3.1,
    slidesToScroll: 3.1,
    responsive: [
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 1.0,
          slidesToScroll: 1.0,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
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

  useEffect(() => {
    const isVisible = (el) => el?.dataset?.visible === "true";

    // IntersectionObserver: controla play/pause e marca visibilidade
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          video.dataset.visible = entry.isIntersecting ? "true" : "false";
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 } // ~1/3 no viewport já conta como visível
    );

    // ended -> rebobina e toca outra vez se continuar visível
    const handleEnded = (e) => {
      const v = e.currentTarget;
      if (isVisible(v)) {
        try {
          v.currentTime = 0;
        } catch {}
        v.play().catch(() => {});
      }
    };

    // Se a aba ficar oculta, pausa; quando voltar, retoma se estiver visível
    const handleVisibilityChange = () => {
      videoRefs.current.forEach((v) => {
        if (!v) return;
        if (document.hidden) {
          v.pause();
        } else if (isVisible(v)) {
          v.play().catch(() => {});
        }
      });
    };

    // ligar observador e eventos
    videoRefs.current.forEach((v) => {
      if (!v) return;
      v.dataset.visible = "false";
      observer.observe(v);
      v.addEventListener("ended", handleEnded);
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // cleanup
    return () => {
      videoRefs.current.forEach((v) => {
        if (!v) return;
        observer.unobserve(v);
        v.removeEventListener("ended", handleEnded);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

const Sections = [
  {
    video: "https://ik.imagekit.io/fsobpyaa5i/image-gen%20(83).png",
    title: "Planeamento",
    reverse: false,
    description:
      "Transformamos objetivos em especificações técnicas: levantamento de espaço, simulação de visibilidade, cálculo de pitch e luminosidade, cronograma e logística. Para eventos (feiras, congressos, ativações) entregamos aluguer chave-na-mão com transporte, montagem, calibração e operação no local — alta resolução, brilho consistente e prazos cumpridos, sem dores de cabeça.",
    image: "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg",
    over_text: { text_1: "Planeamos para impressionar", text_2: "Estudo • Simulação • execução" },
  },
  {
    video: "https://ik.imagekit.io/fsobpyaa5i/image-gen%20-%202026-01-12T154552.830.jpg",
    title: "Implementação",
    reverse: true,
    description:
      "Projetamos e instalamos displays LED para retalho, showrooms, auditórios, centros comerciais e fachadas. Indoor de alta definição, outdoor com proteção climática e soluções transparentes para vitrines — tudo integrado com CMS simples, eficiência energética e acabamentos que respeitam a identidade da marca. Entrega “pronta a usar”, segura e fiável.",
    image:   "https://images.pexels.com/photos/6958531/pexels-photo-6958531.jpeg",
    over_text: { text_1: "Impacto visual sem limites", text_2: "Indoor • Outdoor • Transparente" },
  },
  {
    video: "https://ik.imagekit.io/fsobpyaa5i/image-gen%20(86).png",
    title: "Assistência Técnica",
    reverse: false,
    description:
      "Acompanhamos do primeiro dia ao dia-a-dia: auditoria técnica, manutenção preventiva e corretiva, atualizações de firmware, calibração de cor e formação de equipas. Suporte remoto e on-site, SLAs claros e stock de peças críticas para maximizar o tempo de atividade e a longevidade do investimento.",
    image:
      "https://images.pexels.com/photos/7682087/pexels-photo-7682087.jpeg",
over_text: { 
  text_1: "Assistência sempre disponível",
  text_2: "Suporte remoto e no local"
}

  },
  { 
    title: "Orçamentação",
    reverse: true,
    description:
      "Propostas transparentes e comparáveis: dimensionamento, TCO (custo total de propriedade), consumo energético estimado, opções de financiamento e prazos de entrega. Indicamos o ROI esperado por cenário (retalho, eventos, corporate) e alinhamos tudo com o teu budget — sem surpresas, só clareza.",
    image:
      "https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg",
    over_text: { text_1: "Propostas que convencem", text_2: "ROI • TCO • Financiamento" },
  },
];
 



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
    <>
      {Sections.map((item, index) => (
        <div key={index}>
          <div className="section bg-light1 tekup-section-padding2">
            <div className="container">
              <div className={`content-area ${item.reverse ? "reverse" : ""}`}>
                <div className="tekup-section-title">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <Link href="/contact-us" className="tekup-default-btn">Saiba mais</Link>
                </div>
                <div style={{padding:"20px"}} className="image">
                  <img style={{width:"100%",height:"100%",objectFit:"cover"}}  src={item.image} alt={item.title} loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          {item.video ? 
            <section className="video-area">
              <img 
                src={item.video}
                alt={item.title}
                loading="lazy"
              /> 
              <div className="over-video-large">
                <div className="tekup-section-padding">
                  <div className="container">
                    <h2>{item.over_text.text_1}</h2>
                    <h2>{item.over_text.text_2}</h2>
                    <br />
                    <Link href="/contact-us">
                      <button className="tekup-default-btn">Solicitar Orçamento</button>
                    </Link>
                  </div>
                </div>
              </div>
            </section> 
          : <></>} 
         
        </div>
      ))} 
    </>
  );
}
