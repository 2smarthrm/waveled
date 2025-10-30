'use client'
import Link from "next/link";
import BlogCardTwo from "~/components/Ui/Cards/BlogCardTwo";
import blog from '~/db/blogCardTwo.json'
const RecentBlogSection = () => {
    return (
        <div className="section bg-light1 tekup-section-padding2">
            <div className="container">
                <div className="tekup-section-title">
                    <div className="row">
                        <div className="col-xxl-5 col-lg-6">
                            <h2>Recent blog & articles about technology</h2>
                        </div>
                        <div className="col-xxl-7 col-lg-6 d-flex align-items-center justify-content-end">
                            <div className="tekup-title-btn">
                                <Link className="tekup-default-btn" href="blog">View All Posts <i className="ri-arrow-right-up-line"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {blog.map(item => (
                        <BlogCardTwo key={item.id} item={item} className="col-lg-4" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentBlogSection;