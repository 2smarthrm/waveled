import AboutSection from "~/components/Section/AboutUs/AboutSection";
import FactSection from "~/components/Section/Common/Fact/FactSection";
import PageHeader from "~/components/Section/Common/PageHeader";
import ContentSection from "~/components/Section/AboutUs/ContentSection";
import TeamSection from "~/components/Section/AboutUs/TeamSection";
import TestimonialSection from "~/components/Section/AboutUs/TestimonialSection/TestimonialSection";
import ContactSection from "~/components/Section/AboutUs/ContactSection";
import CtaSection from "~/components/Section/Common/Cta/CtaSection";
import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";


const Aboutpage = () => {
    return (
        <>
      <title>Sobre nós</title>
        <HeaderFour className="tekup-header-top bg-light1 "/> 
        <br /><br /><br />
      <AboutSection/>
      <ContentSection />
      <FactSection/>  
      <br /><br />
      <CtaSection/>
      <FooterFour className="tekup-footer-section dark-bg"/>
        </>
    );
};

export default Aboutpage;