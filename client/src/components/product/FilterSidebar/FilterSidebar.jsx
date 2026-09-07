import { useEffect, useState } from "react";
import { getCategories } from "../../../services/category.service";
import { getBrands } from "../../../services/brand.service";
import "./FilterSidebar.css";

export default function FilterSidebar({
  selectedCategory = "",
  onSelectCategory,
  selectedBrand = "",
  onSelectBrand,
  maxPrice = "",
  onChangeMaxPrice,
  onResetFilters,
}) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const [catsRes, brandsRes] = await Promise.allSettled([
          getCategories(),
          getBrands(),
        ]);

        if (catsRes.status === "fulfilled" && catsRes.value) {
          const catList = catsRes.value.data || catsRes.value.categories || catsRes.value || [];
          setCategories(Array.isArray(catList) ? catList : []);
        }

        if (brandsRes.status === "fulfilled" && brandsRes.value) {
          const brandList = brandsRes.value.data || brandsRes.value.brands || brandsRes.value || [];
          setBrands(Array.isArray(brandList) ? brandList : []);
        }
      } catch (error) {
        console.error("Failed to load filter metadata:", error);
      }
    }

    fetchMetadata();
  }, []);

  return (
    <aside className="filter-sidebar">
      <div className="filter-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3>Filters</h3>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              fontSize: "13px",
              padding: 0,
            }}
          >
            Reset All
          </button>
        )}
      </div>

      <div className="filter-section">
        <h3>Categories</h3>
        <ul>
          <li
            className={!selectedCategory ? "active" : ""}
            onClick={() => onSelectCategory && onSelectCategory("")}
            style={{ cursor: "pointer" }}
          >
            All Categories
          </li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={selectedCategory === cat.id.toString() ? "active" : ""}
              onClick={() => onSelectCategory && onSelectCategory(cat.id.toString())}
              style={{ cursor: "pointer" }}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h3>Brands</h3>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", cursor: "pointer" }}>
          <input
            type="radio"
            name="brandFilter"
            checked={!selectedBrand}
            onChange={() => onSelectBrand && onSelectBrand("")}
          />
          All Brands
        </label>
        {brands.map((b) => (
          <label
            key={b.id}
            style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", cursor: "pointer" }}
          >
            <input
              type="radio"
              name="brandFilter"
              checked={selectedBrand === b.id.toString()}
              onChange={() => onSelectBrand && onSelectBrand(b.id.toString())}
            />
            {b.name}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Max Price {maxPrice ? `(₹${Number(maxPrice).toLocaleString()})` : "(Any)"}</h3>
        <input
          type="range"
          min="0"
          max="300000"
          step="5000"
          value={maxPrice || 300000}
          onChange={(e) => onChangeMaxPrice && onChangeMaxPrice(e.target.value === "300000" ? "" : e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
          <span>₹0</span>
          <span>₹3,00,000+</span>
        </div>
      </div>
    </aside>
  );
}