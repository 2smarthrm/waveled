import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
    return (
        <div className="tekup-hero-section10 bg-light1">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7">
                        <div className="tekup-hero-content dark-color">
                            <h1>Software crafting for digital success</h1>
                            <p>We are architects innovation, trailblazers technological advancement, and partners in your success.</p>
                            <div className="tekup-extra-mt">
                                <Link className="tekup-default-btn" href="">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
                            </div>
                            <div className="tekup-hero-rating dark-color">
                                <img   className="tekup-hero-author" src="/images/v1/author.png" alt="" />
                                <p>Avg rating 4.8 out of 5.0</p>
                                <ul>
                                    <li><i className="ri-star-s-fill"></i></li>
                                    <li><i className="ri-star-s-fill"></i></li>
                                    <li><i className="ri-star-s-fill"></i></li>
                                    <li><i className="ri-star-s-fill"></i></li>
                                    <li><i className="ri-star-s-fill"></i></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;