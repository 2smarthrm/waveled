
import BrandSection from '~/components/Section/Common/BrandSection';
import HeroSection from '~/components/Section/Home-6/HeroSection';
import ItSolutionSection from '~/components/Section/Home-6/ItSolutionSection';
import LetsBuildSection from '~/components/Section/Home-6/LetsBuildSection';
import RecentBlogSection from '~/components/Section/Home-6/RecentBlogSection';
import RecentProjectsSection from '~/components/Section/Home-6/RecentProjectsSection';
import SuccessRatesSection from '~/components/Section/Home-6/SuccessRatesSection';
import TestimonialSection from '~/components/Section/Home-6/TestimonialSection';
import ServiceSlideSection from '~/components/Section/Home-6/ServiceSlideSection';
import HeaderTwo from '~/components/Section/Common/Header/HeaderTwo';
import FooterSix from '~/components/Section/Common/FooterSix';

const HomeSix = () => {
    return (
        <div>
            <HeaderTwo className="d-none "/>
            <HeroSection />
            <BrandSection />
            <ServiceSlideSection />
            <ItSolutionSection />
            <SuccessRatesSection />
            <RecentProjectsSection />
            <TestimonialSection />
            <LetsBuildSection />
            <RecentBlogSection />
            <FooterSix />
        </div>
    );
};

export default HomeSix;