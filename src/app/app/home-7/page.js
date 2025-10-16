import React from "react";
import CtaSection from "~/components/Section/Common/Cta/CtaSection";
import FooterSeven from "~/components/Section/Common/FooterSeven";
import HeaderFive from "~/components/Section/Common/Header/HeaderFive";
import WorkProcessSection from "~/components/Section/Common/WorkProcess/WorkProcessSection";
import AccordionSection from "~/components/Section/Home-7/AccordionSection";
import HeroSection from "~/components/Section/Home-7/HeroSection";
import ItSolutionSection from "~/components/Section/Home-7/ItSolutionSection";
import RecentProjectsSection from "~/components/Section/Home-7/RecentProjectsSection";
import ServiceSlideSection from "~/components/Section/Home-7/ServiceSlideSection";
import TeamSection from "~/components/Section/Home-7/TeamSection";
import TestimonialSection from "~/components/Section/Home-7/TestimonialSection";

const HomeSeven = () => {
  return (
    <div>
      <HeaderFive />
      <HeroSection />
      <WorkProcessSection />
      <ItSolutionSection />
      <ServiceSlideSection />
      <RecentProjectsSection />
      <TestimonialSection />
      <TeamSection />
      <AccordionSection />
      <CtaSection />
      <FooterSeven />
    </div>
  );
};

export default HomeSeven;
