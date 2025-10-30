import ExperienceSection from "~/components/Section/Home-2/ExperienceSection";
import HeroSection from "~/components/Section/Home-2/HeroSection";
import ItSolutionSection from "~/components/Section/Home-2/ItSolutionSection";
import PricingSection from "~/components/Section/Home-2/PricingSection";
import RecentBlogSection from "~/components/Section/Home-2/RecentBlogSection";
import RecentProjectsSection from "~/components/Section/Home-2/RecentProjectsSection";
import TestimonialSection from "~/components/Section/Home-7/TestimonialSection";
import ServiceSection from "~/components/Section/Home-2/ServiceSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import FooterTwo from "~/components/Section/Common/FooterTwo";

const HomeTwo = () => {
    return (
        <div>
            <HeaderTwo className="tekup-header-top bg-light1 "/>
            <HeroSection />
            <ItSolutionSection />
            <ExperienceSection />
            <ServiceSection />
            <RecentProjectsSection />
            <PricingSection />
            <TestimonialSection />
            <RecentBlogSection />
            <FooterTwo/>
        </div>
    );
};

export default HomeTwo;