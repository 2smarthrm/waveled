'use client'
import Link from "next/link";
import RecentProjectsCardNine from "~/components/Ui/Cards/RecentProjectsCardNine";
import projects from '~/db/recentProjectsNine.json'
const RecentProjectsSection = () => {
    return (
        <div className="section bg-light1 tekup-section-padding">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>Explore our recent projects</h2>
                </div>
                <div className="row">
                    {projects.map((item, idx) => (
                        <RecentProjectsCardNine key={idx} item={item} />
                    ))}
                </div>
                <div className="tekup-center-btn">
                    <Link className="tekup-default-btn" href="portfolio-01">View All Projects <i className="ri-arrow-right-up-line"></i></Link>
                </div>
            </div>
        </div>
    );
};

export default RecentProjectsSection;