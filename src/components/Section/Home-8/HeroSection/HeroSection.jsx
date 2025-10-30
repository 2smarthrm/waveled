'use client';

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Link from "next/link";

const HeroSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById("counter-home-eight");
            if (section) {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
                setIsVisible(isVisible);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <div className="tekup-hero-section8 dark-bg">
            <div className="container">
                <div className="tekup-hero-content white-color center large-content">
                    <h1>The best innovative technology solutions</h1>
                    <p>We are architects of innovation, trailblazers of technological advancement</p>
                    <div className="tekup-extra-mt">
                        <div className="tekup-hero-btn-wrap center">
                            <Link className="tekup-default-btn" href="">Start a Project <i className="ri-arrow-right-up-line"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="tekup-hero-thumb-wrap">
                    <div className="tekup-hero-thumb-column">
                        <div className="tekup-hero-thumb-item">
                            <img src="/images/v8/hero-thumb1.png" alt="" />
                        </div>
                        <div className="tekup-hero-thumb-item">
                            <img src="/images/v8/hero-thumb2.png" alt="" />
                        </div>

                    </div>
                    <div className="tekup-hero-thumb-column">
                        <div className="tekup-hero-thumb-item">
                            <img src="/images/v8/hero-thumb3.png" alt="" />
                        </div>
                    </div>
                    <div className="tekup-hero-thumb-column">
                        <div className="tekup-hero-thumb-item">
                            <img src="/images/v8/hero-thumb4.png" alt="" />
                        </div>
                        <div className="tekup-hero-thumb-item">
                            <img src="/images/v8/hero-thumb5.png" alt="" />
                        </div>
                    </div>
                </div>
                <div className="tekup-hero-counter-section" id="counter-home-eight">
                    <div id="tekup-counter"></div>
                    <div className="tekup-counter-wrap">
                        <div className="tekup-counter-data light-color">
                            <h2><span data-percentage="26" className="tekup-counter">{isVisible && <CountUp end={26} duration={3} />}</span>+</h2>
                            <h4>Years of Experiencep</h4>
                            <p>To succeed, every software solution be deeply integrated into the</p>
                        </div>
                        <div className="tekup-counter-data light-color">
                            <h2><span data-percentage="730" className="tekup-counter">{isVisible && <CountUp end={730} duration={3} />}</span>+</h2>
                            <h4>Successfully Projects Done</h4>
                            <p>To succeed, every software solution be deeply integrated into the</p>
                        </div>
                        <div className="tekup-counter-data light-color">
                            <h2><span data-percentage="198" className="tekup-counter">{isVisible && <CountUp end={198} duration={3} />}</span>+</h2>
                            <h4>Satisfied Happy Clients</h4>
                            <p>To succeed, every software solution be deeply integrated into the</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HeroSection;