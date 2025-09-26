import Link from "next/link";


const FooterTenScetion = () => {
    return (
        <footer className="tekup-footer-section bg-light1">
        <div class="container">
          <div class="tekup-infobox-wrap extra-padding">
            <div class="row">
              <div class="col-xl-4 col-md-6">
                <Link href="tel:123">
                  <div class="tekup-infobox-item bg-white">
                    <div class="tekup-infobox-icon">
                      <i class="ri-phone-fill"></i>
                    </div>
                    <div class="tekup-infobox-data dark-color">
                      <p>Call anytime</p>
                      <h5>518-564-3200</h5>
                    </div>
                  </div>
                </Link>
              </div>
              <div class="col-xl-4 col-md-6">
                <Link href="mailto:name@email.com">
                  <div class="tekup-infobox-item bg-white">
                    <div class="tekup-infobox-icon">
                      <i class="ri-mail-fill"></i>
                    </div>
                    <div class="tekup-infobox-data dark-color">
                      <p>Email address</p>
                      <h5>tachup@example.com</h5>
                    </div>
                  </div>
                </Link>
              </div>
              <div class="col-xl-4 col-md-6">
                <div class="tekup-infobox-item bg-white">
                  <div class="tekup-infobox-icon">
                    <i class="ri-time-fill"></i>
                  </div>
                  <div class="tekup-infobox-data dark-color">
                    <p>Office Hours</p>
                    <h5>8:00 AM – 10:00 PM</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tekup-footer-top tekup-section-padding-bottom">
            <div class="row">
              <div class="col-xl-4 offset-xl-1 col-lg-4 order-lg-4">
                <div class="tekup-footer-title">
                  <h5>Subscribe Our Newsletter</h5>
                  <p>Get ready to work together for the better solution for your business</p>
                </div>
                <div class="tekup-subscription two">
                  <form action="#">
                    <input type="email" placeholder="Enter your email"/>
                    <button id="tekup-subscription-btn" type="button">
                      <i class="ri-send-plane-fill"></i>
                    </button>
                  </form>
                </div>
                <div class="tekup-social-icon dark-color m_bottom">
                  <ul>
                    <li>
                      <Link href="https://www.facebook.com/">
                        <i class="ri-facebook-fill"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.linkedin.com/">
                        <i class="ri-linkedin-fill"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://twitter.com/">
                        <i class="ri-twitter-fill"></i>
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.instagram.com/">
                        <i class="ri-instagram-fill"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-xl-2 col-lg-2 col-md-4">
                <div class="tekup-footer-menu">
                  <div class="tekup-footer-title">
                    <h5>Quick Links</h5>
                  </div>
                  <ul>
                    <li><Link href="about-usl">About Us</Link></li>
                    <li><Link href="teaml">Our Team</Link></li>
                    <li><Link href="pricingl">Pricing</Link></li>
                    <li><Link href="blogl">Blogs</Link></li>
                    <li><Link href="contact-usl">Contact Us</Link></li>
                  </ul>
                </div>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-4">
                <div class="tekup-footer-menu extar-margin">
                  <div class="tekup-footer-title">
                    <h5>Services</h5>
                  </div>
                  <ul>
                    <li><Link href="">UI/UX Design</Link></li>
                    <li><Link href="">App Development</Link></li>
                    <li><Link href="">Digital Marketing</Link></li>
                    <li><Link href="">Web Development</Link></li>
                    <li><Link href="">Cyber Security</Link></li>
                  </ul>
                </div>
              </div>
              <div class="col-xl-2 col-lg-3 col-md-4">
                <div class="tekup-footer-menu mb-0">
                  <div class="tekup-footer-title">
                    <h5>Information</h5>
                  </div>
                  <ul>
                    <li><Link href="">Working Process</Link></li>
                    <li><Link href="">Privacy Policy</Link></li>
                    <li><Link href="">Terms & Conditions</Link></li>
                    <li><Link href="faql">Faqs</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="tekup-footer-bottom center dark">
            <div class="tekup-copywright">
              <p> &copy; 2024 MthemeUs. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    );
};

export default FooterTenScetion;