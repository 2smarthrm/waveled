import Link from "next/link";

const ItSolutionSection = () => {
    return (
        <div className="section bg-light1 tekup-section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="tekup-thumb mr-30">
                            <img src="/images/v3/thumb1.png" alt="" />
                            <div className="tekup-thumb-card">
                                <img src="/images/v3/Satisfaction2.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex align-items-center">
                        <div className="tekup-default-content ml-60">
                            <h2>Exclusive technology to provide IT solutions</h2>
                            <h5>During this time, we’ve built a reputation for excellent clients satisfaction as evidenced by our</h5>
                            <p>We are architects of innovation, trailblazers of technological advancement, and partners in your success. As a dynamic and forward-thinking organization</p>
                            <div className="tekup-extra-mt">
                                <Link className="tekup-default-btn" href="about-us">More About <i className="ri-arrow-right-up-line"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItSolutionSection;