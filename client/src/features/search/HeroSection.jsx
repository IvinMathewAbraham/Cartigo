// src/components/features/HeroSection.jsx
import React from 'react';
import { ArrowRight, Truck, ShieldCheck, Tv } from 'lucide-react';
import '../../App.css';

export default function HeroSection() {
  return (
    <div className="dashboard-grid-matrix">
      
      {/* Main Promo Area */}
      <div className="main-hero-carousel-block">
        <div className="hero-text-matrix">
          <span className="hero-tagline">Exclusive Launch Event</span>[cite: 1]
          <h1 className="hero-heading">The Next-Gen Quantum Display ecosystem is here.</h1>[cite: 1]
          <p className="hero-paragraph">
            Experience 40% higher brightness matrices and neural-upscaling processing pipelines. Direct authorized vendor warranty.[cite: 1]
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={14} style={{ color: 'var(--color-brand-orange)' }} /> Instant Logistics Delivery</span>[cite: 1]
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} style={{ color: 'var(--color-emerald-400)' }} /> 3-Year Secure Coverage</span>[cite: 1]
          </div>
          <a href="#" className="hero-cta-btn">
            Shop Smart Display Suite <ArrowRight size={14} />[cite: 1]
          </a>
        </div>

        {/* Side Graphic Frame Visual Accent */}
        <div className="floating-product-accent-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <span style={{ fontSize: '10px', backgroundColor: 'var(--color-emerald-500)', color: '#fff', padding: '2px 4px', fontWeight: 'bold', borderRadius: '4px' }}>Pre-order</span>[cite: 1]
            <span style={{ fontWeight: '900' }}>$1,199</span>[cite: 1]
          </div>
          <div style={{ textAlign: 'center' }}>
            <Tv size={64} style={{ opacity: '0.9' }} />[cite: 1]
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>NexusDisplay 32" Pro Ultra</p>[cite: 1]
          </div>
        </div>
      </div>

      {/* Side Profile Card Column Matrix */}
      <div className="side-action-column">
        <div className="auth-promo-module">
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Personalize your system workspace interface</h3>[cite: 1]
            <p style={{ fontSize: '12px', color: 'var(--color-slate-500)', marginTop: '4px' }}>Log in to track custom dynamic metrics, vendor orders, and cart status matrices.</p>[cite: 1]
          </div>
          <button className="auth-action-btn">Sign In Securely</button>[cite: 1]
        </div>
      </div>

    </div>
  );
}