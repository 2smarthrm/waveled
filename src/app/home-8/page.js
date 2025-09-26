import FooterEight from "~/components/Section/Common/FooterEight";
import HeaderSix from "~/components/Section/Common/Header/HeaderSix";
import HeroSection from "~/components/Section/Home-8/HeroSection";
import ItSolutionSection from "~/components/Section/Home-8/ItSolutionSection";
import LetsBuildSection from "~/components/Section/Home-8/LetsBuildSection";
import PricingSection from "~/components/Section/Home-8/PricingSection";
import RecentBlogSection from "~/components/Section/Home-8/RecentBlogSection";
import RecentProjectsSection from "~/components/Section/Home-8/RecentProjectsSection";
import ServiceSection from "~/components/Section/Home-8/ServiceSection";

const HomeEight = () => {
  return (
    <div>
      <HeaderSix />
      <HeroSection />
      <ServiceSection />
      <ItSolutionSection />
      <RecentProjectsSection />
      <LetsBuildSection />
      <PricingSection />
      <RecentBlogSection />
      <FooterEight />
    </div>
  );
};

export default HomeEight;
