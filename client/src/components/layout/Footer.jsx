// src/components/layout/Footer.jsx
import React from 'react';
import { ChevronUp } from 'lucide-react';
import '../App.css';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-brand-700)', color: '#fff', marginTop: '64px', borderTop: '4px solid var(--color-brand-orange)' }}>
      <div className="back-to-top-panel" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ChevronUp size={12} /> Re-Initialize Interface view viewport state (Back to Top)[cite: 1]
      </div>
      
      <div className="canvas-container" style={{ padding: '48px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
        <div>
          <h4 style={{ color: 'var(--color-brand-orange)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Corporate Governance</h4>[cite: 1]
          <p style={{ color: 'var(--color-slate-400)', fontSize: '12px' }}>About Marketplace Nodes</p>[cite: 1]
        </div>
        <div>
          <h4 style={{ color: 'var(--color-brand-orange)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vendor Operations</h4>[cite: 1]
          <p style={{ color: 'var(--color-slate-400)', fontSize: '12px' }}>Supply Chain Portal API</p>[cite: 1]
        </div>
        <div>
          <h4 style={{ color: 'var(--color-brand-orange)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Client Infrastructure</h4>[cite: 1]
          <p style={{ color: 'var(--color-slate-400)', fontSize: '12px' }}>User Profile Dashboard</p>[cite: 1]
        </div>
        <div>
          <h4 style={{ color: 'var(--color-brand-orange)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal Matrix</h4>[cite: 1]
          <p style={{ color: 'var(--color-slate-400)', fontSize: '12px' }}>Arbitration Policy & Escrow</p>[cite: 1]
        </div>
      </div>
    </footer>
  );
}