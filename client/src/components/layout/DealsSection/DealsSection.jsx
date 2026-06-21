import React from "react";
import ProductCard from "../../product/ProductCard/ProductCard";
import "./DealsSection.css";

export default function DealsSection({
  title,
  products
}) {
  return (
    <section className="deals-section">

      <div className="deals-header">

        <h2>{title}</h2>

        <button>
          View All →
        </button>

      </div>

      <div className="products-row">

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