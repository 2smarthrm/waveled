import Link from "next/link";

const RecentProjectsCardFour = ({ item }) => {
    const BaseUrl = "https://waveledserver.vercel.app";

    return (
        <div className="tekup-portfolio-wrap3">
            <div className="tekup-portfolio-thumb3">
                <img style={{maxHeight:"250px", minHeight:"250px"}} src={item?.wl_images.length > 0 ? BaseUrl + item?.wl_images[0]  : ""  } alt="" />
                <Link className="tekup-portfolio-btn3" href="single-portfolio"><i className="ri-arrow-right-up-line"></i></Link>
            </div>
            <div className="tekup-portfolio-data3">
                <Link href="single-portfolio">
                    <h3>{item?.wl_title}</h3>
                </Link>
                <p>{item?.wl_company_name}</p>
            </div>
        </div> 
    );
};

export default RecentProjectsCardFour;