function AdminSidebar({
  adminSection,
  setAdminSection
}) {
  return (
    <div className="admin-nav">
      <div className="admin-logo">
       Cartigo Admin
      </div>

      <div
        className={`admin-nav-item ${
          adminSection === "dashboard"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setAdminSection("dashboard")
        }
      >
        Dashboard
      </div>

      <div
        className={`admin-nav-item ${
          adminSection === "products"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setAdminSection("products")
        }
      >
        Products
      </div>

      <div
        className={`admin-nav-item ${
          adminSection === "orders"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setAdminSection("orders")
        }
      >
        Orders
      </div>
    </div>
  );
}

export default AdminSidebar;