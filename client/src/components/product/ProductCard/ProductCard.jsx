// client/src/components/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { getImageUrl } from "../../../utils/image";
import "./ProductCard.css";


export default function ProductCard({ product }) {

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents clicking the heart from triggering the Link
    console.log("Wishlist clicked");
  };

  // Dynamically uses product._id or product.id depending on your schema
  const productId = product._id || product.id;

  return (
    <Link to={`/products/${productId}`} className="marketplace-card-link">
      <div className="marketplace-card">
        <button className="wishlist-icon" onClick={handleWishlistClick}>
          <Heart size={16} />
        </button>

        <div className="product-image-wrapper">
          <img src={getImageUrl(
            product.images?.find((img) => img.url)?.url
          )} alt={product.name} />
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
            <span className="current-price">₹{product.price}</span>
            {product.oldPrice && (
              <span className="old-price">₹{product.oldPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}