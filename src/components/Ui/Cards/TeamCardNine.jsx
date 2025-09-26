import Link from "next/link";

const TeamCardNine = ({item}) => {
    return (
        <div className="tekup-team-wrap">
            <div className="tekup-team-thumb">
                <img src={item?.image} alt="" />
                <div className="tekup-social-icon-box style-four position">
                    <ul>
                        <li>
                            <Link href="https://www.linkedin.com/">
                                <i className="ri-linkedin-fill"></i>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://twitter.com/">
                                <i className="ri-twitter-fill"></i>
                            </Link>
                        </li>
                        <li>
                            <Link href="https://www.instagram.com/">
                                <i className="ri-instagram-fill"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="tekup-team-data tekup-team-data2">
                <Link href="single-team">
                    <h5>{item?.name}</h5>
                </Link>
                <p>{item?.position}</p>
            </div>
        </div>
    );
};

export default TeamCardNine;