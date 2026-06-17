import React, { useState } from 'react';
import CartDrawer from '../../features/cart/CartDrawer';

const currentCatalogMock = [
    { title: 'LuminaBook Pro 16" - M3 Ultra Chip', price: 2499.00, oldPrice: 2899.00, rating: 4.9, reviewsCount: 1240, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfDiDi5-wUvWWyWki8VF1LHmQUHBoKoNpOPmcGEz7pj4kePyO44w6PSuGY_iXmHXGDkEbKp-RuNsgpbfZylBVbytKXWOdGnLv3xNLl7YAiWpmvj7QRwiA3QgM-iPzhMLcgnDsdUQ3oSEbqf-Hrtmbv4wrO9PcM3TFeRH4oqFa3Azs7D0ldvaS1EKQMg8Mw-GvCrdOuezwSPfsLP3Yrx6q5ZGHe8_pi2bWPwEcn8VbzvHyr9CNTngWjLLz7sZnYuhGSHi7Nb20Au38', hasDiscount: true, discountText: '15% OFF' },
    { title: 'Precision G15 Workstation', price: 1850.00, oldPrice: 2199.00, rating: 4.5, reviewsCount: 852, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuN0RrkhprQdik-pAmz4eZgd1oWx76nnxOc-UWmgUd2YC_jz75cLqO_uwGqfRWyNLot0Jwl9FuvyqRKJ8-mQCObCq7tarOp5TvY7DPMGDdfQGYFyHWUqRz8HyMAEOkMG0ms__M5Pvhh_KSoX03CWrYWXAr1E3hyAP0sgLs4I14KWaZCQg7O1Xyh2H8Irxmrcgz0V1lcAbO7ZDBNIU1savnA179TYPC_fGo_-uuIX9JCA99maKGMXhTCj6PNLp43RifBK4iVuhEvqM', hasDiscount: false },
    { title: 'Canvas Elite 13 Tablet', price: 999.00, oldPrice: 1150.00, rating: 5.0, reviewsCount: 2105, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9qRRU0S8mLkG6hGt1n9YRPm02T_jvpOpNq23vod3POWu5iAswW_CMfPtF4cFY4K523M86LBNT-4Rl2l-ovrl0n6FRCh3pVTck5rL3j5ib0GkalYhmpzXeWDtQN1ASyJGWyEz-CCP9xYjzKhHMuSF_vvSL1GqGTXFeWGxA4JR-yGz7gKEgEjeRvQFUn5kgB6wbQFhk7s8JEnjOnKegxq6hMHWAB5ZJpPaF1tqy9CPcGNk3ooTVmG4JdjEZiHVgBdYscm2vZkEkgDo', hasDiscount: true, discountText: '10% OFF' },
    { title: 'VisionUltra 32" 4K OLED Monitor', price: 1299.00, oldPrice: 1550.00, rating: 4.8, reviewsCount: 543, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7hA3vyCIJIdmirj668YXkxKp9vvfYTLVzY960qyUB3xtXCYyKobvj6bEDThJZOa5FRY139wGE7nqkoagPO-hG-mX_SZpdGA817wxnN54xfXekeNN9aTo8CheMIoukyRTXLrBWp8cgMmRdPS8kyEv_r9BrFAOHyI6frH_vAX9lWyrfKMi-yaxPNCLY7Q5cVZ2SqB_BXMrsuboaM2FJ-OD-GHgyI0FQFQRmv5tmq2GvE9oaLI815lBzovNXKD4JWWoHX3EYVlD1QzY', hasDiscount: false }
  ];

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(currentCatalogMock.map(product => ({ ...product, id: Math.random().toString(36).substr(2, 9), qty: 1 })));

  const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleIncrement = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          return item.qty > 1 ? { ...item, qty: item.qty - 1 } : item;
        }
        return item;
      })
    );
  };

  const handleRemove = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    console.log(`Product ${id} removed from cart`);
  };

  return (
    <header className="app-header">
      <div className="app-header-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <a className="nav-brand" href="/">Cartigo</a>
          <nav className="nav-links">
            <div className="nav-dropdown">
              <button
                className="nav-link nav-dropdown-toggle active"
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                Categories
                <span className="material-symbols-outlined">
                  expand_more
                </span>
              </button>
              <div
  className={`nav-dropdown-menu ${
    dropdownOpen ? 'open' : ''
  }`}
>
  <a className="nav-dropdown-item" href="/shop/laptops">
    Laptops
  </a>
  <a className="nav-dropdown-item" href="/shop/tablets">
    Tablets
  </a>
  <a className="nav-dropdown-item" href="/shop/accessories">
    Accessories
  </a>
</div>
            </div>
            <a className="nav-link" href="#deals">Deals</a>
            <a className="nav-link" href="#arrivals">New Arrivals</a>
            <a className="nav-link" href="#support">Support</a>
          </nav>
        </div>

        <div className="search-bar-container">
          <input type="text" placeholder="Search for electronics..." />
          <span className="material-symbols-outlined search-icon">search</span>
        </div>

        <div className="header-actions">
          <button className="icon-btn">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <button className="icon-btn">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <button className="icon-btn" onClick={() => setCartOpen(true)}>
            <span className="material-symbols-outlined">shopping_cart</span>
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </button>

          <button className="icon-btn">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>

      <CartDrawer
        open={cartOpen}
        count={totalCount}
        items={cartItems}
        total={totalPrice}
        onClose={() => setCartOpen(false)}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
      />
    </header>
  );
}