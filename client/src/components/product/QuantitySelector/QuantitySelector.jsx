import React from "react";
import "./QuantitySelector.css";

export default function QuantitySelector({ quantity, setQuantity }) {
  return (
    <div className="cartigo-quantity-selector" role="group" aria-label="Quantity controls">
      <button
        className="qty-btn minus"
        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="qty-value tabular-numbers">{quantity}</span>

      <button
        className="qty-btn plus"
        onClick={() => setQuantity(quantity + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}