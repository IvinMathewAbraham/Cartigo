import React from "react";
import { Heart, Star } from "lucide-react";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <div className="marketplace-card">

      <button className="wishlist-icon">
        <Heart size={16} />
      </button>

      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-details">

        <h3>{product.name}</h3>

        <div className="rating-row">
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} />

          <span>({product.reviews})</span>
        </div>

        <div className="price-row">
          <span className="current-price">
            ₹{product.price}
          </span>

          {product.oldPrice && (
            <span className="old-price">
              ₹{product.oldPrice}
            </span>
          )}
        </div>

      </div>

    </div>
  );
}