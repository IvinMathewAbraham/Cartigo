import React from 'react';

export default function UtilityBar() {
  return (
    <div className="utility-bar">
      <div className="container utility-content">
        <div className="utility-left">
          Free Shipping on Orders Over ₹999
        </div>

        <div className="utility-right">
          <a href="#">Help</a>
          <a href="#">FAQs</a>
          <a href="#">Track Order</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </div>
  );
}