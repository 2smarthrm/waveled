import Link from "next/link";

const BlogCardNine = ({ item }) => {
    return (
        <div className="col-xl-4 col-md-6">
            <div className="tekup-blog-wrap bg-white border-0">
                <Link href="single-blog">
                    <div className="tekup-blog-thumb">
                        <img src={item?.image} alt="" />
                    </div>
                </Link>
                <div className="tekup-blog-content">
                    <div className="tekup-blog-meta">
                        <ul>
                            <li><Link href="single-blog">{item?.category}</Link></li>
                            <li><Link href="single-blog">{item?.date}</Link></li>
                        </ul>
                    </div>
                    <Link href="single-blog">
                        <h3>{item?.title}</h3>
                    </Link>
                    <Link className="tekup-blog-btn" href="single-blog">Read More <i className="ri-arrow-right-up-line"></i></Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCardNine;