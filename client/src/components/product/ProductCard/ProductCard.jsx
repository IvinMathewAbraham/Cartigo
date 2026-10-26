import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import { getImageUrl } from "../../../utils/image";
import { useCart } from "../../../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { handleAddToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const productId = product._id || product.id;
  const variant = product.variants?.[0];
  const price = variant?.price ?? product.price ?? 0;
  const oldPrice = product.oldPrice || (price > 0 ? Math.round(price * 1.25) : 0);
  const discountPercent = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const imageUrl = getImageUrl(product.images?.[0]?.url);
  const categoryName = product.category?.name || "General";
  const ratingValue = product.rating || 4.5;
  const reviewsCount = product.reviewsCount ?? product.reviews ?? 12;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!variant || isAdding) return;

    try {
      setIsAdding(true);
      await handleAddToCart(variant.id, 1);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1800);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="cartigo-product-card-wrapper">
      <Link
        to={`/products/${productId}`}
        className="cartigo-card-anchor"
        aria-label={`View ${product.name}`}
      >
        <div className="cartigo-product-card">
          {/* Top Floating Badges */}
          <div className="card-badge-row">
            {discountPercent > 0 ? (
              <span className="card-discount-pill">
                -{discountPercent}%
              </span>
            ) : (
              <span className="card-in-stock-pill">In Stock</span>
            )}

            <button
              className={`card-wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={handleWishlistClick}
              aria-label="Add to wishlist"
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* 1:1 Image Canvas */}
          <div className="card-image-box">
            <img
              src={imageUrl}
              alt={product.name}
              className="card-main-img"
              loading="lazy"
            />
          </div>

          {/* Product Metadata & Actions */}
          <div className="card-info-box">
            <span className="card-category-tag">{categoryName}</span>

            <h3 className="card-title" title={product.name}>
              {product.name}
            </h3>

            {/* Ratings Row */}
            <div className="card-rating-strip">
              <div className="card-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < Math.floor(ratingValue) ? "currentColor" : "none"}
                    className="star-icon"
                  />
                ))}
              </div>
              <span className="rating-score">{Number(ratingValue).toFixed(1)}</span>
              <span className="rating-count">({reviewsCount})</span>
            </div>

            {/* Pricing Row */}
            <div className="card-price-strip">
              <div className="price-stack">
                <span className="card-price-current">
                  ₹{Number(price).toLocaleString('en-IN')}
                </span>
                {oldPrice > price && (
                  <span className="card-price-mrp">
                    ₹{Number(oldPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {/* Direct Add to Cart Button */}
            <button
              className={`card-add-btn ${addedSuccess ? "success" : ""}`}
              onClick={handleAdd}
              disabled={!variant || isAdding}
              aria-label={`Add ${product.name} to cart`}
            >
              {addedSuccess ? (
                <>
                  <Check size={16} />
                  <span>Added</span>
                </>
              ) : isAdding ? (
                <span>Adding...</span>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}