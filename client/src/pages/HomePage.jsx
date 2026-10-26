import { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import Header from '../components/layout/Header/Header.jsx';
import CategoryBar from '../components/layout/Header/CategoryBar.jsx';
import Footer from '../components/layout/Footer/Footer.jsx';

import HeroSection from '../components/layout/HeroSection/HeroBanner.jsx';
import CategorySection from '../components/layout/CategorySection/CategorySection.jsx';
import DealsSection from '../components/layout/DealsSection/DealsSection.jsx';
import PromoBannerGrid from '../components/layout/Banner/PromoBannerGrid/PromoBannerGrid.jsx';

import { getProducts } from '../services/product.service';

import './HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({ limit: 12 });
        setProducts(response.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <Header />
      <CategoryBar />

      <main className="container home-main-content">
        {/* Campaign Hero Showcase (refer.jpg style) */}
        <HeroSection />

        {/* Circular Category Discovery Rail */}
        <CategorySection />

        {/* 3-Column Targeted Promo Cards */}
        <PromoBannerGrid />

        {/* Today's Featured Deals with Live Countdown */}
        <DealsSection
          title="Today's Featured Deals"
          products={products}
          showCountdown={true}
        />

        {/* Trust & Confidence Feature Strip */}
        <section className="storefront-trust-strip" aria-label="Store benefits and guarantees">
          <div className="trust-strip-grid">
            <div className="trust-feature-item">
              <div className="trust-icon-pill">
                <Truck size={22} />
              </div>
              <div className="trust-text-block">
                <h4>Free Express Shipping</h4>
                <p>On all prepaid orders over ₹999</p>
              </div>
            </div>

            <div className="trust-feature-item">
              <div className="trust-icon-pill">
                <ShieldCheck size={22} />
              </div>
              <div className="trust-text-block">
                <h4>100% Genuine Guarantee</h4>
                <p>Direct authentic brand warranties</p>
              </div>
            </div>

            <div className="trust-feature-item">
              <div className="trust-icon-pill">
                <RefreshCw size={22} />
              </div>
              <div className="trust-text-block">
                <h4>7 Days Easy Return</h4>
                <p>Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="trust-feature-item">
              <div className="trust-icon-pill">
                <Headphones size={22} />
              </div>
              <div className="trust-text-block">
                <h4>24/7 Dedicated Support</h4>
                <p>Expert customer assistance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending This Week with Filter Tabs */}
        <DealsSection
          title="Trending This Week"
          products={products}
          showCountdown={false}
          tabs={["Best Seller", "New Arrivals", "Top Deals", "Special Offers"]}
        />
      </main>

      <Footer />
    </div>
  );
}