import CtaSection from "~/components/Section/Common/Cta/CtaSection";
import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import FaqSection from "~/components/Section/Pricing/FaqSection/FaqSection";
import PricingScetion from "~/components/Section/Pricing/PricingScetion";


const PricingPage = () => {
    return (
        <>
        <HeaderTwo className="tekup-header-top bg-light1 "/>
           <PageHeader title="Pricing plan"/>
           <PricingScetion/> 
           <FaqSection/>
           <CtaSection/>
           <FooterOneSection className="tekup-footer-section dark-bg"/>
        </>
    );
};

export default PricingPage;