import { Card } from "react-bootstrap";
import services from "~/db/homeTwoServiceData.json";

const ServiceSection = () => {
  const Cards = [
    {
      name: "Art System Ecran LED Outdoor",
      description: "Painel de substituição Daktronics ProStar 20mm",
      logo: "https://www.leyardeurope.eu/files/my_files/img/leyard-logo.png",
      image: "https://atcomms.co.uk/wp-content/uploads/2025/04/UPAD-IV.png",
      color: "",
      position: 0,
      link_1: "",
      link_2: "",
    },
    {
      name: "Art System Cabine de Ecrã LED Outdoor P3.91",
      description: "Outdoor, Art System Cabine de Ecrã LED Outdoor P3.91",
      logo: "https://lumica-asia.com/media/wysiwyg/p-logo9.png",
      image: "https://site-681372.mozfiles.com/files/681372/ledscreen-service-rental-screen-ledscreenservice_com.png",
      color: "",
      position: 0,
      link_1: "",
      link_2: "",
    },
    {
      name: "Ecrã Led Outdoor 3.9 Pixels RD",
      description: "Tela LED externa IP65 3 em 1 SMD 1921, espaçamento entre pixels 3,9",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Daktronics_logo.svg/1200px-Daktronics_logo.svg.png",
      image: "https://www.onedisplaygroup.com/wp-content/uploads/2020/09/O-Dooh-main_.png",
      color: "",
      position: 0,
      link_1: "",
      link_2: "",
    },
    {
      name: "Dispositivos Luminus, CBM-120-UV-C31",
      description: "Telão LED para exterior para publicidade tem alto brilho, alto contraste",
      logo: "https://www.matrixvisual.com/wp-content/uploads/2016/10/Unilumin-Logo.png",
      image: "https://www.ledscreenunion.com/cdn/shop/files/LEDMAN-QF_Series_Dubai.webp?v=1733047883&width=950",
      color: "#0C090D",
      position: 1,
      link_1: "",
      link_2: "",
    },
  ];

  return (
    <div className="section large-features-section tekup-section-padding2">
      <div className="container-fluid">
        <div className="tekup-section-title center">
          <h2>Temos as telas de ultima geração para o seu  projeto</h2>
        </div>
        <div className="row">
          {Cards.map((item, index)=>{
        return <article key={index} className={`featured-product box-${item.position}`} style={{background:`${item.color}`}}>
                  <div className="image"><img src={item.image} alt={item.name} /></div>  
                  <div className={`text-box`}>
                    <div className="logo">
                       <img src={item.logo} alt="" />
                    </div>
                      <h1>{item.name}</h1>
                      <p>{item.description}</p>
                      <div className="d-flex">
                         <button className="tekup-default-btn tekup-white-btn">Saiba mais</button>
                         <button className="tekup-default-btn">Comprar</button>
                      </div>
                  </div>  
               </article>
           })}
        </div>
      </div>
    </div>
  );
};



export default ServiceSection;
