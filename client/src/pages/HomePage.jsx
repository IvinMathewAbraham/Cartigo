import { useState, useEffect } from 'react';
import Header from '../components/layout/Header/Header.jsx';
import CategoryBar from '../components/layout/Header/CategoryBar.jsx';
import Footer from '../components/layout/Footer/Footer.jsx';

import HeroSection from '../components/layout/HeroSection/HeroBanner.jsx';
import CategorySection from '../components/layout/CategorySection/CategorySection.jsx';
import DealsSection from '../components/layout/DealsSection/DealsSection.jsx';
import PromoBannerGrid from '../components/layout/Banner/PromoBannerGrid/PromoBannerGrid.jsx';
import Testimonials from '../components/layout/Testimonials/Testimonials.jsx';

import { getProducts } from '../services/product.service';

import './HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ limit: 10 });
        setProducts(response.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <Header />
      <CategoryBar />
      <main className="container">
        <HeroSection />
        <CategorySection />
        <DealsSection
          title="Today's Best Deals"
          products={products} />
        <PromoBannerGrid />
        <DealsSection
          title="Top Picks For You"
          products={products} />
        <DealsSection
          title="Best Sellers"
          products={products} />
      </main>
      <Footer />
    </div>
  );
}