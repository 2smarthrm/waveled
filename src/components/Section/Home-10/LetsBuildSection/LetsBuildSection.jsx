
const LetsBuildSection = () => {
    return (
        <div className="tekup-portfolio-section bg-light1 tekup-section-padding-top">
            <div className="container">
                <div className="tekup-section-title center light-color">
                    <h2>Let’s build an awesome project together</h2>
                </div>
                <div className="tekup-map-form-wrap bg-white">
                    <div className="row">
                        <div className="col-lg-7 d-flex align-items-center">
                            <div className="tekup-main-form border-0">
                                <h3>Fill The Contact Form</h3>
                                <p>Feel free to contact with us, we don’t spam your email</p>
                                <form action="#">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="tekup-main-field">
                                                <input type="text" placeholder="Your name" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="tekup-main-field">
                                                <input type="number" placeholder="Phone number" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="tekup-main-field">
                                                <input type="email" placeholder="Email address" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="tekup-main-field">
                                                <textarea name="textarea" placeholder="Write your message"></textarea>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <button id="tekup-main-form-btn" type="button">Send Message <i className="ri-arrow-right-up-line"></i></button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="tekup-map-one">
                                <div id="map"> <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4562.753041141002!2d-118.80123790098536!3d34.152323469614075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e82469c2162619%3A0xba03efb7998eef6d!2sCostco+Wholesale!5e0!3m2!1sbn!2sbd!4v1562518641290!5m2!1sbn!2sbd"
            width="100%" height="100%" className="" allowfullscreen></iframe></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LetsBuildSection;