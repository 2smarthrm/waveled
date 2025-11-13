import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
    return (
        <div className="tekup-hero-section3 bg-light1">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 d-flex align-items-center">
                        <div className="tekup-hero-content dark-color">
                            <h5>We provide professional IT services</h5>
                            <h1>Best IT services for your success</h1>
                            <p>We are architects of innovation, trailblazers technological advancement, and partners in your success. As a dynamic and forward</p>
                            <div className="tekup-extra-mt">
                                <div className="tekup-hero-btn-wrap">
                                    <Link className="tekup-default-btn" href="contact-us">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
                                    <Link className="tekup-default-btn outline-btn-dark" href="portfolio-01">Our Works <i className="ri-arrow-right-up-line"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tekup-hero-thumb">
                            <img   src="/images/v3/hero-thumb.png" alt="" />
                            <div className="tekup-client-rating">
                                <img   src="/images/v3/rating.png" alt="" />
                            </div>
                            <div className="tekup-client-satisfaction">
                                <img   src="/images/v3/Satisfaction.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HeroSection;