import MetricCard from "./MetricCard.jsx";

function AdminDashboard() {
  return (
    <>
      <div className="admin-topbar">
        <h2>Dashboard</h2>
      </div>

      <div className="metric-grid">
        <MetricCard
          label="Total Revenue"
          value="₹8.4L"
        />

        <MetricCard
          label="Orders Today"
          value="284"
        />
      </div>
    </>
  );
}

export default AdminDashboard;