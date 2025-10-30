import AccordionSection from '~/components/Section/Home-4/AccordionSection';
import HeroSection from '~/components/Section/Home-4/HeroSection';
import ItSolutionSection from '~/components/Section/Home-4/ItSolutionSection';
import TestimonialSection from "~/components/Section/Home-7/TestimonialSection";
import ServiceSection from '~/components/Section/Home-4/ServiceSection';
import WorkProcess from '~/components/Section/Common/WorkProcess';
import RecentProjectsSection from '~/components/Section/Home-4/RecentProjectsSection';
import HeaderFour from '~/components/Section/Common/Header/HeaderFour';
import FooterFour from '~/components/Section/Common/FooterFour';
import CtaThreeSection from '~/components/Section/Common/CtaThree/CtaThreeSection';


const HomeFour = () => { 
    return (
        <div>
            <HeaderFour/>
            <HeroSection /> 
            <ServiceSection/>
            <ItSolutionSection /> 
            <WorkProcess/>
            <RecentProjectsSection />
            <TestimonialSection />
            <AccordionSection />
            <CtaThreeSection/>
            <FooterFour/>
        </div>
    );
};

export default HomeFour;