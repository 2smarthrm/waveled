'use client';

import Link from "next/link";
import BlogCardSIx from "~/components/Ui/Cards/BlogCardSIx";
import blog from '~/db/blogCardSix.json'
const RecentBlogSection = () => {
    return (
        <div className="section bg-light1 tekup-section-padding">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>Our recent blog & articles</h2>
                </div>
                <div className="row">
                    {
                        blog?.map((item, idx) => <BlogCardSIx key={idx} item={item}></BlogCardSIx>)
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