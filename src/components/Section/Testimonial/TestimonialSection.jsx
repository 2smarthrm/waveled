"use client"

import TestimonialsCard from "~/components/Ui/Cards/TestimonialsCard";
import teamMembers from '~/db/testimonialData.json'

const TestimonialSection = () => {
    return (
        <div className="section tekup-section-padding4">
    <div className="container">
      <div className="row">
      {teamMembers.map(member => (
        <TestimonialsCard key={member.id} member={member} className="col-xl-4 col-md-6"/>
      ))}
      </div>
    </div>
  </div>
    );
};

export default TestimonialSection;