/* eslint-disable @next/next/no-img-element */
"use client";
import Link from 'next/link';
import BrandLogo from "~/components/Ui/BrandLogo/BrandLogo";

const FooterThreeSection = () => {
    return (
        <footer className="tekup-footer-section">
            <div className="container">
                <div className="tekup-footer-top tekup-section-padding">
                    <div className="row">
                        <div className="col-xl-3 col-lg-12">
                            <div className="tekup-footer-textarea">
                                <Link href="/">
                                    <BrandLogo logoImage="/images/logo/logo-dark.svg" />
                                </Link>
                                <p>We are architects of advancement, and partners in your success. As a dynamic forward</p>
                                <div className="tekup-social-icon-box style-three">
                                    <ul>
                                        <li>
                                            <Link href="https://www.facebook.com/">
                                                <i className="ri-facebook-fill" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="https://www.linkedin.com/">
                                                <i className="ri-linkedin-fill" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="https://twitter.com/">
                                                <i className="ri-twitter-fill" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="https://www.instagram.com/">
                                                <i className="ri-instagram-fill" />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-2 offset-xl-1 col-md-3">
                            <div className="tekup-footer-menu">
                                <div className="tekup-footer-title">
                                    <h5>Quick Links</h5>
                                </div>
                                <ul>
                                    <li><Link href="about-us">About Us</Link></li>
                                    <li><Link href="team">Our Team</Link></li>
                                    <li><Link href="pricing">Pricing</Link></li>
                                    <li><Link href="blog">Blogs</Link></li>
                                    <li><Link href="contact-us">Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-4">
                            <div className="tekup-footer-menu extar-margin">
                                <div className="tekup-footer-title">
                                    <h5>Services</h5>
                                </div>
                                <ul>
                                    <li><Link href="#">UI/UX Design</Link></li>
                                    <li><Link href="#">App Development</Link></li>
                                    <li><Link href="#">Digital Marketing</Link></li>
                                    <li><Link href="#">Web Development</Link></li>
                                    <li><Link href="#">Cyber Security</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-5">
                        <div className="tekup-footer-title">
                                <h5>Subscribe Our Newsletter</h5>
                                <p>Get ready to work together for the better solution for your business</p>
                            </div>
                            <div className="tekup-subscription two">
                                <form action="#">
                                    <input type="email" placeholder="Enter your email" />
                                    <button id="tekup-subscription-btn" type="button">
                                        <i className="ri-send-plane-fill" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tekup-footer-bottom dark">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="tekup-copywright right">
                                <p> © 2024 MthemeUs. All rights reserved.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="tekup-footer-menu style-two right mb-0">
                                <ul>
                                    <li><Link href="#">Privacy Policy</Link></li>
                                    <li><Link href="#">Terms &amp; Conditions</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterThreeSection;