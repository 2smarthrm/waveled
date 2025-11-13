import Link from "next/link";

const ItSolutionSection = () => {
    return (
        <div className="section tekup-section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="tekup-thumb mr-30">
                            <img src="/images/v5/thumb1.png" alt="" />
                            <div className="tekup-thumb-card">
                                <img src="/images/v3/rating.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex align-items-center">
                        <div className="tekup-default-content ml-60">
                            <h2>We make awesome IT services for your business</h2>
                            <p>We are architects of innovation, trailblazers of technological advancement, and partners in your success. As a dynamic and forward-thinking organization</p>
                            <div className="tekup-icon-list-wrap2">
                                <div className="tekup-icon-list-item2">
                                    <div className="tekup-icon-list-icon2">
                                        <img src="/images/iconbox/icon8.png" alt="" />
                                    </div>
                                    <div className="tekup-icon-list-data2">
                                        <p>Highly Expert
                                            Team Members</p>
                                    </div>
                                </div>
                                <div className="tekup-icon-list-item2">
                                    <div className="tekup-icon-list-icon2">
                                        <img src="/images/iconbox/icon9.png" alt="" />
                                    </div>
                                    <div className="tekup-icon-list-data2">
                                        <p>Urgent Support
                                            for Clients</p>
                                    </div>
                                </div>
                            </div>
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