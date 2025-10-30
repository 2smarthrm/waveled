import Link from "next/link";

const RecentProjectsCardFive = ({item}) => {
    return (
        <div className="col-xl-4 col-md-6">
            <div className="tekup-portfolio-wrap4">
                <div className="tekup-portfolio-thumb4">
                    <img src={item?.image} alt="" />
                    <div className="tekup-portfolio-data4">
                        <Link href="single-portfolio">
                            <h5>{item?.title}</h5>
                        </Link>
                        <p>{item?.category}</p>
                        <Link className="tekup-portfolio-btn4" href="single-portfolio"><i className="ri-arrow-right-up-line"></i></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentProjectsCardFive;