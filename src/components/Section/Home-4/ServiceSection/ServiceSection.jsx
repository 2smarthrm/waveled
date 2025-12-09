"use client"
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import services from "~/db/homeTwoServiceData.json";
import RequestModal from "../../Common/RequestBudgetModal/RequestModal";

const ServiceSection = () => { 
  const [LoadingStatus,SetLoadingStatus] =  useState(null);
  const [LoadingData, SetLoadingData] =  useState([]); 

  const isBrowser = typeof window !== "undefined";
  const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
  const BaseUrl = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";
  // build a calendar 
   async function LoadData(){
      try {
        const response = await axios.get(BaseUrl+"/api/featured/home", {withCredentials: true });
        const data = response?.data?.data?.wl_slots ? response?.data?.data?.wl_slots : [];
        SetLoadingData(data); 
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
    <div className={LoadingStatus !== null && LoadingData.length > 0 ? "section large-features-section tekup-section-padding2 pt-4" : "d-none"}>
      <div className="container-fluid">
        <div className="tekup-section-title center">
          <h2>Temos as telas de ultima geração para o seu  projeto</h2>
        </div> 
        <div className="row">
          {LoadingData.map((item, index)=>{
          return <article key={index} className={`featured-product box-${index === 3 ? "1" : ""}`} style={{background:`${index === 3 ? "#000" : ""}`}}>
                  <div className="image">
                     <img style={index !== 3 ? {mixBlendMode:"multiply"} :  {}} src={item?.wl_images?.length > 0 ?  (item?.wl_images[0].startsWith('http') ?  (item?.wl_images[0])  : (BaseUrl +  item?.wl_images[0]))  : ""} alt={item?.wl_name} />
                    </div>  
                  <div className={`text-box`}> 
                      <div className="text-center align-items-center">
                         <h1 style={{maxWidth:"650px"}} >{item?.wl_name.split("").length > 80 ?  item?.wl_name.substring(0, 80) + "..." : item?.wl_name}</h1>
                      </div>
                      <p>{item?.wl_specs_text.split("").length > 100 ?  item?.wl_specs_text?.substring(0, 100)+ "..." : item?.wl_specs_text}</p>
                      <div className="d-flex">
                        <Link href={`single-shop?product=${item?._id}`}>
                           <button className="tekup-default-btn tekup-white-btn">Saiba mais</button>
                         </Link>

                         <RequestModal
                          item={item}
                          toggle_button={(open) => (
                            <button className="tekup-default-btn" onClick={open}>
                              Solicitar 
                            </button>
                          )}
                        />
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
