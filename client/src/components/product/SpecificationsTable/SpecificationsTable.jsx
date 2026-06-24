import "./SpecificationsTable.css";

export default function SpecificationsTable({ product }) {
  const specifications = [
    {
      label: "Brand",
      value: product.brand?.name,
    },
    {
      label: "Category",
      value: product.category?.name,
    },
    {
      label: "SKU",
      value: product.variants?.[0]?.sku,
    },
    {
      label: "Price",
      value: `₹${product.variants?.[0]?.price}`,
    },
    {
      label: "Stock",
      value: product.variants?.[0]?.stock,
    },
  ];

  return (
    <section
      id="specifications"
      className="specifications"
    >
      <h2>Specifications</h2>

      <div className="spec-table">
        {specifications.map((spec, index) => (
          <div
            className="spec-row"
            key={index}
          >
            <span className="spec-name">
              {spec.label}
            </span>

            <span className="spec-value">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}