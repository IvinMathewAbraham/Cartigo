
import ProductCard from "../ProductCard/ProductCard";
import "./RelatedProducts.css";

export default function RelatedProducts({
  products = [],
}) {
  return (
    <section className="related-products">
      <h2>Related Products</h2>

      <div className="related-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}