import React from 'react';
import { Menu, Search, User, Heart, ShoppingCart, MapPin } from 'lucide-react';
import { useState } from 'react';
import './Header.css';



export default function MainNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (

    <div className="main-navbar">
      <div className="container navbar-content">

        <button className="hamburger-btn"
          onClick={() => setMenuOpen(true)}>
          <Menu size={24} />
        </button>

        {menuOpen && (
          <div className="mobile-menu">

            <button
              className="close-btn"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>

            {menuOpen && (
              <>
                <div
                  className="mobile-overlay"
                  onClick={() => setMenuOpen(false)}
                />

                <div className="mobile-menu">
                  ...
                </div>
              </>
            )}

           
          </div>
        )}

        {/* Logo */}
        <div className="logo">
          Cartigo
        </div>

      
       

        {/* Search */}
        <div className="search-container">
          <Search size={18} style={{ margin: '16px' }} />

          <input
            type="text"
            placeholder="Search for any product or brand"
          />

          <button className="search-btn">
            <Search size={18} />
          </button>
        </div>

        <div className="location-box">
          <MapPin size={18} />

          <div>
            <small>Delivering to</small>
            <span>Update Location</span>
          </div>
        </div>

        {/* Actions */}
        <div className="action-icons">

          <button className="nav-action">
            <ShoppingCart size={20} />
            <span>Cart</span>
          </button>

          <button className="nav-action">
            <User size={20} />
            <span>Sign In</span>
          </button>

        </div>
      </div>
    </div>
  );
}