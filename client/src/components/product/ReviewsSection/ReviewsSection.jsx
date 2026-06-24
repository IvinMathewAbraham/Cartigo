import ReviewCard from "../ReviewCard/ReviewCard";
import "./ReviewsSection.css";


// temporary fix
export default function ReviewsSection({
  reviews = [],
}) {
  return (
    <section
      id="reviews"
      className="reviews-section"
    >
      <h2>Customer Reviews</h2>

      <div className="reviews-list">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            {...review}
          />
        ))}
      </div>
    </section>
  );
}