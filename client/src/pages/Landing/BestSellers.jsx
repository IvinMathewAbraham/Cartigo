import ProductGrid from '../../features/products/ProductGrid.jsx';

function BestSellers({
  products,
  setView,
  addToCart
}) {
  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">
           Best Sellers
        </div>

        <span
          className="see-all"
          onClick={() => setView("shop")}
        >
          View all products →
        </span>
      </div>

      <ProductGrid
        products={products}
        onAddToCart={addToCart}
      />
    </div>
  );
}

export default BestSellers;