import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import PageHeader from "~/components/Section/Common/PageHeader";
import ContactSection from "~/components/Section/Contact/ContactSection";
import MapSection from "~/components/Section/Contact/MapSection";

const ContactPage = () => {

    return (
        <>
          <title>Contatos</title>
        <HeaderFour className="tekup-header-top bg-light1 "/> 
            <br /><br /> 
           <ContactSection/>
           <MapSection/>
            <FooterFour />
        </>
    );
};

export default ContactPage ;