import FooterNineSection from "~/components/Section/Common/FooterNine/FooterNineSection";
import HeaderSeven from "~/components/Section/Common/Header/HeaderSeven";
import HeroSection from "~/components/Section/Home-9/HeroSection";
import ItSolutionSection from "~/components/Section/Home-9/ItSolutionSection";
import RecentBlogSection from "~/components/Section/Home-9/RecentBlogSection";
import RecentProjectsSection from "~/components/Section/Home-9/RecentProjectsSection";
import SuccessRatesSection from "~/components/Section/Home-9/SuccessRatesSection/SuccessRatesSection";
import TeamSection from "~/components/Section/Home-9/TeamSection";
import TestimonialSection from "~/components/Section/Home-9/TestimonialSection";
import ServiceSection from "~/components/Section/Home-9/ServiceSection";

const HomeNine = () => {
  return (
    <div>
      <HeaderSeven />
      <HeroSection />
      <ServiceSection />
      <ItSolutionSection />
      <TeamSection />
      <SuccessRatesSection />
      <RecentProjectsSection />
      <TestimonialSection />
      <RecentBlogSection />
      <FooterNineSection />
    </div>
  );
};

export default HomeNine;
