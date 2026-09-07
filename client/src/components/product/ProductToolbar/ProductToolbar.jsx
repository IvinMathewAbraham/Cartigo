import "./ProductToolbar.css";

export default function ProductToolbar({
  start,
  end,
  total,
  sortBy = "newest",
  onChangeSortBy,
}) {
  return (
    <div className="product-toolbar">
      <div>
        Showing {total === 0 ? 0 : start}-{end} of {total} results
      </div>

      <select
        value={sortBy}
        onChange={(e) => onChangeSortBy && onChangeSortBy(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="name_asc">Name: A to Z</option>
        <option value="name_desc">Name: Z to A</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}