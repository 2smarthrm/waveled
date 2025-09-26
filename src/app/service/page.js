import ChooseUsSection from "~/components/Section/Common/ChooseUs/ChooseUsSection";
import CtaSection from "~/components/Section/Common/Cta/CtaSection";
import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import WorkProcessSection from "~/components/Section/Common/WorkProcess/WorkProcessSection";
import ServiceSection from "~/components/Section/Service/ServiceSection";

const ServicePage = () => {
    return (
        <div>
            <HeaderTwo className="tekup-header-top bg-light1 "/>
            <PageHeader title="Our Services"/>
            <ChooseUsSection className="section tekup-section-padding4"/>
            <ServiceSection/>
            <WorkProcessSection/>
            <CtaSection/>
            <FooterOneSection className="tekup-footer-section dark-bg"/>
        </div>
    );
};

export default ServicePage ;