"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";

function CategoryGridGalery({categoryId}) {
  // 1) Dados da galeria (muda/estende como quiseres)
  const items = useMemo(
    () => [
      {
        src: "https://ceoled-display.com/wp-content/uploads/2024/04/M6.jpg",
        title: "Floresta",
        description: "Caminho entre árvores ao fim da tarde.",
        size: "h-2",
      },
      {
        src: "https://ceoled-display.com/wp-content/uploads/2024/04/55inch-Museum-Display-Transparent-OLEDRK-O55-WTG2-51.jpg",
        title: "Montanhas",
        description: "Cordilheira iluminada pelo sol.",
        size: "",
      },
      {
        src: "https://ceoled-display.com/wp-content/uploads/2024/04/Snipaste_2024-07-04_17-52-11.jpg",
        title: "Retrato",
        description: "Momento espontâneo numa rua antiga.",
        size: "",
      },
      {
        src: "https://ceoled-display.com/wp-content/uploads/2024/12/Snipaste_2024-12-11_14-50-44.jpg",
        title: "Ponte",
        description: "Arquitetura e reflexos ao entardecer.",
        size: "h-2 w-3",
      },
      {
        src: "https://ceoled-display.com/wp-content/uploads/2024/04/lg-display-oledspace-products-transparent-oled-lab-of-paris-baguette-optimized.jpg",
        title: "Café",
        description: "Grãos torrados de café de especialidade.",
        size: "",
      },
      {
        src: "https://ceoled-display.com/wp-content/uploads/2025/04/transparent-oled-in-museum-2.jpg",
        title: "Cavalo",
        description: "Elegância e força em movimento.",
        size: "",
      },
    ],
    []
  );

  return (
     <aside>
      
        <div className="gallery-wrapper">
      <div className="large-box box-img">
        <div className="image">
          <img
            src="https://ceoled-display.com/wp-content/uploads/2025/04/transparent-oled-in-museum-2.jpg"
            alt=""
          />
        </div>
        <div className="over-box">
          <h5>Title here</h5>
          <small>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id sit
            alias beatae asperiores
          </small>
        </div>
      </div>
      <div className="double-box">
        <div className="box sm-box box-img">
          <div className="image">
            <img
              src="https://ceoled-display.com/wp-content/uploads/2025/04/transparent-oled-in-museum-4-1536x1143.webp"
              alt=""
            />
          </div>
          <div className="over-box">
            <h5>Title here</h5>
            <small>Lorem ipsum dolor, sit amet.</small>
          </div>
        </div>
        <div className="box sm-box box-img">
          <div className="image">
            <img
              src="https://ceoled-display.com/wp-content/uploads/2024/04/55inch-Museum-Display-Transparent-OLEDRK-O55-WTG2-1.jpg"
              alt=""
            />
          </div>
          <div className="over-box">
            <h5>Title here</h5>
            <small>Lorem ipsum dolor, sit amet.</small>
          </div>
        </div>
      </div>
      <div className="vertical-box">
        <div className="box-img">
          <div className="image">
            <img
              src="https://ceoled-display.com/wp-content/uploads/2025/04/transparent-oled-in-museum-3.webp"
              alt=""
            />
          </div>
          <div className="over-box">
            <h5>Title here</h5>
            <small>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id sit
              alias beatae asperiores
            </small>
          </div>
        </div>
      </div>
      <div className="tripple-box">
        {[
         "https://ceoled-display.com/wp-content/uploads/2025/06/Digital-Signage-Kiosk-hotel-768x777.webp", 
         "https://ceoled-display.com/wp-content/uploads/2025/06/9-Digital-Signage-Kiosks-768x777.webp",
         "https://ceoled-display.com/wp-content/uploads/2025/06/Digital-Signage-Kiosks-4-768x777.webp"
        ].map((item, index) => (
          <div className="box-img">
            <div className="image">
              <img
                src={item}
                alt=""
              />
            </div>
            <div className="over-box">
              <h5>Title here</h5>
              <small>Lorem ipsum dolor, sit amet.</small>
            </div>
          </div>
        ))}
      </div>
    </div>
     </aside>
  );
}

export default CategoryGridGalery;
