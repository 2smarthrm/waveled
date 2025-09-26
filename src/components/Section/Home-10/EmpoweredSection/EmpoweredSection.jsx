import Image from "next/image";

const EmpoweredSection = () => {
    return (
        <div className="section bg-light1 tekup-section-padding">
            <div className="container">
                <div className="tekup-section-title center">
                    <p>Empowered professionals to connect with top-tier opportunities</p>
                </div>
                <div className="tekup-brand-slider">
                    <div className="tekup-brand-slider-item">
                        <img   src="/images/v3/b_1.png" alt="" />
                    </div>
                    <div className="tekup-brand-slider-item">
                        <img   src="/images/v3/b_2.png" alt="" />
                    </div>
                    <div className="tekup-brand-slider-item">
                        <img   src="/images/v3/b_3.png" alt="" />
                    </div>
                    <div className="tekup-brand-slider-item">
                        <img   src="/images/v3/b_4.png" alt="" />
                    </div>
                    <div className="tekup-brand-slider-item">
                        <img   src="/images/v3/b_5.png" alt="" />
                    </div>
                    <div className="tekup-brand-slider-item">
                        <img   src="/images/v3/b_3.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpoweredSection;