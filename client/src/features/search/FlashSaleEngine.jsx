// src/components/features/FlashSaleEngine.jsx
import React, { useState, useEffect } from 'react';
import { Flame, Star, ShoppingCart, Heart } from 'lucide-react';
import '../../App.css';

export default function FlashSaleEngine() {
  const [sec, setSec] = useState(48);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSec((prev) => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const dataNodes = [
    { id: 1, name: "AeroSound Pro ANC Wireless Spatial Headset Matrix", price: "179.00", oldPrice: "310.00", split: "78%" },
    { id: 2, name: "Titan 15 Pro Max 5G (Unlocked Developer Edition)", price: "1,099.00", oldPrice: "1,299.00", split: "92%" }
  ];

  return (
    <section className="flash-sales-section">
      <div className="flash-sales-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={20} className="animate-bounce" style={{ color: 'var(--color-brand-orange)' }} />[cite: 1]
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', textTransform: 'uppercase' }}>Lightning Flash Deals Matrix</h2>[cite: 1]
        </div>
        
        <div className="clock-display-matrix">
          <div className="clock-node-box">04</div>:[cite: 1]
          <div className="clock-node-box">12</div>:[cite: 1]
          <div className="clock-node-box">{String(sec).padStart(2, '0')}</div>[cite: 1]
        </div>
      </div>

      <div className="product-mesh-grid">
        {dataNodes.map(node => (
          <div key={node.id} className="product-card-node">
            <span className="discount-tag">-42% Discount</span>[cite: 1]
            <button className="wishlist-heart-btn"><Heart size={16} /></button>[cite: 1]
            
            <div className="product-image-container">
              <span style={{ fontSize: '12px', color: 'var(--color-slate-400)', fontWeight: 'bold' }}>Product Model Stream Node</span>
            </div>

            <div>
              <h3 style={{ fontSize: '14px', margin: '0 0 8px 0', fontWeight: '700' }}>{node.name}</h3>[cite: 1]
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                <Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" />
                <span style={{ color: 'var(--color-slate-500)', fontSize: '11px' }}>(2,841 orders)</span>[cite: 1]
              </div>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '20px', fontWeight: '900' }}>{node.price}</span>[cite: 1]
                <span style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--color-slate-400)' }}>{node.oldPrice}</span>[cite: 1]
              </div>
            </div>

            <button className="product-allotment-btn">
              <ShoppingCart size={14} style={{ marginRight: '6px' }} /> Secure Item Allotment
            </button>[cite: 1]
          </div>
        ))}
      </div>
    </section>
  );
}