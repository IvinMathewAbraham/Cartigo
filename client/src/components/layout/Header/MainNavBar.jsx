import React, { useState } from 'react';
import { Menu, Search, User, ShoppingCart, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function MainNavbar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="main-navbar">
      <div className="container navbar-content">
        
        {/* Row Element 1: Left Group (Logo Link Redirect) */}
        <div className="left-brand-group">
          <Link to="/" className="logo">
            Cartigo
          </Link>
        </div>

        {/* Row Element 2: Middle Group (Large Search Bar taking up maximum width) */}
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

        {/* Row Element 3: Right Group (Location Box + Action Icons joined side-by-side) */}
        <div className="action-icons">
          
          <div className="location-box">
            <MapPin size={18} />
            <div>
              <small>Delivering to</small>
              <span>Update Location</span>
            </div>
          </div>

          <button className="nav-action">
            <ShoppingCart size={20} />
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
                  <Link to="/profile" onClick={() => setAccountOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/orders" onClick={() => setAccountOpen(false)}>
                    Orders
                  </Link>
                  <Link to="/wishlist" onClick={() => setAccountOpen(false)}>
                    Wishlist
                  </Link>

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
    </div>
  );
}