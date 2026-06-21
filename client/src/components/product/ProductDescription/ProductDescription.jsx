import "./ProductDescription.css";

export default function ProductDescription({ description }) {
  return (
    <section id="description" className="product-description">
      <h2>Description</h2>

      <p>{description}</p>
    </section>
  );
}