import Link from "next/link";

const HeroSection = () => {
    return (
        <div className="tekup-hero-section9 bg-light1" style={{ backgroundImage: 'url(/images/v9/bg.png)' }}>
            <div className="container">
                <div className="tekup-hero-content small-mw dark-color large-content center">
                    <h5>We provide professional IT services</h5>
                    <h1>Affordable big IT & technology solutions</h1>
                    <p>We are architects of innovation, trailblazers technological advancement, and partners in your success. As a dynamic and forward</p>
                    <div className="tekup-extra-mt">
                        <div className="tekup-hero-btn-wrap center">
                            <Link className="tekup-default-btn" href="">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
                            <Link className="tekup-default-btn outline-btn-dark" href="">Our Works <i className="ri-arrow-right-up-line"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tekup-hero-thumb1">
                <img src="/images/v9/thumb1.png" alt="" />
            </div>
            <div className="tekup-hero-thumb2">
                <img src="/images/v9/thumb2.png" alt="" />
            </div>
            <div className="tekup-hero-thumb3">
                <img src="/images/v9/thumb3.png" alt="" />
            </div>
            <div className="tekup-hero-thumb4">
                <img src="/images/v9/thumb4.png" alt="" />
            </div>
        </div>
    );
};

export default HeroSection;