import React, { useEffect, useState } from "react";
import "./HeroBanner.css";

import { slides } from "../../../assets/slides.js";

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section className="hero-banner">
      <div
        className="hero-slider"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((slide) => (
          <div className="hero-slide" key={slide.id}>
            <div className="hero-overlay"></div>

            <img
              src={slide.image}
              alt={slide.title}
              className="hero-bg"
            />

            <div className="hero-content">
              <span className="hero-badge">
                {slide.badge}
              </span>

              <h1>
                {slide.title}
                <span> {slide.highlight}</span>
              </h1>

              <p>{slide.description}</p>

              <button className="hero-btn">
                {slide.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="arrow left" onClick={prevSlide}>
        ❮
      </button>

      <button className="arrow right" onClick={nextSlide}>
        ❯
      </button>

      <div className="dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${
              current === index ? "active" : ""
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
}