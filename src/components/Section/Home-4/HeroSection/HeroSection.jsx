"use client";
import Link from "next/link";
import { useState } from "react";

const HeroSection = () => {
  return (
    <div className="main-home-hero">
      <div className="video-backgound">
        <video
          src="https://video-previews.elements.envatousercontent.com/h264-video-previews/d944b792-2c06-4fa6-8c7c-2a51203fba94/58655351.mp4"
          poster="https://luxmage.com/data/upload/hnhnhthctmnhnhledchnng2.png"
          muted
          autoPlay
          loop
        ></video>
      </div>
      <div className="main-home-hero-overlay">
        <div className="container-fluid"> 
          <div className="text-content"> 
             <h1>De Brilho e Luz ao Seu Projeto  ideal</h1>
             <p>
              Somos especialistas na venda, montagem e Aluguer de ecrãs LED para eventos, publicidade, empresas e projetos especiais. Oferecemos soluções modernas, de alta qualidade e adaptadas a cada cliente.
             </p>
             <Link href={"/about-us"} className="tekup-default-btn">Saiba mais</Link>
          </div>
        </div>
      </div>
    </div> 
  );
};

export default HeroSection;
