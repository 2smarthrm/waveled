import Link from "next/link";

const RecentProjectsCardFour = ({ item }) => {
    return (
        <div className="tekup-portfolio-wrap3">
            <div className="tekup-portfolio-thumb3">
                <img src={item?.image} alt="" />
                <Link className="tekup-portfolio-btn3" href="single-portfolio"><i className="ri-arrow-right-up-line"></i></Link>
            </div>
            <div className="tekup-portfolio-data3">
                <Link href="single-portfolio">
                    <h3>{item?.title}</h3>
                </Link>
                <p>{item?.category}</p>
            </div>
        </div>
    );
};

export default RecentProjectsCardFour;