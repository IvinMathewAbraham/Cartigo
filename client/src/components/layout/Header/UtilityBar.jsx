import React from 'react';
import { Truck, PhoneCall, HelpCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UtilityBar() {
  return (
    <div className="utility-bar">
      <div className="container utility-content">
        <div className="utility-left">
          <span className="utility-badge">
            <Truck size={14} />
            <span>Free Express Delivery on Orders Over ₹999</span>
          </span>
          <span className="utility-divider">•</span>
          <span className="utility-trust">
            <ShieldCheck size={14} />
            <span>100% Genuine Products</span>
          </span>
        </div>

        <div className="utility-right">
          <Link to="/products?deals=true" className="utility-link highlight">Amazing Deals</Link>
          <span className="utility-divider">|</span>
          <a href="#order-tracking" className="utility-link">Order Tracking</a>
          <span className="utility-divider">|</span>
          <a href="#help" className="utility-link">
            <HelpCircle size={13} />
            <span>Help</span>
          </a>
          <span className="utility-divider">|</span>
          <a href="tel:18008889999" className="utility-phone">
            <PhoneCall size={13} />
            <span>1-800-888-9999</span>
          </a>
        </div>
      </div>
    </div>
  );
}