// src/components/layout/TopBar.jsx
import React from 'react';
import { MapPin } from 'lucide-react';
import '../App.css';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="canvas-container top-bar-content">
        <div className="top-bar-left">
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-slate-300)' }}>
           <MapPin size={16} style={{ marginRight: '4px' }} /> 
            Deliver to: <strong style={{ color: '#fff', marginLeft: '4px' }}>New York 10001</strong>
          </span>
          <a href="#">Become a Certified Vendor</a>
          <a href="#">Track Infrastructure Logistics</a>
        </div>
        <div className="top-bar-right">
          <a href="#">Offers & Coupons</a>
          <a href="#">NexusPrime Membership</a>
          <a href="#">Help Center</a>
          <span style={{ color: '#fff' }}>EN | <b>USD</b></span>
        </div>
      </div>
    </div>
  );
}