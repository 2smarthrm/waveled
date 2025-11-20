'use client';
import Link from "next/link";
import TeamCard from "~/components/Ui/Cards/TeamCard";
import teams from '~/db/teamCard.json'
const TeamSection = () => {
    return (
        <div className="section bg-light1 tekup-section-padding2">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>Meet the team behind techverse</h2>
                </div>
                <div className="row">
                    {
                        teams?.map((item, idx) => <TeamCard key={idx} item={item}></TeamCard>)
                    }
                </div>
            </div>
        </div>
    );
};

export default TeamSection;