import AdminSidebar from "./AdminSidebar.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
// import AdminProducts from "./AdminProducts";
// import AdminOrders from "./AdminOrders";

function AdminPage({
  view,
  adminSection,
  setAdminSection
}) {
  return (
    <div
      id="view-admin"
      className={`view ${view === "admin" ? "active" : ""}`}
    >
      <div className="admin-layout">
        <AdminSidebar
          adminSection={adminSection}
          setAdminSection={setAdminSection}
        />

        <div className="admin-main">
          {adminSection === "dashboard" && (
            <AdminDashboard />
          )}

          {adminSection === "products" && (
            <AdminProducts />
          )}

          {adminSection === "orders" && (
            <AdminOrders />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;