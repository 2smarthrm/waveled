import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import ShopSection from "~/components/Section/Shop/ShopSection";

import React, { Suspense } from "react"; 
export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-5 text-center">
          <p>A carregar categoria…</p>
        </div>
      }
    >
       <>
      <HeaderFour className="tekup-header-top bg-light1 " /> 
      <section className="product-category-section">
           <ShopSection />
      </section> 
      <FooterFour className="tekup-footer-section dark-bg" />
    </>
    </Suspense>
  );
}

