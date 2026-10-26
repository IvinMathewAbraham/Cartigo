import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./PromoBannerGrid.css";
import s24 from "../../../../assets/banners/s24.png";

const PROMO_CARDS = [
  {
    id: 1,
    tag: "GET REWARDED",
    title: "Save Up To 50% Off",
    description: "Best prices on top smartphones",
    buttonText: "Shop Mobiles",
    category: "Electronics",
    bgColor: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
    image: s24,
    textColor: "#0D47A1"
  },
  {
    id: 2,
    tag: "NEW ARRIVALS",
    title: "Studio Acoustics 3.0",
    description: "Free express delivery over ₹999",
    buttonText: "Shop Audio",
    category: "Electronics",
    bgColor: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    textColor: "#0F172A"
  },
  {
    id: 3,
    tag: "TOP SELLER",
    title: "Beauty On Your Wrist",
    description: "Smart fitness & biometric tracking",
    buttonText: "Shop Watches",
    category: "Fashion",
    bgColor: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
    textColor: "#1E3A8A"
  }
];

export default function PromoBannerGrid() {
  return (
    <section className="promo-banner-grid-section" aria-label="Featured category highlights">
      <div className="promo-grid-container">
        {PROMO_CARDS.map((card) => (
          <div
            key={card.id}
            className="promo-card"
            style={{ background: card.bgColor }}
          >
            <div className="promo-card-content">
              <span className="promo-card-tag">{card.tag}</span>
              <h3 className="promo-card-title">{card.title}</h3>
              <p className="promo-card-desc">{card.description}</p>
              <Link
                to={`/products?category=${encodeURIComponent(card.category)}`}
                className="promo-card-btn"
              >
                <span>{card.buttonText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="promo-card-media">
              <img src={card.image} alt={card.title} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}