import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { slides } from "../../../assets/slides.js";
import "./HeroBanner.css";

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="hero-banner-wrapper" aria-label="Promotional campaign banner">
      <div className="hero-banner">
        <div
          className="hero-slider"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div className="hero-slide" key={slide.id}>
              {/* Reference Gradient Backdrop: Deep Navy to Vibrant Blue */}
              <div className="hero-gradient-backdrop" />

              <div className="hero-grid-layout">
                {/* Left: Campaign Copy & Actions */}
                <div className="hero-content">
                  <span className="hero-badge">{slide.badge}</span>

                  <h1 className="hero-title">
                    {slide.title}
                    <span className="hero-highlight"> {slide.highlight}</span>
                  </h1>

                  {slide.priceText && (
                    <div className="hero-price-strip">
                      <span className="price-label">Special Offer:</span>
                      <strong className="price-value">{slide.priceText}</strong>
                    </div>
                  )}

                  <p className="hero-description">{slide.description}</p>

                  <div className="hero-actions">
                    <Link
                      to={`/products?category=${encodeURIComponent(slide.category || 'All')}`}
                      className="hero-cta-pill"
                    >
                      <span>{slide.button}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Right: Cutout Product Visual */}
                <div className="hero-media-wrapper">
                  <div className="hero-media-card">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="hero-product-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Circular Slider Controls */}
        <button
          className="hero-nav-arrow prev"
          onClick={prevSlide}
          aria-label="Previous campaign slide"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          className="hero-nav-arrow next"
          onClick={nextSlide}
          aria-label="Next campaign slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Indicator Dots */}
        <div className="hero-indicator-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${current === index ? "active" : ""}`}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}