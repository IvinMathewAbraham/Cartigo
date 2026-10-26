import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Truck, ShieldCheck, ShoppingBag, Zap, MapPin, Check } from "lucide-react";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import VariantSelector from "../VariantSelector/VariantSelector";
import { useCart } from "../../../context/CartContext";
import "./ProductInfo.css";

export default function ProductInfo({
  product,
  variants = [],
  selectedVariant,
  onVariantChange
}) {
  const { handleAddToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [pincode, setPincode] = useState("400001");
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const navigate = useNavigate();

  const variant = selectedVariant || product?.variant;
  const price = Number(variant?.price || product?.price || 0);
  const oldPrice = Number(product?.oldPrice || (price > 0 ? Math.round(price * 1.25) : 0));
  const discountPercent = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const inStock = variant?.stock !== undefined ? variant.stock > 0 : product?.inStock;

  const handleAdd = async () => {
    if (!variant?.id || isAdding) return;
    setIsAdding(true);
    try {
      await handleAddToCart(variant.id, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!variant?.id || isAdding) return;
    setIsAdding(true);
    try {
      const res = await handleAddToCart(variant.id, quantity);
      if (res !== false) {
        navigate("/cart");
      }
    } catch (err) {
      console.error("Failed to buy now:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length >= 5) {
      setPincodeChecked(true);
    }
  };

  return (
    <div className="product-info-column">
      {/* Brand & Title */}
      <div className="product-title-cluster">
        {product?.badge && (
          <span className="product-brand-pill">{product.badge}</span>
        )}

        <h1 className="product-name-heading">{product?.name}</h1>

        {/* Rating Row */}
        <div className="product-rating-row">
          <div className="rating-stars-group">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(product?.rating || 4.5) ? "currentColor" : "none"}
                className="star-gold"
              />
            ))}
          </div>
          <span className="rating-num-val">{product?.rating || 4.5}</span>
          <span className="rating-reviews-val">({product?.reviewCount || 128} verified ratings)</span>
        </div>
      </div>

      {/* Unified Purchase Buy Box Card */}
      <div className="product-buybox-card">
        {/* Pricing Strip */}
        <div className="buybox-price-strip">
          <div className="price-main-row">
            <span className="current-price-val tabular-numbers">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {oldPrice > price && (
              <span className="old-mrp-val tabular-numbers">
                ₹{oldPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="discount-tag-pill">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <p className="tax-inclusive-notice">Inclusive of all applicable taxes</p>
        </div>

        {/* Integrated Variant Selector */}
        {variants && variants.length > 0 && (
          <VariantSelector
            variants={variants}
            selectedVariant={variant}
            onVariantChange={onVariantChange}
          />
        )}

        {/* Stock Status Indicator */}
        <div className="stock-status-row">
          <span className={`stock-indicator-dot ${inStock ? "in-stock" : "out-of-stock"}`} />
          <span className="stock-status-label">
            {inStock ? "In Stock — Ready for immediate dispatch" : "Currently Out of Stock"}
          </span>
        </div>

        {/* Pincode Delivery Estimator */}
        <div className="delivery-estimator-box">
          <div className="delivery-input-row">
            <MapPin size={16} className="pin-icon" />
            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
              aria-label="Delivery pincode"
            />
            <button className="pin-check-btn" onClick={handleCheckPincode}>
              Check
            </button>
          </div>
          {pincodeChecked && (
            <p className="delivery-promise">
              <Truck size={14} />
              <span><strong>Free Delivery</strong> by Tomorrow, 2:00 PM to <strong>{pincode}</strong></span>
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="quantity-selection-row">
          <span className="qty-label">Quantity:</span>
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
        </div>

        {/* Primary Purchase Buttons */}
        <div className="buybox-actions-row">
          <button
            className={`action-btn-primary ${addedSuccess ? "success" : ""}`}
            onClick={handleAdd}
            disabled={!inStock || isAdding}
          >
            {addedSuccess ? (
              <>
                <Check size={18} />
                <span>Added to Cart!</span>
              </>
            ) : isAdding ? (
              <span>Adding...</span>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            className="action-btn-buynow"
            onClick={handleBuyNow}
            disabled={!inStock || isAdding}
          >
            <Zap size={18} />
            <span>Buy Now</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="buybox-guarantee-strip">
          <div className="guarantee-pill">
            <ShieldCheck size={14} />
            <span>1 Year Warranty</span>
          </div>
          <div className="guarantee-pill">
            <Truck size={14} />
            <span>Fast Shipping</span>
          </div>
          <div className="guarantee-pill">
            <Check size={14} />
            <span>7-Day Replacement</span>
          </div>
        </div>
      </div>
    </div>
  );
}