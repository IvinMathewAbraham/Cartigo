import React, { useState } from 'react';

export default function ProductCard({ title, price, oldPrice, rating, reviewsCount, image, hasDiscount, discountText }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="product-show-card soft-elevation interactive-hover">
      <button 
        className={`wishlist-absolute-btn ${isWishlisted ? 'active' : ''}`}
        onClick={() => setIsWishlisted(!isWishlisted)}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
          favorite
        </span>
      </button>

      {hasDiscount && <div className="discount-tag">{discountText}</div>}

      <div className="product-card-image-box">
        <img src={image} alt={title} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 className="product-title-text">{title}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', color: '#ffb596' }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '16px' }}>star</span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '600' }}>{rating}</span>
          <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>({reviewsCount})</span>
        </div>

        <div className="pricing-flex-row">
          <span className="current-price">${price.toFixed(2)}</span>
          {oldPrice && <span className="old-price">${oldPrice.toFixed(2)}</span>}
        </div>

        <button className="add-to-cart-reveal-btn btn-active-scale">
          <span className="material-symbols-outlined">shopping_cart</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
}