import CtaSection from "~/components/Section/Common/Cta/CtaSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import TestimonialSection from "~/components/Section/Testimonial/TestimonialSection";
import FooterFour from '~/components/Section/Common/FooterFour';


const page = () => {
    return (
      <>
        <HeaderTwo className="tekup-header-top bg-light1 "/>
        <PageHeader title="Testimonials"/>
        <TestimonialSection/>
        <CtaSection/>
        <FooterFour/>
      </>
    );
};

export default page;