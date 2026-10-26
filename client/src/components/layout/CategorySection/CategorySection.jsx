import React from "react";
import { Link } from "react-router-dom";
import { 
  Laptop, 
  Smartphone, 
  Headphones, 
  Watch, 
  Gamepad2, 
  Camera, 
  Shirt, 
  Home as HomeIcon,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import "./CategorySection.css";

const CATEGORIES = [
  {
    id: 1,
    name: "Computers & Laptops",
    shortName: "Laptops",
    icon: Laptop,
    categoryQuery: "Electronics",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    name: "Smartphones & Tablets",
    shortName: "Mobiles",
    icon: Smartphone,
    categoryQuery: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    name: "Audio & Headphones",
    shortName: "Audio",
    icon: Headphones,
    categoryQuery: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    name: "Smartwatches",
    shortName: "Watches",
    icon: Watch,
    categoryQuery: "Fashion",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    name: "Gaming & VR",
    shortName: "Gaming",
    icon: Gamepad2,
    categoryQuery: "Electronics",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 6,
    name: "Cameras & Video",
    shortName: "Cameras",
    icon: Camera,
    categoryQuery: "Electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 7,
    name: "Fashion & Apparel",
    shortName: "Fashion",
    icon: Shirt,
    categoryQuery: "Fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 8,
    name: "Home & Kitchen",
    shortName: "Home",
    icon: HomeIcon,
    categoryQuery: "Home",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=80"
  }
];

export default function CategorySection() {
  return (
    <section className="category-rail-section" aria-label="Explore popular categories">
      <div className="category-rail-card">
        <div className="category-rail-header">
          <div className="rail-title-group">
            <h3>Explore Categories</h3>
            <p>Browse by top shopping departments</p>
          </div>
          <Link to="/products" className="rail-view-all">
            <span>View All</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="category-rail-list">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.categoryQuery)}`}
                className="category-rail-item"
              >
                <div className="category-avatar-circle">
                  <img src={cat.image} alt={cat.name} className="category-avatar-img" />
                  <div className="category-icon-overlay">
                    <IconComponent size={20} />
                  </div>
                </div>
                <span className="category-rail-label">{cat.shortName}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}