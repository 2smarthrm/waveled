"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const FactSection = () => {
  const [ActiveTab, setActiveTab] = useState(1);

  return (
    <div className="section">
      <div className="service-img">
        <img  
          src="https://ik.imagekit.io/fsobpyaa5i/original-95877bcd72019c90722428afc930d8fb%20(1).webp"
          alt="waveled"
        />
      </div>
      <br></br>
      <br />
      <br />
      <br />
      <section className="waveled-categories">
    

<div className="container">
  <div className="d-flex justify-content-center">
    <div className="cat-tab-header">
      <li
        className={
          ActiveTab === 1
            ? "tekup-default-btn ml-1 mr-1"
            : "tekup-default-btn tekup-white-btn ml-1 mr-1"
        }
        onClick={() => setActiveTab(1)}
      >
        Indoor
      </li>
      <li
        className={
          ActiveTab === 2
            ? "tekup-default-btn ml-1 mr-1"
            : "tekup-default-btn tekup-white-btn ml-1 mr-1"
        }
        onClick={() => setActiveTab(2)}
      >
        Outdoor
      </li>
      <li
        className={
          ActiveTab === 3
            ? "tekup-default-btn ml-1 mr-1"
            : "tekup-default-btn tekup-white-btn ml-1 mr-1"
        }
        onClick={() => setActiveTab(3)}
      >
        Aluguer
      </li>
      <li
        className={
          ActiveTab === 4
            ? "tekup-default-btn ml-1 mr-1"
            : "tekup-default-btn tekup-white-btn ml-1 mr-1"
        }
        onClick={() => setActiveTab(4)}
      >
        Desporto
      </li>
    </div>
  </div>

  <br />
  <br />

  <aside className="cat-tab-body">
    {/* INDOOR */}
    <article className={ActiveTab === 1 ? "container-fluid box-tab" : "d-none"}>
      <div className="content">
        <h4 className="text-dark">Indoor</h4>
        <p>
          Displays LED de alto desempenho para interiores: imagem nítida, cores
          fiéis e integração discreta em qualquer espaço. Indicados para lojas,
          auditórios, empresas e estúdios. Disponíveis para <strong>venda</strong> e <strong>aluguer</strong>.
        </p>
        <ul>
          <li>Retalho e vitrines interativas</li>
          <li>Salas de conferência e receções corporativas</li>
          <li>Video walls para broadcast e estúdios</li>
          <li>Salas de controlo e centros de operações</li>
          <li>Museus, galerias e experiências imersivas</li>
        </ul>
        <br />
        <Link href="/shop?category=indoor" className="tekup-default-btn">
          Saiba mais
        </Link>
      </div>
      <div className="image">
        <img  
          src="https://www.eagerled.com/wp-content/uploads/2022/11/010f225f02effda801215aa0485bd0.jpg"
          alt="Display LED Indoor em ambiente corporativo"
        />
      </div>
    </article>

    {/* OUTDOOR */}
    <article className={ActiveTab === 2 ? "container-fluid box-tab" : "d-none"}>
      <div className="content">
        <h4 className="text-dark">Outdoor</h4>
        <p>
          Robustez e brilho para exterior, com excelente visibilidade sob luz
          solar. Soluções escaláveis para <strong>venda</strong> e <strong>aluguer</strong>, prontas para
          funcionar 24/7 com proteção contra intempéries.
        </p>
        <ul>
          <li>Fachadas médias e grandes formatos</li>
          <li>Billboards digitais e monopostes</li>
          <li>Mobiliário urbano e MUPIs</li>
          <li>Centros comerciais e terminais de transporte</li>
          <li>Media façade e arquitetura dinâmica</li>
        </ul>
         <br />
        <Link href="/shop?category=outdoor" className="tekup-default-btn">
          Saiba mais
        </Link>
      </div>
      <div className="image">
        <img  
          src="https://maliklighting.com/wp-content/uploads/2020/02/Untitled-design-77.png"
          alt="Display LED Outdoor em fachada"
        />
      </div>
    </article>

    {/* ALUGUER */}
    <article className={ActiveTab === 3 ? "container-fluid box-tab" : "d-none"}>
      <div className="content">
        <h4 className="text-dark">Aluguer (Eventos)</h4>
        <p>
          Painéis modulares de montagem rápida para eventos, palcos e feiras.
          Estruturas leves, compatíveis com rigging e curvatura, com alta taxa
          de atualização para câmaras.
        </p>
        <ul>
          <li>Concertos, festivais e palcos</li>
          <li>Feiras, congressos e stands</li>
          <li>Conferências e lançamentos de produto</li>
          <li>Backdrops, totems e ecrãs laterais (IMAG)</li>
          <li>LEDs de piso e soluções criativas</li>
        </ul>
       <br />
        <Link href="/contact-us" className="tekup-default-btn">
          Pedir orçamento
        </Link>
      </div>
      <div className="image">
        <img  
          src="https://www.bibiled.com/wp-content/uploads/2024/05/Everything-you-need-to-know-about-outdoor-LED-rental-screens-www.bibild.com-1.jpg"
          alt="Estrutura de LED rental em evento"
        />
      </div>
    </article>

    {/* DESPORTO */}
    <article className={ActiveTab === 4 ? "container-fluid box-tab" : "d-none"}>
      <div className="content">
        <h4 className="text-dark">Desporto</h4>
        <p>
          Soluções LED para recintos desportivos, com segurança reforçada e
          integração com sistemas de scoring e broadcast. Disponíveis para
          <strong> venda</strong> e <strong>aluguer</strong>.
        </p>
        <ul>
          <li>Perímetro LED (perimeter boards) com proteção anti-impacto</li>
          <li>Placar eletrónico e cubo central</li>
          <li>Publicidade dinâmica e ativações de marca</li>
          <li>Salas de imprensa e zonas mistas</li>
          <li>Sistemas de repetição e conteúdos em tempo real</li>
        </ul>
       <br />
        <Link href="/shop?category=sports" className="tekup-default-btn">
          Ver soluções
        </Link>
      </div>
      <div className="image">
        <img  
          src="https://prodisplay.com/wp-content/uploads/2022/02/outdoor-led-display-screen-sports-events.jpg"
          alt="Perímetro LED em estádio"
        />
      </div>
    </article>
  </aside>
</div>




      </section>
    </div>
  );
};

export default FactSection;
