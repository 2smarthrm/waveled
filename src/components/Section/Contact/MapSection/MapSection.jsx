"use client"
const MapSection = () => {
    return (
    <section className=""> 
    <div className="text-center">
        <h3>Saiba onde estamos localizados</h3>
        <p>locais diferentes mas com o mesmo objectivo</p>
        <br />
    </div>
    <aside className="contact-map-section">
      {/* --- Lisboa --- */}
      <article>
        <div className="image">
          <img
            className="blurhash-auto"
            src="https://exportech.com.pt/static/media/1.1.98dcb3ffc1bbebba15e1.jpg"
            alt="Sede Exportech Lisboa"
          />
        </div>
        <div className="dets">
          <h5>Sede  Lisboa</h5>
          <br />
          <p>
            Rua Fernando Farinha nº 2A e 2B Braço de Prata - Lisboa 1950-448
            <br />
            <br />
            +351 210 353 555 | +351 212 456 082
            <br />
            geral@exportech.com.pt
          </p>
        </div>
        <div className="map">
          <iframe
            title="Mapa Sede  Lisboa"
            frameBorder="0"
            src="https://www.google.com/maps/embed/v1/place?q=exportech&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </article>

      {/* --- Funchal --- */}
      <article>
        <div className="image">
          <img
            className="blurhash-auto"
            src="https://store.exportech.com.pt/wp-content/uploads/2024/03/IMG_6144-min-e1711622013600.jpg"
            alt="Filial  Funchal"
          />
        </div>
        <div className="dets">
          <h5>Filial  Funchal</h5>
          <br />
          <p>
            Rua da Capela do Amparo Edifício Alpha Living Loja A 9000-267 Funchal
            <br />
            <br />
            +351 291 601 603 | +351 968 084 534
            <br />
            geral@exportech.com.pt
          </p>
        </div>
        <div className="map">
          <iframe
            title="Mapa Exportech Funchal"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3359.5446757413597!2d-16.9431819!3d32.6449469!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc605ff24d96cccf%3A0x93a9908fef4d2f47!2sEXPORTECH%20-%20FUNCHAL!5e0!3m2!1spt-PT!2spt!4v1728465943143!5m2!1spt-PT!2spt"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </article>

      {/* --- Benavente --- */}
      <article>
        <div className="image">
          <img
            className="blurhash-auto"
            src="https://exportech.com.pt/static/media/2.1.f6639cf4522f12d63c1b.jpg"
            alt="Armazém Logístico Exportech Benavente"
          />
        </div>
        <div className="dets">
          <h5>Armazém Logístico</h5>
          <br />
          <p>
            Estrada do Contador nº 25 - Fracção B Sesmaria do Colaço 2130-223 Benavente
            <br />
            <br />
            +351 210 353 555 | +351 967 018 509
            <br />
            geral@exportech.com.pt
          </p>
        </div>
        <div className="map">
          <iframe
            title="Mapa Armazém Logístico Benavente"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3102.675647524364!2d-8.8183823!3d38.9542377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd191f9493f5f125%3A0x31dd3e9a5fb6fe8f!2sExportech%20Portugal%20-%20Armaz%C3%A9m%20Log%C3%ADstico!5e0!3m2!1spt-PT!2spt!4v1752771186057!5m2!1spt-PT!2spt"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </article>
    </aside> 
    </section>
    
    );
};

export default MapSection;