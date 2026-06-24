
import "./ReviewCard.css";

export default function ReviewCard({
  name,
  rating,
  comment,
  date,
}) {
  return (
    <div className="review-card">
      <div className="review-header">
        <h4>{name}</h4>

        <span>{date}</span>
      </div>

      <div className="review-rating">
        ⭐ {rating}
      </div>

      <p>{comment}</p>
    </div>
  );
}