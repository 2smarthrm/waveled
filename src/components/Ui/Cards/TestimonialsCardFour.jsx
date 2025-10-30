
const TestimonialsCardFour = ({ item }) => {
    return (
        <div className="col-xl-4 col-md-6">
            <div className="tekup-testimonial-box">
                <div className="tekup-testimonial-rating">
                    <ul>
                        <li><i className="ri-star-s-fill"></i></li>
                        <li><i className="ri-star-s-fill"></i></li>
                        <li><i className="ri-star-s-fill"></i></li>
                        <li><i className="ri-star-s-fill"></i></li>
                        <li><i className="ri-star-s-fill"></i></li>
                    </ul>
                </div>
                <p>“{item?.text}”</p>
                <div className="tekup-testimonial-author">
                    <h5>{item?.author}</h5>
                    <span>{item?.position}</span>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsCardFour;