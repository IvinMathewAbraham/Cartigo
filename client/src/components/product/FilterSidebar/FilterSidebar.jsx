import "./FilterSidebar.css";

export default function FilterSidebar() {
  return (
    <aside className="filter-sidebar">

      <div className="filter-section">
        <h3>Categories</h3>

        <ul>
          <li>Ultrabooks</li>
          <li className="active">Gaming Laptops</li>
          <li>Workstations</li>
          <li>2-in-1</li>
        </ul>
      </div>

      <div className="filter-section">
        <h3>Brands</h3>

        <label>
          <input type="checkbox" />
          Apple
        </label>

        <label>
          <input type="checkbox" />
          Dell
        </label>

        <label>
          <input type="checkbox" />
          ASUS
        </label>

        <label>
          <input type="checkbox" />
          Lenovo
        </label>
      </div>

      <div className="filter-section">
        <h3>Price</h3>

        <input type="range" min="0" max="500000" />
      </div>

    </aside>
  );
}