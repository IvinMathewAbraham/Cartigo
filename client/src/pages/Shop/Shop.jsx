import React from 'react';
import Header from '../../components/layout/Header';
import ProductCard from '../../features/products/ProductCard';

export default function Shop() {
  const currentCatalogMock = [
    { title: 'LuminaBook Pro 16" - M3 Ultra Chip', price: 2499.00, oldPrice: 2899.00, rating: 4.9, reviewsCount: 1240, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfDiDi5-wUvWWyWki8VF1LHmQUHBoKoNpOPmcGEz7pj4kePyO44w6PSuGY_iXmHXGDkEbKp-RuNsgpbfZylBVbytKXWOdGnLv3xNLl7YAiWpmvj7QRwiA3QgM-iPzhMLcgnDsdUQ3oSEbqf-Hrtmbv4wrO9PcM3TFeRH4oqFa3Azs7D0ldvaS1EKQMg8Mw-GvCrdOuezwSPfsLP3Yrx6q5ZGHe8_pi2bWPwEcn8VbzvHyr9CNTngWjLLz7sZnYuhGSHi7Nb20Au38', hasDiscount: true, discountText: '15% OFF' },
    { title: 'Precision G15 Workstation', price: 1850.00, oldPrice: 2199.00, rating: 4.5, reviewsCount: 852, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuN0RrkhprQdik-pAmz4eZgd1oWx76nnxOc-UWmgUd2YC_jz75cLqO_uwGqfRWyNLot0Jwl9FuvyqRKJ8-mQCObCq7tarOp5TvY7DPMGDdfQGYFyHWUqRz8HyMAEOkMG0ms__M5Pvhh_KSoX03CWrYWXAr1E3hyAP0sgLs4I14KWaZCQg7O1Xyh2H8Irxmrcgz0V1lcAbO7ZDBNIU1savnA179TYPC_fGo_-uuIX9JCA99maKGMXhTCj6PNLp43RifBK4iVuhEvqM', hasDiscount: false },
    { title: 'Canvas Elite 13 Tablet', price: 999.00, oldPrice: 1150.00, rating: 5.0, reviewsCount: 2105, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9qRRU0S8mLkG6hGt1n9YRPm02T_jvpOpNq23vod3POWu5iAswW_CMfPtF4cFY4K523M86LBNT-4Rl2l-ovrl0n6FRCh3pVTck5rL3j5ib0GkalYhmpzXeWDtQN1ASyJGWyEz-CCP9xYjzKhHMuSF_vvSL1GqGTXFeWGxA4JR-yGz7gKEgEjeRvQFUn5kgB6wbQFhk7s8JEnjOnKegxq6hMHWAB5ZJpPaF1tqy9CPcGNk3ooTVmG4JdjEZiHVgBdYscm2vZkEkgDo', hasDiscount: true, discountText: '10% OFF' },
    { title: 'VisionUltra 32" 4K OLED Monitor', price: 1299.00, oldPrice: 1550.00, rating: 4.8, reviewsCount: 543, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7hA3vyCIJIdmirj668YXkxKp9vvfYTLVzY960qyUB3xtXCYyKobvj6bEDThJZOa5FRY139wGE7nqkoagPO-hG-mX_SZpdGA817wxnN54xfXekeNN9aTo8CheMIoukyRTXLrBWp8cgMmRdPS8kyEv_r9BrFAOHyI6frH_vAX9lWyrfKMi-yaxPNCLY7Q5cVZ2SqB_BXMrsuboaM2FJ-OD-GHgyI0FQFQRmv5tmq2GvE9oaLI815lBzovNXKD4JWWoHX3EYVlD1QzY', hasDiscount: false }
  ];

  return (
    <div>
      <Header />
      <div className="shop-view-grid">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar-panel">
          <div className="filter-section-block">
            <h3>Brands</h3>
            <div className="filter-options-list">
              {['Apple', 'Samsung', 'Sony', 'Dell', 'ASUS'].map((brand, i) => (
                <label key={i} className="checkbox-label">
                  <input type="checkbox" defaultChecked={i === 0 || i === 2} style={{ width: '18px', height: '18px' }} />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="filter-section-block">
            <h3>Price Range</h3>
            <input type="range" max="5000" min="0" style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
        </aside>

        {/* Content Stream */}
        <main className="catalog-content-stream">
          <div className="catalog-top-toolbar soft-elevation">
            <span style={{ color: 'var(--on-surface-variant)' }}>Showing 1-20 of 500 results</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--outline)' }}>Sort by:</label>
              <select style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}>
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="products-rendering-grid">
            {currentCatalogMock.map((prod, idx) => (
              <ProductCard key={idx} {...prod} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}