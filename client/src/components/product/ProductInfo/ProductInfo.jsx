import QuantitySelector from "../QuantitySelector/QuantitySelector";
import "./ProductInfo.css";

export default function ProductInfo({ product }) {
  
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

      <QuantitySelector />

      <div className="action-buttons">
        <button className="cart-btn">
          Add To Cart
        </button>

        <button className="buy-btn">
          Buy Now
        </button>
      </div>
    </div>
  );
}