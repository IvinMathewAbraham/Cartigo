import "./Pagination.css";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="pagination">

      <button
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        {"<"}
      </button>

      {Array.from(
        { length: totalPages },
        (_, i) => (
          <button
            key={i + 1}
            className={
              currentPage === i + 1
                ? "active"
                : ""
            }
            onClick={() =>
              onPageChange(i + 1)
            }
          >
            {i + 1}
          </button>
        )
      )}

      <button
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        {">"}
      </button>

    </div>
  );
}