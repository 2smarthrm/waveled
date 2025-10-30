
import HeroSection from '~/components/Section/Home-5/HeroSection/HeroSection';
import ItSolutionSection from '~/components/Section/Home-5/ItSolutionSection';
import PricingSection from '~/components/Section/Home-5/PricingSection';
import RecentBlogSection from '~/components/Section/Home-5/RecentBlogSection';
import TeamSection from '~/components/Section/Home-5/TeamSection';
import ServiceSection from '~/components/Section/Home-5/ServiceSection';
import FactSection from '~/components/Section/Common/Fact/FactSection';
import RecentProjectsSection from '~/components/Section/Home-5/RecentProjectsSection';
import Header from '~/components/Section/Common/Header/Header';
import FooterFiveScetion from '~/components/Section/Common/FooterFive/FooterFiveScetion';

const HomeFive = () => {
    return (
        <div>
            <Header/>
            <HeroSection />
            <ItSolutionSection />
            <ServiceSection />
            <FactSection />
            <RecentProjectsSection />
            <TeamSection />
            <PricingSection />
            <RecentBlogSection />
         <FooterFiveScetion/>
        </div>
    );
};

export default HomeFive;