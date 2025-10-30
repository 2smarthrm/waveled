import Link from "next/link";
import RecentProjectsCardFive from "~/components/Ui/Cards/RecentProjectsCardFive";
import projects from '~/db/recentProjectsFive.json'
const RecentProjectsSection = () => {
    return (
        <div className="section tekup-section-padding">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>Explore our recent projects</h2>
                </div>
                <div className="row">
                    {
                        projects?.map((item, idx) => <RecentProjectsCardFive key={idx} item={item}></RecentProjectsCardFive>)
                    }
                </div>
                <div className="tekup-center-btn">
                    <Link className="tekup-default-btn" href="portfolio-01">View All Projects <i className="ri-arrow-right-up-line"></i></Link>
                </div>
            </div>
        </div>
    );
};

export default RecentProjectsSection;