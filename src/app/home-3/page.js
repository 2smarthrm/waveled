
import BrandSection from '~/components/Section/Common/BrandSection/BrandSection';
import ChooseUsSection from '~/components/Section/Home-3/ChooseUsSection';
import HeroSection from '~/components/Section/Home-3/HeroSection';
import ItSolutionSection from '~/components/Section/Home-3/ItSolutionSection';
import LetsBuildSection from '~/components/Section/Home-3/LetsBuildSection';
import RecentBlogSection from '~/components/Section/Home-3/RecentBlogSection';
import RecentProjectsSection from '~/components/Section/Home-3/RecentProjectsSection/RecentProjectsSection';
import SuccessRatesSection from '~/components/Section/Home-3/SuccessRatesSection';
import ServiceSlideSection from '~/components/Section/Home-3/ServiceSlideSection';
import HeaderThree from '~/components/Section/Common/Header/HeaderThree';
import FooterThreeSection from '~/components/Section/Common/FooterThree/FooterThreeSection';

const HomeThree = () => {
    return (
        <div>
            <HeaderThree/>
            <HeroSection />
            <ChooseUsSection />
            <ItSolutionSection />
            <ServiceSlideSection/>
            <SuccessRatesSection />
            <RecentProjectsSection />
            <BrandSection />
            <LetsBuildSection />
            <RecentBlogSection />
            <FooterThreeSection/>
        </div>
    );
};

export default HomeThree;