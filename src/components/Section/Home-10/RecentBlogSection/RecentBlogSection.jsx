import Link from "next/link";
import BlogCardTen from "~/components/Ui/Cards/BlogCardTen";
import blog from '~/db/blogCardTen.json'
const RecentBlogSection = () => {
    return (
        <div className="section tekup-section-padding">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>Our recent blog & articles</h2>
                </div>
                <div className="row">
                    {
                        blog?.map((item, idx) => <BlogCardTen key={idx} item={item}></BlogCardTen>)
                    }
                </div>
                <div className="tekup-center-btn">
                    <Link className="tekup-default-btn" href="blog">View All Posts <i className="ri-arrow-right-up-line"></i></Link>
                </div>
            </div>
        </div>
    );
};

export default RecentBlogSection;