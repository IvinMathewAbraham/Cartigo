import React, { useState } from 'react';
import { Search, User, ShoppingCart, MapPin, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useCart } from '../../../context/CartContext.jsx'; // Imported Cart Context
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function MainNavbar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cart, handleUpdateQty, handleRemove, cartTotal } = useCart(); // Hooked context variables
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="main-navbar">
      <div className="container navbar-content">
        
        {/* Left Group */}
        <div className="left-brand-group">
          <Link to="/" className="logo">Cartigo</Link>
        </div>

        {/* Middle Group */}
        <div className="search-container">
          <Search size={18} style={{ marginLeft: '16px', marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search for any product or brand"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            <Search size={18} />
          </button>
        </div>

        {/* Right Group */}
        <div className="action-icons">
          <div className="location-box">
            <MapPin size={18} />
            <div>
              <small>Delivering to</small>
              <span>Update Location</span>
            </div>
          </div>

          {/* Toggle Sidebar Drawer */}
          <button className="nav-action" onClick={() => setCartDrawerOpen(true)}>
            <div className="cart-icon-wrapper">
              <ShoppingCart size={20} />
              {cart?.items?.length > 0 && (
                <span className="cart-badge">{cart.items.length}</span>
              )}
            </div>
            <span>Cart</span>
          </button>

          {!user ? (
            <Link to="/login" className="nav-action">
              <User size={20} />
              <span>Sign In</span>
            </Link>
          ) : (
            <div className="account-dropdown-wrapper">
              <button className="nav-action" onClick={() => setAccountOpen(!accountOpen)}>
                <User size={20} />
                <span>{user.firstName}</span>
              </button>

              {accountOpen && (
                <div className="account-dropdown">
                  <Link to="/profile" onClick={() => setAccountOpen(false)}>My Profile</Link>
                  <Link to="/orders" onClick={() => setAccountOpen(false)}>Orders</Link>
                  <Link to="/wishlist" onClick={() => setAccountOpen(false)}>Wishlist</Link>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-btn logout"
                    onClick={async () => { 
                      await logout(); 
                      setAccountOpen(false); 
                      navigate("/"); 
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- CART SLIDEBAR DRAWER OVERLAY --- */}
      {cartDrawerOpen && (
        <div className="cart-drawer-overlay" onClick={() => setCartDrawerOpen(false)} />
      )}

      {/* --- CART SLIDEBAR DRAWER PANEL --- */}
      <div className={`cart-drawer ${cartDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Shopping Cart ({cart?.items?.length || 0})</h3>
          <button className="close-drawer-btn" onClick={() => setCartDrawerOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="drawer-content">
          {!cart?.items || cart.items.length === 0 ? (
            <div className="drawer-empty">
              <p>Your sidebar cart is empty.</p>
              <button className="continue-btn" onClick={() => setCartDrawerOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="drawer-items-list">
              {cart.items.map((item) => {
                const product = item.variant?.product;
                const image = product?.images?.[0]?.imageUrl || "https://placehold.co/200x200";
                if (!product) return null;

                return (
                  <div key={item.id} className="drawer-item">
                    <img src={image} alt={product.name} />
                    <div className="drawer-item-details">
                      <h4>{product.name}</h4>
                      <p className="drawer-item-price">₹{Number(item.variant?.price).toFixed(2)}</p>
                      <div className="drawer-qty-controls">
                        <button 
                          disabled={item.quantity <= 1} 
                          onClick={() => handleUpdateQty(item, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleUpdateQty(item, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <button className="drawer-remove-btn" onClick={() => handleRemove(item.id)}>
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
            
            <button 
              className="view-cart-btn" 
              onClick={() => {
                setCartDrawerOpen(false);
                navigate("/cart");
              }}
            >
              View Full Cart Page
            </button>

            <button 
              className="drawer-checkout-btn"
              onClick={() => {
                setCartDrawerOpen(false);
                navigate("/checkout");
              }}
            >
              Proceed To Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}