"use client"

import Link from "next/link";

const PricingSection = () => {
    return (
        <div className="section tekup-section-padding4">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-md-6">
              <div className="tekup-pricing-wrap all-border">
                <div className="tekup-pricing-header">
                  <h4>Startup</h4>
                  <p>Best for Startup business owners who needs website for business.</p>
                </div>
                <div className="tekup-pricing-price">
                  <h2>$99<span>/month</span></h2>
                </div>
                <Link className="tekup-pricing-btn" href="pricing">Select This Package <i className="ri-arrow-right-up-line"></i></Link>
                <div className="tekup-pricing-feature">
                  <ul>
                    <li><i className="ri-check-line"></i>10 GB disk space availability</li>
                    <li><i className="ri-check-line"></i>50 GB NVMe SSD for use</li>
                    <li><i className="ri-check-line"></i>Free platform access for all</li>
                    <li><i className="ri-check-line"></i>Free lifetime updates facility</li>
                    <li><i className="ri-check-line"></i>Free one year support</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="tekup-pricing-wrap all-border">
                <div className="tekup-pricing-header">
                  <h4>Business</h4>
                  <p>Best for Startup business owners who needs website for business.</p>
                </div>
                <div className="tekup-pricing-price">
                  <h2>$299<span>/month</span></h2>
                </div>
                <Link className="tekup-pricing-btn active" href="pricing">Select This Package <i className="ri-arrow-right-up-line"></i></Link>
                <div className="tekup-pricing-feature">
                  <ul>
                    <li><i className="ri-check-line"></i>10 GB disk space availability</li>
                    <li><i className="ri-check-line"></i>50 GB NVMe SSD for use</li>
                    <li><i className="ri-check-line"></i>Free platform access for all</li>
                    <li><i className="ri-check-line"></i>Free lifetime updates facility</li>
                    <li><i className="ri-check-line"></i>Free one year support</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="tekup-pricing-wrap all-border">
                <div className="tekup-pricing-header">
                  <h4>Enterprise</h4>
                  <p>Best for Startup business owners who needs website for business.</p>
                </div>
                <div className="tekup-pricing-price">
                  <h2>$779<span>/month</span></h2>
                </div>
                <Link className="tekup-pricing-btn" href="pricing">Select This Package <i className="ri-arrow-right-up-line"></i></Link>
                <div className="tekup-pricing-feature">
                  <ul>
                    <li><i className="ri-check-line"></i>10 GB disk space availability</li>
                    <li><i className="ri-check-line"></i>50 GB NVMe SSD for use</li>
                    <li><i className="ri-check-line"></i>Free platform access for all</li>
                    <li><i className="ri-check-line"></i>Free lifetime updates facility</li>
                    <li><i className="ri-check-line"></i>Free one year support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default PricingSection;