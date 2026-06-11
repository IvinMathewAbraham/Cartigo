import Hero from "./Hero";
import BestSellers from "./BestSellers";

function LandingPage({
  view,
  setView,
  products,
  addToCart
}) {
  return (
    <div
      id="view-landing"
      className={`view ${view === "landing" ? "active" : ""}`}
    >
      <Hero setView={setView} />

      <BestSellers
        products={products}
        setView={setView}
        addToCart={addToCart}
      />
    </div>
  );
}

export default LandingPage;