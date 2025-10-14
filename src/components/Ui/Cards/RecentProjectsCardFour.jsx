import Link from "next/link";

const RecentProjectsCardFour = ({ item }) => {
    const BaseUrl = "https://waveledserver.vercel.app";

    return (
        <div className="tekup-portfolio-wrap3">
            <div className="tekup-portfolio-thumb3">
                <img style={{maxHeight:"400px", minHeight:"400px", width:"100%", objectFit:"cover"}} src={item?.wl_images.length > 0 ? BaseUrl + item?.wl_images[0]  : ""  } alt="" />
                <Link className="tekup-portfolio-btn3" href={`single-portfolio?project=${item?._id}`}><i className="ri-arrow-right-up-line"></i></Link>
            </div>
            <div className="tekup-portfolio-data3">
                <Link href={`single-portfolio?project=${item?._id}`}>
                    <h3>{item?.wl_title.split("").length > 65 ?  item?.wl_title?.substring(0, 65)+ "..." : item?.wl_title}</h3>
                </Link>
                <p>{item?.wl_company_name}</p>
            </div>
        </div> 
    );
};

export default RecentProjectsCardFour;