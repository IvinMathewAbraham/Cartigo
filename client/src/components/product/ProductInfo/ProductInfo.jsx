import QuantitySelector from "../QuantitySelector/QuantitySelector";
import "./ProductInfo.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

export default function ProductInfo({ product }) {
  const { handleAddToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const addCart = async () => {
    if (!product?.variant?.id) return;
    setIsAdding(true);
    try {
      await handleAddToCart(product.variant.id, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product?.variant?.id) return;
    setIsAdding(true);
    try {
      const success = await handleAddToCart(product.variant.id, quantity);
      if (success !== false) {
        navigate("/cart");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-info">
      
      <span className="product-badge">
        {product.badge}
      </span>

      <h1>{product.name}</h1>

      <div className="rating">
        ⭐ {product.rating}
        <span> ({product.reviewCount} Reviews)</span>
      </div>

      <div className="price-section">
        <h2>₹{product.price}</h2>

        <span className="old-price">
          ₹{product.oldPrice}
        </span>

        <span className="discount">
          {product.discount}% OFF
        </span>
      </div>

      <p className="stock">
        {product.inStock
          ? "In Stock"
          : "Out of Stock"}
      </p>

      <QuantitySelector 
      quantity={quantity}
    setQuantity={setQuantity}/>

      <div className="action-buttons">
        <button className="cart-btn" onClick={addCart} disabled={isAdding}>
          {isAdding ? "Adding..." : "Add To Cart"}
        </button>

        <button className="buy-btn" onClick={handleBuyNow} disabled={isAdding}>
          {isAdding ? "Processing..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}