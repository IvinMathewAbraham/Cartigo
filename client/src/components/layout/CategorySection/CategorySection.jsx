import React from "react";
import "./CategorySection.css";

const categories = [
  {
    id: 1,
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
  {
    id: 2,
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  },
  {
    id: 3,
    name: "Luxury",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
  },
  {
    id: 4,
    name: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 5,
    name: "Health & Beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    id: 6,
    name: "Groceries",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e",
  },
  {
    id: 7,
    name: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: 8,
    name: "Gaming",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3",
  },
];

export default function CategorySection() {
  return (
    <section className="popular-categories">
      <div className="container">

        <div className="popular-header">
          <h2>Explore Popular Categories</h2>

          <button className="view-all-btn">
            View All →
          </button>
        </div>

        <div className="category-slider">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-item"
            >
              <div className="category-image">
                <img
                  src={category.image}
                  alt={category.name}
                />
              </div>

              <span>{category.name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}