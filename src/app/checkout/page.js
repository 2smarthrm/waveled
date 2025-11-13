import CheckOutSection from "~/components/Section/CheckOut/CheckOutSection";
import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";


const CheckOutPage = () => {
    return (
        <>
        <HeaderTwo className="tekup-header-top bg-light1 "/>
          <PageHeader title="Checkout"/> 
          <CheckOutSection/> 
          <FooterOneSection className="tekup-footer-section dark-bg"/>
        </>
    );
};

export default CheckOutPage ;