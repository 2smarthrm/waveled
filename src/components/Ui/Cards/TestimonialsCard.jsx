

const TestimonialsCard = ({ member ,className}) => {
    return (
        <div className={className}>
        <div className="tekup-testimonial-box">
          <div className="tekup-testimonial-rating">
            <ul>
              {[...Array(5)].map((_, index) => (
                <li key={index}><i className="ri-star-s-fill"></i></li>
              ))}
            </ul>
          </div>
          <p>{member.testimonial}</p>
          <div className="tekup-testimonial-author">
            <h5>{member.name}</h5>
            <span>{member.position}</span>
          </div>
        </div>
      </div>
    );
};

export default TestimonialsCard;