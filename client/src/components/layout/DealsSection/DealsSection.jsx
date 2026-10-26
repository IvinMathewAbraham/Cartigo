import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";
import ProductCard from "../../product/ProductCard/ProductCard";
import "./DealsSection.css";

export default function DealsSection({
  title = "Today's Featured Deals",
  products = [],
  showCountdown = false,
  tabs = null
}) {
  const [activeTab, setActiveTab] = useState(tabs ? tabs[0] : null);
  const scrollContainerRef = useRef(null);

  // Dynamic countdown timer simulation (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 15, seconds: 48 });

  useEffect(() => {
    if (!showCountdown) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showCountdown]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="deals-showcase-section" aria-label={title}>
      <div className="deals-card-container">
        <div className="deals-header-row">
          <div className="deals-title-cluster">
            <h2 className="deals-section-title">{title}</h2>

            {showCountdown && (
              <div className="countdown-timer-badge">
                <span className="countdown-label">
                  <Clock size={14} />
                  <span>Ends in:</span>
                </span>
                <div className="countdown-digits">
                  <span className="digit-block">{pad(timeLeft.hours)}</span>
                  <span className="digit-sep">:</span>
                  <span className="digit-block">{pad(timeLeft.minutes)}</span>
                  <span className="digit-sep">:</span>
                  <span className="digit-block">{pad(timeLeft.seconds)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Optional Filter Tabs (as seen in "Trending This Week" in refer.jpg) */}
          {tabs && tabs.length > 0 && (
            <div className="deals-tab-bar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`deals-tab-pill ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Navigation Controls & View All */}
          <div className="deals-action-cluster">
            <div className="deals-scroll-arrows">
              <button
                className="deals-arrow-btn"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="deals-arrow-btn"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link to="/products" className="deals-view-all-link">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Horizontal Products Grid / Row */}
        <div className="products-horizontal-row" ref={scrollContainerRef}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id || product._id} className="deals-product-item">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="deals-empty-state">
              <p>No featured products available at this moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}