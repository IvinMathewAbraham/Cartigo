import React, { useState } from 'react';
import { Search, User, ShoppingBag, MapPin, X, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../../utils/image.js';
import './Header.css';

const SEARCH_CATEGORIES = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
  "Books",
  "Automotive"
];

export default function MainNavbar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cart, handleUpdateQty, handleRemove, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleSearch = () => {
    let url = `/products?`;
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.set('category', selectedCategory);
    }
    navigate(`/products?${params.toString()}`);
  };

  const totalItemCount = cart?.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  return (
    <div className="main-navbar">
      <div className="container navbar-content">
        
        {/* Left: Brand Logo & Location */}
        <div className="left-brand-group">
          <Link to="/" className="logo">
            <span className="logo-icon">
              <ShoppingBag size={24} />
            </span>
            <span className="logo-text">
              Cart<span className="logo-highlight">igo</span>
            </span>
          </Link>

          <div className="location-box">
            <MapPin size={16} />
            <div className="location-text">
              <small>Deliver to</small>
              <span>Mumbai 400001</span>
            </div>
          </div>
        </div>

        {/* Middle: Composite Department Search Bar */}
        <div className="search-composite">
          <div className="search-category-dropdown">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by department"
            >
              {SEARCH_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="dropdown-caret" />
          </div>

          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search products, brands, essentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              aria-label="Search products"
            />
          </div>

          <button
            className="search-submit-btn"
            onClick={handleSearch}
            aria-label="Submit search"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Right: Actions (Wishlist, Account, Cart) */}
        <div className="action-icons">
          <Link to="/products?wishlist=true" className="nav-action-item wishlist-action">
            <div className="action-icon-pill">
              <Heart size={20} />
            </div>
            <div className="action-label-block hide-on-mobile">
              <small>Saved</small>
              <span>Wishlist</span>
            </div>
          </Link>

          {!user ? (
            <Link to="/login" className="nav-action-item account-action">
              <div className="action-icon-pill">
                <User size={20} />
              </div>
              <div className="action-label-block hide-on-mobile">
                <small>Hello, Sign In</small>
                <span>Account</span>
              </div>
            </Link>
          ) : (
            <div className="account-dropdown-wrapper">
              <button
                className="nav-action-item account-action"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-expanded={accountOpen}
              >
                <div className="action-icon-pill">
                  <User size={20} />
                </div>
                <div className="action-label-block hide-on-mobile">
                  <small>Hello,</small>
                  <span>{user.firstName || "Account"}</span>
                </div>
                <ChevronDown size={14} className="caret-icon hide-on-mobile" />
              </button>

              {accountOpen && (
                <div className="account-dropdown">
                  <div className="dropdown-user-greeting">
                    <strong>{user.firstName} {user.lastName}</strong>
                    <small>{user.email}</small>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" onClick={() => setAccountOpen(false)}>My Profile</Link>
                  <Link to="/profile" onClick={() => setAccountOpen(false)}>My Orders</Link>
                  <Link to="/profile" onClick={() => setAccountOpen(false)}>Saved Addresses</Link>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin/products" className="admin-link" onClick={() => setAccountOpen(false)}>
                      Admin Portal
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-btn logout"
                    onClick={async () => { 
                      await logout(); 
                      setAccountOpen(false); 
                      navigate("/"); 
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cart Button with Total Amount Preview */}
          <button
            className="nav-action-item cart-action"
            onClick={() => setCartDrawerOpen(true)}
            aria-label="Open Cart Drawer"
          >
            <div className="cart-icon-pill">
              <ShoppingBag size={20} />
              {totalItemCount > 0 && (
                <span className="cart-badge">{totalItemCount}</span>
              )}
            </div>
            <div className="action-label-block hide-on-mobile">
              <small>My Cart</small>
              <span className="cart-subtotal-val">₹{cartTotal ? cartTotal.toFixed(2) : "0.00"}</span>
            </div>
          </button>
        </div>
      </div>

      {/* --- CART SLIDEBAR DRAWER OVERLAY --- */}
      {cartDrawerOpen && (
        <div
          className="cart-drawer-overlay"
          onClick={() => setCartDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* --- CART SLIDEBAR DRAWER PANEL --- */}
      <div className={`cart-drawer ${cartDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={20} className="drawer-header-icon" />
            <h3>Your Cart <span className="drawer-item-count">({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span></h3>
          </div>
          <button
            className="close-drawer-btn"
            onClick={() => setCartDrawerOpen(false)}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {!cart?.items || cart.items.length === 0 ? (
            <div className="drawer-empty">
              <div className="empty-cart-icon">
                <ShoppingBag size={48} />
              </div>
              <h4>Your cart is empty</h4>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <button
                className="continue-btn"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate("/products");
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="drawer-items-list">
              {cart.items.map((item) => {
                const product = item.variant?.product;
                const image = getImageUrl(product?.images?.[0]?.url);
                if (!product) return null;

                return (
                  <div key={item.id} className="drawer-item">
                    <div className="drawer-item-image">
                      <img src={image} alt={product.name} />
                    </div>
                    <div className="drawer-item-details">
                      <h4>{product.name}</h4>
                      {item.variant?.name && (
                        <span className="drawer-variant-tag">{item.variant.name}</span>
                      )}
                      <p className="drawer-item-price">
                        ₹{Number(item.variant?.price || 0).toFixed(2)}
                      </p>
                      <div className="drawer-qty-controls">
                        <button 
                          disabled={item.quantity <= 1} 
                          onClick={() => handleUpdateQty(item, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQty(item, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="drawer-remove-btn"
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart?.items?.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-subtotal">
              <span>Subtotal:</span>
              <span className="total-amount">₹{cartTotal.toFixed(2)}</span>
            </div>
            <p className="drawer-tax-notice">Taxes and shipping calculated at checkout</p>
            
            <div className="drawer-actions">
              <button 
                className="view-cart-btn" 
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate("/cart");
                }}
              >
                View Cart Page
              </button>

              <button 
                className="drawer-checkout-btn"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate("/cart");
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}