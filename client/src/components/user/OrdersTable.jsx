import { useEffect, useState } from "react";
import api from "../../api/api";
import '../../pages/ProfilePage.css';

export default function OrdersTable() {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response =
        await api.get("/orders");

      setOrders(
        response.data.data
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p>Loading orders...</p>;

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
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>

              <td>
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </td>

              <td>
                <span
                  className={`status-badge ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </td>

              <td>
                {
                  order.items.length
                }
              </td>

              <td>
                ₹
                {Number(
                  order.totalAmount
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}