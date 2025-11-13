import CtaSection from "~/components/Section/Common/Cta/CtaSection";
import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import SingleServiceSection from "~/components/Section/SingleService/SingleServiceSection";

const SingleServicePage = () => {
    return (
        
        <>
          <HeaderTwo className="tekup-header-top bg-light1 "/>
        <PageHeader title="Web Development"/>
        <SingleServiceSection/>
        <CtaSection/>
        <FooterOneSection className="tekup-footer-section dark-bg"/>
            
        </>
    );
};

export default SingleServicePage;