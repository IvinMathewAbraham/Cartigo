import { useState } from "react";
import "./CategoryBar.css";

const categories = [
  {
    name: "Electronics",
    subcategories: [
      "Laptops",
      "Mobiles",
      "Gaming",
      "Monitors",
      "Accessories",
      "Components"
    ]
  },
  {
    name: "Fashion",
    subcategories: ["Men", "Women", "Footwear", "Watches"]
  },
  {
    name: "Home",
    subcategories: ["Furniture", "Kitchen", "Decor"]
  },
  {
    name: "Beauty",
    subcategories: ["Makeup", "Skincare", "Hair Care"]
  },
  {
    name: "Sports",
    subcategories: ["Fitness", "Cricket", "Football"]
  },
  {
    name: "Books",
    subcategories: ["Fiction", "Academic", "Technology"]
  },
  {
    name: "Automotive",
    subcategories: ["Car Accessories", "Bike Accessories"]
  }
];

export default function CategoryBar() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState(categories[0]);

  return (
    <div className="category-bar-wrapper">

      <div className="category-bar">

        <button
          className="all-btn"
          onClick={() => setOpen(!open)}
        >
          ☰ All
        </button>

        <div className="nav-links">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="nav-link"
            >
              {cat.name}
            </a>
          ))}
        </div>

      </div>

      {open && (
        <div className="mega-menu">

          <div className="mega-sidebar">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className={`mega-item ${
                  activeCategory.name === cat.name
                    ? "active"
                    : ""
                }`}
                onMouseEnter={() =>
                  setActiveCategory(cat)
                }
              >
                <span>{cat.name}</span>
                <span>›</span>
              </div>
            ))}
          </div>

          <div className="mega-content">

            <h3>{activeCategory.name}</h3>

            <div className="subcategory-grid">
              {activeCategory.subcategories.map(
                (sub) => (
                  <a
                    key={sub}
                    href="#"
                    className="subcategory-card"
                  >
                    {sub}
                  </a>
                )
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}