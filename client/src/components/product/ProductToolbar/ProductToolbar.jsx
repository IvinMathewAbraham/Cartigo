import "./ProductToolbar.css";

export default function ProductToolbar({
  start,
  end,
  total,
}) {
  return (
    <div className="product-toolbar">
      <div>
        Showing {start}-{end} of {total} results
      </div>

      <select>
        <option>Featured</option>
        <option>Price Low to High</option>
        <option>Price High to Low</option>
        <option>Newest</option>
      </select>
    </div>
  );
}