import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import ShopSection from "~/components/Section/Shop/ShopSection";

const ShopPage = () => {
  return (
    <>
      <HeaderFour className="tekup-header-top bg-light1 " /> 
      <section className="product-category-section">
           <ShopSection />
      </section> 
      <FooterFour className="tekup-footer-section dark-bg" />
    </>
  );
};

export default ShopPage;
