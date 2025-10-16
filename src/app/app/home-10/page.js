import React from "react";
import BrandSection from "~/components/Section/Common/BrandSection";
import CtaSection from "~/components/Section/Common/Cta/CtaSection";
import FooterTenScetion from "~/components/Section/Common/FooterTen/FooterTenScetion";
import HeaderEight from "~/components/Section/Common/Header/HeaderEight";
import AccordionSection from "~/components/Section/Home-10/AccordionSection";
import ChooseSection from "~/components/Section/Home-10/ChooseSection";
import HeroSection from "~/components/Section/Home-10/HeroSection";
import ItSolutionSection from "~/components/Section/Home-10/ItSolutionSection";
import LetsBuildSection from "~/components/Section/Home-10/LetsBuildSection";
import PricingSection from "~/components/Section/Home-10/PricingSection";
import RecentBlogSection from "~/components/Section/Home-10/RecentBlogSection/RecentBlogSection";
import ServiceSliderSection from "~/components/Section/Home-10/ServiceSliderSection";

const HomeTen = () => {
  return (
    <div>
      <HeaderEight />
      <HeroSection />
      <ChooseSection />
      <ItSolutionSection />
      <ServiceSliderSection />
      <LetsBuildSection />
      <BrandSection />
      <PricingSection />
      <CtaSection />
      <AccordionSection />
      <RecentBlogSection />
      <FooterTenScetion />
    </div>
  );
};

export default HomeTen;
