
import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import MyCartSection from "~/components/Section/MyCart/MyCartSection";


const CartPage = () => {
    return (
        <>
        <HeaderTwo className="tekup-header-top bg-light1 "/>
          <PageHeader title="My Cart"/> 
          <MyCartSection/> 
          <FooterOneSection className="tekup-footer-section dark-bg"/>
        </>
    );
};

export default CartPage;