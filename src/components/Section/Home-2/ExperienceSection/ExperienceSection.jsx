'use client';

import { useEffect, useState } from "react";
import CountUp from "react-countup";

const ExperienceSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById("counter-home-one");
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
        <div className="section tekup-section-padding-bottom" id="counter-home-one">
            <div className="container">
                <div id="tekup-counter"></div>
                <div className="tekup-counter-wrap wrap2">
                    <div className="tekup-counter-data tekup-counter-data2">
                        <h2><span data-percentage="26" className="tekup-counter">{isVisible && <CountUp end={26} duration={3} />}</span>+</h2>
                        <h5>Years of Experience</h5>
                        <p>To succeed, every software solution be deeply integrated into the</p>
                    </div>
                    <div className="tekup-counter-data tekup-counter-data2">
                        <h2><span data-percentage="730" className="tekup-counter">{isVisible && <CountUp end={730} duration={3} />}</span>+</h2>
                        <h5>Successfully Projects Done</h5>
                        <p>To succeed, every software solution be deeply integrated into the</p>
                    </div>
                    <div className="tekup-counter-data tekup-counter-data2">
                        <h2><span data-percentage="198" className="tekup-counter">{isVisible && <CountUp end={198} duration={3} />}</span>+</h2>
                        <h5>Satisfied Happy Clients</h5>
                        <p>To succeed, every software solution be deeply integrated into the</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperienceSection;