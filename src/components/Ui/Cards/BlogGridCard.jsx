"use client"

import Link from "next/link";

const BlogGridCard = ({blog}) => {
    return ( 
        <div className="col-xl-4 col-md-6 ">
        <div className="tekup-blog-wrap ">
          <Link href={`/single-blog`}>
            <div className="tekup-blog-thumb">
              <img src={blog.image} alt={blog.title} />
            </div>
          </Link>
          <div className="tekup-blog-content">
            <div className="tekup-blog-meta">
              <ul>
                <li>
                  <Link href={`blog`}>
                    {blog.tag}
                  </Link>
                </li>
                <li>{blog.date}</li>
              </ul>
            </div>
            <Link href={`/single-blog`}>
              <h3>{blog.title}</h3>
            </Link>
            <Link className="tekup-blog-btn" href={`/single-blog`}>
              Read More <i className="ri-arrow-right-up-line"></i>
            </Link>
          </div>
        </div>
        </div>
    );
};

export default BlogGridCard;