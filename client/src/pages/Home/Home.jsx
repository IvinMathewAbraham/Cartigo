import React from 'react';
import Header from '../../components/layout/Header';

export default function Home() {
  const mockupCategories = [
    { icon: 'smartphone', name: 'Mobiles' },
    { icon: 'laptop_mac', name: 'Laptops' },
    { icon: 'headphones', name: 'Headphones' },
    { icon: 'tv', name: 'Smart TVs' },
    { icon: 'sports_esports', name: 'Gaming' },
    { icon: 'watch', name: 'Accessories' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--surface-container-lowest)', minHeight: '100vh' }}>
      <div className="announcement-bar">
        Free shipping on orders over 500 | Limited time Flash Deals!
      </div>
      <Header />

      {/* Hero Presentation */}
      <section className="hero-section">
        <div>
          <span className="hero-badge">New Arrival</span>
          <h1 className="hero-title">The New <br />MacBook Pro</h1>
          <p className="hero-desc">
            Powered by the M3 Max Chip, designed for pro users who demand absolute performance and uncompromised efficiency in a sleek, space-black finish.
          </p>
          <div className="hero-actions-container">
            <button className="filled-btn btn-active-scale">Shop Now</button>
            <button className="outline-btn btn-active-scale">Learn More</button>
          </div>
        </div>
        <div className="hero-image-panel">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQwtqHPXJkaZOghJeGlkTU770uV--yBEO7xaWM_drUUVJH71MGY84Vya_MlEzThLQD08KmcrHyy73ydNs0GD4g9OxT5h_J-if1VHT-kp_iswq8GyyjVB3OqodDX3Z4cLWeikbN7rB-ng2XJRI4NU8FSRdsdxastL5i18CKdS9d-1k0nXbhxBkqlvtu6OaeTpfMoi3JciCsBbpz3PjQ8jUlk6tuW8sHUXwIk6LeUNXTuIiQzzQPZLgS3BNRyWTNlhDRubBV6DVcsPY" alt="MacBook Pro M3" />
        </div>
      </section>

      {/* Category Bento Section */}
      <section className="category-showcase-section">
        <div className="section-wrapper-max">
          <div className="section-header-flex">
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '600' }}>Shop by Category</h2>
              <p style={{ color: 'var(--on-surface-variant)' }}>Explore our curated collections of high-end technology.</p>
            </div>
            <a href="/shop" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>

          <div className="category-bento-grid">
            {mockupCategories.map((cat, index) => (
              <div key={index} className="category-icon-card soft-elevation interactive-hover">
                <div className="card-icon-circle">
                  <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>{cat.icon}</span>
                </div>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}