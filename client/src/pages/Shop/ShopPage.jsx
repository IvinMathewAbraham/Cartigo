// ShopPage.jsx

import FilterSidebar from "../../features/categories/FilterSidebar.jsx";
import ProductGrid from "../../features/products/ProductGrid.jsx";

function ShopPage({
  view,
  products,
  addToCart
}) {
  return (
    <div
      id="view-shop"
      className={`view ${view === "shop" ? "active" : ""}`}
    >
      <div className="shop-layout">
        <FilterSidebar />

        <div className="shop-main">
          <div className="shop-toolbar">
            <span>
              1–12 of <strong>4,823</strong> results for{" "}
              <strong>"electronics"</strong>
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <label>Sort by:</label>

              <select className="sort-select">
                <option>Featured</option>
              </select>
            </div>
          </div>

          <ProductGrid
            products={products}
            onAddToCart={addToCart}
          />
        </div>
      </div>
    </div>
  );
}

export default ShopPage;