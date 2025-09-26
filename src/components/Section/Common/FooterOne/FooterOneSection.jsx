/* eslint-disable @next/next/no-img-element */
"use client"
import Link from 'next/link';
import BrandLogo from "~/components/Ui/BrandLogo/BrandLogo";

const FooterOneSection = ({className}) => {
    return (
        <footer className={className}>
        <div className="container">
            <div className="tekup-footer-top extra-padding">
                <div className="row">
                    <div className="col-xl-4 col-lg-12">
                        <div className="tekup-footer-textarea light-color">
                            <Link href="/">
                                <BrandLogo />
                            </Link>
                            <p>We are architects of innovation, trailblazers of advancement, and partners in your success. As a dynamic and forward</p>
                            <div className="tekup-footer-info">
                                <ul>
                                    <li><Link href="tel:123"><i className="ri-phone-fill" />518-564-3200</Link></li>
                                    <li><Link href="mailto:name@email.com"><i className="ri-mail-fill" />tachup@example.com</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-2 offset-xl-1 col-md-4">
                        <div className="tekup-footer-menu light-color">
                            <div className="tekup-footer-title light-color">
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
                        <div className="tekup-footer-menu light-color extar-margin">
                            <div className="tekup-footer-title light-color">
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
                    <div className="col-xl-2 col-md-4">
                        <div className="tekup-footer-menu light-color mb-0">
                            <div className="tekup-footer-title light-color">
                                <h5>Information</h5>
                            </div>
                            <ul>
                                <li><Link href="#">Working Process</Link></li>
                                <li><Link href="#">Privacy Policy</Link></li>
                                <li><Link href="#">Terms &amp; Conditions</Link></li>
                                <li><Link href="faq">Faqs</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tekup-footer-bottom">
                <div className="row">
                <div className="col-md-6">
                            <div className="tekup-copywright light-color right">
                                <p> © 2024 MthemeUs. All rights reserved.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="tekup-social-icon-box style-two right">
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
                </div>
            </div>
        </footer>
    );
};

export default FooterOneSection;