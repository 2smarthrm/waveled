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
            src="https://exportech.com.pt/static/media/1.2.f39b0282c15b58a90af8.webp"
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
            sales@waveled.com
          </p>
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
             sales@waveled.com
          </p>
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
             sales@waveled.com
          </p>
        </div> 
      </article>
    </aside> 
    </section>
    
    );
};

export default MapSection;