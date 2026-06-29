import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { getImageUrl } from "../../../utils/image";
import "./ProductCard.css";

import { useCart } from "../../../context/CartContext";

export default function ProductCard({ product }) {
  const { handleAddToCart } = useCart();

  const productId = product._id || product.id;
  const variant = product.variants?.[0];
  

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Wishlist clicked");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!variant) return;

    await handleAddToCart(variant.id, 1);
  };

  return (
    <Link
      to={`/products/${productId}`}
      className="marketplace-card-link"
    >
      <div className="marketplace-card">
        <button
          className="wishlist-icon"
          onClick={handleWishlistClick}
        >
          <Heart size={16} />
        </button>

        <div className="product-image-wrapper">
          <img
            src={getImageUrl(product.images?.[0]?.url)}
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
            <span>({product.reviews ?? 0})</span>
          </div>

          <div className="price-row">
            <span className="current-price">
              ₹{variant?.price ?? 0}
            </span>

            {product.oldPrice && (
              <span className="old-price">
                ₹{product.oldPrice}
              </span>
            )}
          </div>

          <button
            className="add-cart-btn"
            onClick={handleAdd}
            disabled={!variant}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}