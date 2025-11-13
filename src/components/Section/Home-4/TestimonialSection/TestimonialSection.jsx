import TestimonialsCardFour from '~/components/Ui/Cards/TestimonialsCardFour';
import reviews from '~/db/homeFourTestimonial.json'

const TestimonialSection = () => {
    return (
        <div className="section tekup-section-padding2">
            <div className="container">
                <div className="tekup-section-title center">
                    <h2>Trusted by more than 200+ client’s around the world</h2>
                </div>
                <div className="row">
                    {
                        reviews?.map((item, idx) => <TestimonialsCardFour key={idx} item={item}></TestimonialsCardFour>)
                    }
                </div>
            </div>
        </div>
    );
};

export default TestimonialSection;