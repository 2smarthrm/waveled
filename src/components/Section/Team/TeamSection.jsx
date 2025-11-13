"use client"

import teamData from '~/db/teamData.json'
import TeamCard from "~/components/Ui/Cards/TeamCard";

const TeamSection = () => {
    return (
        <div className="section tekup-section-padding4">
        <div className="container">
          <div className="row">
          {teamData?.map((item, index) => (
         <TeamCard item={item} key={index}/>
           ))}
          </div>
        </div>
      </div>
    );
};

export default TeamSection;