import Link from "next/link";

const HeroSection = () => {
    return (
        <div className="tekup-hero-section5" style={{ backgroundImage: 'url(/images/hero/hero-bg4.png)' }}>
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 d-flex align-items-center">
                        <div className="tekup-hero-content white-color">
                            <h1>Affordable big IT & technology solutions</h1>
                            <p>We are architects of innovation, trailblazers of advancement, and partners in your success. As a dynamic and forward</p>
                            <div className="tekup-extra-mt">
                                <Link className="tekup-default-btn tekup-white-btn" href="">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-5 offset-xl-2 offset-lg-1">
                        <div className="tekup-hero-form">
                            <h3>Fill The Contact Form</h3>
                            <p>Get Free Consultation For IT Solutions</p>
                            <form action="#">
                                <div className="tekup-main-field">
                                    <input type="text" placeholder="Your name" />
                                </div>
                                <div className="tekup-main-field">
                                    <input type="email" placeholder="Email address" />
                                </div>
                                <div className="tekup-main-field">
                                    <textarea name="textarea" placeholder="Write your message"></textarea>
                                </div>
                                <button id="tekup-main-form-btn" type="button">Send Message <i className="ri-arrow-right-up-line"></i></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;