import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { getImageUrl } from "../../utils/image";
import { 
  Package, 
  Calendar, 
  CreditCard, 
  ExternalLink, 
  Download, 
  X, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Check, 
  ShoppingBag,
  FileText
} from "lucide-react";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter(
      (order) => order.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [orders, statusFilter]);

  // Stepper calculations based on status string
  const getStepIndex = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered" || s === "completed") return 3;
    if (s === "shipped") return 2;
    if (s === "processing" || s === "confirmed") return 1;
    return 0; // placed/pending
  };

  const handleDownloadInvoice = (order) => {
    // Generate printable simulation receipt
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const itemsHtml = order.items?.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName || "Product"}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${Number(item.price).toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(Number(item.price) * item.quantity).toFixed(2)}</td>
      </tr>
    `).join("") || "";

    printWindow.document.write(`
      <html>
        <head>
          <title>Cartigo Invoice #${order.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
            h1 { color: #0d47a1; margin: 0; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0d47a1; padding-bottom: 20px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 8px; background: #f1f5f9; border-bottom: 2px solid #cbd5e1; }
            .totals { margin-top: 24px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>CARTIGO</h1>
              <p>Modern Online Marketplace</p>
            </div>
            <div style="text-align: right;">
              <h2>INVOICE #${order.id}</h2>
              <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Status: ${order.status}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="totals">
            <h3>Grand Total: ₹${Number(order.totalAmount).toFixed(2)}</h3>
            <p>Payment Method: Online Verified</p>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="profile-card">
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-muted)" }}>
          Loading your order history...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <h2>Order History</h2>
          <p>Track your recent shipments, manage returns, and download tax invoices</p>
        </div>

        <div className="orders-filter-bar">
          <button
            type="button"
            className={`order-filter-pill ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`order-filter-pill ${statusFilter === "processing" ? "active" : ""}`}
            onClick={() => setStatusFilter("processing")}
          >
            Processing
          </button>
          <button
            type="button"
            className={`order-filter-pill ${statusFilter === "delivered" ? "active" : ""}`}
            onClick={() => setStatusFilter("delivered")}
          >
            Delivered
          </button>
          <button
            type="button"
            className={`order-filter-pill ${statusFilter === "cancelled" ? "active" : ""}`}
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="profile-empty-state">
          <div className="profile-empty-icon">
            <ShoppingBag size={32} />
          </div>
          <h3>No Orders Found</h3>
          <p>
            {statusFilter === "all"
              ? "You haven't placed any orders yet. Discover trending products and start shopping today!"
              : `You don't have any orders with status "${statusFilter}".`}
          </p>
          <Link to="/products" className="btn-primary-navy" style={{ textDecoration: "none" }}>
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="orders-list-stack">
          {filteredOrders.map((order) => {
            const stepIndex = getStepIndex(order.status);
            const isCancelled = order.status?.toLowerCase() === "cancelled";

            return (
              <div key={order.id} className="order-item-card">
                {/* Order Top Strip */}
                <div className="order-card-top">
                  <div className="order-top-left">
                    <div className="order-id-label">Order #{order.id}</div>
                    <div className="order-date-label">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </div>
                  </div>

                  <div className="order-top-right">
                    <span className={`status-badge ${order.status ? order.status.toLowerCase() : "pending"}`}>
                      {order.status || "PENDING"}
                    </span>
                    <div className="order-total-amount">
                      ₹{Number(order.totalAmount || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Tracking Progress Stepper (unless cancelled) */}
                {!isCancelled && (
                  <div className="order-stepper-container">
                    <div className="order-stepper">
                      <div className="order-stepper-line" />
                      <div 
                        className="order-stepper-progress"
                        style={{ width: `${(stepIndex / 3) * 100}%` }}
                      />

                      {["Placed", "Confirmed", "Shipped", "Delivered"].map((step, idx) => {
                        const isCompleted = stepIndex > idx;
                        const isActive = stepIndex === idx;

                        return (
                          <div
                            key={step}
                            className={`order-step-node ${
                              isCompleted ? "completed" : isActive ? "active" : ""
                            }`}
                          >
                            <div className="order-step-circle">
                              {isCompleted ? <Check size={14} /> : idx + 1}
                            </div>
                            <span className="order-step-title">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items preview & actions */}
                <div className="order-card-body">
                  <div className="order-items-thumbnails">
                    {order.items?.slice(0, 3).map((item) => {
                      const product = item.variant?.product;
                      const rawImage = product?.images?.[0]?.url || product?.images?.[0]?.imageUrl;
                      const imgUrl = getImageUrl(rawImage);

                      return (
                        <div key={item.id} className="order-thumbnail-wrapper" title={item.productName}>
                          {imgUrl ? (
                            <img src={imgUrl} alt={item.productName || "Product"} />
                          ) : (
                            <Package size={20} color="#94A3B8" />
                          )}
                        </div>
                      );
                    })}

                    {order.items?.length > 3 && (
                      <div className="order-more-pill">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="order-actions-group">
                    <button
                      type="button"
                      className="btn-outline-subtle"
                      onClick={() => handleDownloadInvoice(order)}
                    >
                      <Download size={14} />
                      Invoice
                    </button>

                    <button
                      type="button"
                      className="btn-primary-navy"
                      style={{ height: "40px", padding: "0 18px", fontSize: "13px" }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Order Details Modal */}
      {selectedOrder && (
        <div
          className="order-modal-backdrop"
          onClick={() => setSelectedOrder(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="order-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order-modal-header">
              <h3>Order Details #{selectedOrder.id}</h3>
              <button
                type="button"
                className="order-modal-close-btn"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="order-modal-content">
              {/* Meta Grid */}
              <div className="order-modal-meta-grid">
                <div className="order-modal-meta-col">
                  <span>Order Date</span>
                  <strong>{new Date(selectedOrder.createdAt).toLocaleDateString()}</strong>
                </div>
                <div className="order-modal-meta-col">
                  <span>Current Status</span>
                  <span className={`status-badge ${selectedOrder.status ? selectedOrder.status.toLowerCase() : "pending"}`}>
                    {selectedOrder.status || "PENDING"}
                  </span>
                </div>
                <div className="order-modal-meta-col">
                  <span>Payment Status</span>
                  <strong style={{ color: "var(--color-success-text)" }}>
                    Verified Online
                  </strong>
                </div>
              </div>

              {/* Items List */}
              <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 700 }}>
                Items in this shipment ({selectedOrder.items?.length || 0})
              </h4>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {selectedOrder.items?.map((item) => {
                  const product = item.variant?.product;
                  const rawImage = product?.images?.[0]?.url || product?.images?.[0]?.imageUrl;
                  const image = getImageUrl(rawImage);

                  return (
                    <div key={item.id} className="order-modal-item-row">
                      <img
                        src={image || "https://placehold.co/80x80?text=Item"}
                        alt={item.productName || "Product"}
                        className="order-modal-item-img"
                      />
                      <div className="order-modal-item-info">
                        <h4>{item.productName}</h4>
                        <p>SKU: {item.sku || "N/A"}</p>
                        <p style={{ marginTop: "4px" }}>
                          Qty: <strong>{item.quantity}</strong> × ₹{Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="order-modal-item-price">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Financial Summary */}
              <div className="order-modal-summary-box">
                <div className="order-summary-row">
                  <span>Items Subtotal</span>
                  <span>₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
                <div className="order-summary-row">
                  <span>Express Delivery</span>
                  <span style={{ color: "var(--color-success-text)", fontWeight: 600 }}>FREE</span>
                </div>
                <div className="order-summary-row">
                  <span>GST / Platform Taxes</span>
                  <span>Included</span>
                </div>
                <div className="order-summary-row total">
                  <span>Grand Total Paid</span>
                  <span>₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Modal footer actions */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                <button
                  type="button"
                  className="btn-outline-subtle"
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                >
                  <FileText size={16} />
                  Print Tax Invoice
                </button>

                <button
                  type="button"
                  className="btn-primary-navy"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}