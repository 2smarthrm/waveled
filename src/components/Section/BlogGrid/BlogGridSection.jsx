"use client"

import Link from "next/link";
import BlogGridCard from "~/components/Ui/Cards/BlogGridCard";
import blogs from '~/db/blogGridData.json'

const BlogGridSection = () => {
    return (
        <div className="section tekup-section-padding">
        <div className="container">
          <div className="row">
          {blogs.map((blog) => (
            <BlogGridCard key={blog.id} blog={blog} />
          ))}
   
          </div>
          <div className="tekup-navigation">
            <nav className="navigation pagination center" aria-label="Posts">
              <div className="nav-links">
                <Link className="next page-numbers" href="">
                  <i className="ri-arrow-left-s-line"></i>
                </Link>
                <span aria-current="page" className="page-numbers current">1</span>
                <Link className="page-numbers" href="">2</Link>
                <Link className="page-numbers" href="">3</Link>
                <Link className="next page-numbers" href="">
                  <i className="ri-arrow-right-s-line"></i>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    );
};

export default BlogGridSection;