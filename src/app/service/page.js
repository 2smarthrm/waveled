import ChooseUsSection from "~/components/Section/Common/ChooseUs/ChooseUsSection";
import CtaSection from "~/components/Section/Common/Cta/CtaSection";
import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import WorkProcessSection from "~/components/Section/Common/WorkProcess/WorkProcessSection";
import ServiceSection from "~/components/Section/Service/ServiceSection";
import HeaderFour from '~/components/Section/Common/Header/HeaderFour';
import FooterFour from '~/components/Section/Common/FooterFour';

const ServicePage = () => { 
    return ( 
        <div>
            <HeaderFour />  
                    <title>Serviços</title>
            <ChooseUsSection className="section bg-black services-section tekup-section-padding4 mt-0 "/>
            <div className="service-area">
                <ServiceSection/>
            </div> 
            <CtaSection/>
            <FooterFour />
        </div> 
    );
};

export default ServicePage ; 