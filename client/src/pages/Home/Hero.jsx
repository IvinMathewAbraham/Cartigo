function Hero({ setView }) {
  return (
    <div className="hero">
      <div className="hero-text">
        <h1>
          Everything you need,
          <br />
          <span>delivered fast.</span>
        </h1>

        <p>
          Shop millions of products across electronics,
          fashion, home & more.
        </p>

        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => setView("shop")}
          >
            Shop Now →
          </button>
        </div>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="num">2M+</div>
          <div className="lbl">Products</div>
        </div>

        <div className="hero-stat">
          <div className="num">1-Day</div>
          <div className="lbl">Delivery</div>
        </div>

        <div className="hero-stat">
          <div className="num">4.8★</div>
          <div className="lbl">Avg Rating</div>
        </div>
      </div>
    </div>
  );
}

export default Hero;