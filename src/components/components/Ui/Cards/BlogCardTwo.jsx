import Link from "next/link";

const BlogCardTwo = ({ item }) => {
    return (
        <div className="col-xl-4 col-md-6">
            <div className="tekup-blog-wrap2">
                <div className="tekup-blog-thumb2">
                    <img src={item?.image} alt="" />
                    <div className="tekup-blog-content2">
                        <Link href="single-blog">
                            <h3>{item?.title}</h3>
                        </Link>
                        <div className="tekup-blog-meta tekup-blog-meta2">
                            <ul>
                                <li><Link href="single-blog">{item?.category}</Link></li>
                                <li><Link href="single-blog">{item?.date}</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCardTwo;