import React from 'react';
import {
  Send
} from 'lucide-react';

import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-top">

          {/* Brand */}

          <div className="footer-brand">
            <h2>Cartigo</h2>

            <p>
              Discover premium products, unbeatable
              deals, and a seamless shopping experience.
            </p>

           
          </div>

          {/* Shop */}

          <div className="footer-column">
            <h4>Shop</h4>

            <a href="#">Men</a>
            <a href="#">Women</a>
            <a href="#">Electronics</a>
            <a href="#">Accessories</a>
            <a href="#">Sale</a>
          </div>

          {/* Support */}

          <div className="footer-column">
            <h4>Support</h4>

            <a href="#">Help Center</a>
            <a href="#">Track Order</a>
            <a href="#">Returns</a>
            <a href="#">Shipping Info</a>
            <a href="#">FAQs</a>
          </div>

          {/* Company */}

          <div className="footer-column">
            <h4>Company</h4>

            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>

          {/* Newsletter */}

          <div className="footer-newsletter">
            <h4>Stay Updated</h4>

            <p>
              Subscribe for new arrivals,
              exclusive offers and promotions.
            </p>

            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
              />

              <button>
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Cartigo. All rights reserved.
          </p>

          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>

      </div>

    </footer>
  );
}