import "./PromoBanner.css";

export default function PromoBanner({
  title,
  subtitle,
  image,
  bgColor,
  pattern = ""
}) {
  return (
    <div
      className={`promo-banner ${pattern}`}
      style={{ background: bgColor }}
    >
      <div className="promo-content">
        <p>{subtitle}</p>

        <h3>{title}</h3>

        <button>Shop Now</button>
      </div>

      <img
        src={image}
        alt={title}
        className="promo-image"
      />
    </div>
  );
}