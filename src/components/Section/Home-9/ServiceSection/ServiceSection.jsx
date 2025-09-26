import ServiceCardTwo from "~/components/Ui/Cards/ServiceCardTwo";
import services from '~/db/homeTwoServiceData.json'

const ServiceSection = () => {
    return (
        <div className="section tekup-section-padding2">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>We deal with the aspects of professional IT services</h2>
                </div>
                <div className="row">
                    {services.map(service => (
                        <ServiceCardTwo key={service.id} service={service}  className="col-md-6 col-xl-4" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceSection;