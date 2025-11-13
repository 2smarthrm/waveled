"use client"

import ServiceCard from "~/components/Ui/Cards/ServiceCard";
import services from '~/db/serviceData.json'
const WeDealSection = () => {
    return (
        <div className="section bg-light1 tekup-section-padding2">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>We deal with the aspects of professional IT services</h2>
                </div>
                <div className="row">
                    {services.map(service => (
                        <ServiceCard key={service.id} service={service} className="col-lg-6" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeDealSection;