import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../pages/ProfilePage.css";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get("/orders");
      const orderList = response.data?.data || response.data || [];
      setOrders(Array.isArray(orderList) ? orderList : []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-card">
        <h3>My Orders</h3>
        <p style={{ color: "#6b7280", padding: "24px 0" }}>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="profile-card">
        <h3>My Orders</h3>
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>You haven't placed any orders yet.</p>
          <p style={{ fontSize: "14px" }}>Items you purchase will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <h3>My Orders</h3>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td><strong>#{order.id}</strong></td>

              <td>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>

              <td>
                <span
                  className={`status-badge ${order.status ? order.status.toLowerCase() : "pending"}`}
                >
                  {order.status || "PENDING"}
                </span>
              </td>

              <td>{order.items?.length || 0}</td>

              <td>
                ₹{Number(order.totalAmount || 0).toFixed(2)}
              </td>

              <td>
                <button
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    background: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  View Items
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Item Breakdown Modal */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px" }}>
              <h3 style={{ margin: 0 }}>Order Details #{selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "16px", fontSize: "14px", color: "#4b5563" }}>
              <p style={{ margin: "4px 0" }}><strong>Status:</strong> {selectedOrder.status}</p>
              <p style={{ margin: "4px 0" }}><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p style={{ margin: "4px 0" }}><strong>Total:</strong> ₹{Number(selectedOrder.totalAmount).toFixed(2)}</p>
            </div>

            <h4 style={{ marginBottom: "12px" }}>Purchased Items</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {selectedOrder.items?.map((item) => {
                const product = item.variant?.product;
                const rawImage = product?.images?.[0]?.url || product?.images?.[0]?.imageUrl;
                const image = rawImage
                  ? rawImage.startsWith("http")
                    ? rawImage
                    : rawImage.startsWith("/")
                    ? rawImage
                    : `/${rawImage}`
                  : "https://placehold.co/100x100";

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={image}
                      alt={item.productName || "Product"}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: "600", fontSize: "14px" }}>
                        {item.productName}
                      </p>
                      <p style={{ margin: "0 0 2px", color: "#6b7280", fontSize: "12px" }}>
                        SKU: {item.sku || "N/A"}
                      </p>
                      <p style={{ margin: 0, fontSize: "13px" }}>
                        Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: "8px 16px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}