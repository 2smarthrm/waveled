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
             <h5>Waveled</h5>
             <h1>De Brilho e Luz ao Seu Projeto ideial</h1>
             <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat, exercitationem consequatur nostrum, accusantium maiores
               tenetur amet iure maxime repudiandae ut laboriosam quos illo corrupti quibusdam mollitia sequi quis repellat. Nihil!
             </p>
             <Link href={"/about-us"} className="tekup-default-btn">Saiba mais</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
