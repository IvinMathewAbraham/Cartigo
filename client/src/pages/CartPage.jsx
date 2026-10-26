import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CreditCard, 
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { checkout, getShippingMethods } from "../api/order";
import { getAddresses } from "../api/address";
import { getImageUrl } from "../utils/image";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import "./CartPage.css";

export default function CartPage() {
  const { cart, loading, handleUpdateQty, handleRemove, cartTotal, clearCart, refreshCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [paymentOutcome, setPaymentOutcome] = useState("success");
  const [shippingMethods, setShippingMethods] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("STANDARD");
  const navigate = useNavigate();

  const selectedShipping = shippingMethods.find((method) => method.code === shippingMethod);
  const shippingFee = selectedShipping?.fee || 0;
  const grandTotal = cartTotal + shippingFee;

  useEffect(() => {
    loadAddresses();
    getShippingMethods()
      .then((response) => setShippingMethods(response?.data || []))
      .catch(() => setErrorMessage("Unable to load shipping methods."));
  }, []);

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      setErrorMessage("");

      if (!addressId) {
        setErrorMessage("Please select or add a delivery address before placing order.");
        return;
      }

      if (addresses.length === 0) {
        navigate("/profile", { state: { tab: "addresses" } });
        return;
      }

      await checkout({
        addressId,
        paymentProvider: "MOCK",
        shippingMethod,
        paymentDetails: {
          outcome: paymentOutcome,
        },
      });

      clearCart();
      await refreshCart();
      navigate("/profile", { state: { tab: "orders" } });
    } catch (error) {
      console.error("Checkout failed:", error);
      setErrorMessage(error.response?.data?.message || error.message || "Failed to complete checkout.");
    } finally {
      setCheckingOut(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const addressResponse = await getAddresses();
      const availableAddresses = addressResponse?.data || addressResponse || [];
      setAddresses(availableAddresses);
      setAddressId(String(availableAddresses.find((address) => address.isDefault)?.id || availableAddresses[0]?.id || ""));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to load shipping addresses.");
    }
  };

  const totalItemCount = cart?.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  return (
    <div className="cart-page-wrapper">
      <Header />

      <main className="container cart-main-content">
        <div className="cart-page-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count-pill">
            {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
          </span>
        </div>

        {errorMessage && (
          <div className="cart-alert-error" role="alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="cart-loading-box">
            <div className="cart-spinner" />
            <p>Loading your shopping cart...</p>
          </div>
        ) : !cart?.items || cart.items.length === 0 ? (
          <div className="cart-empty-panel">
            <div className="empty-cart-avatar">
              <ShoppingBag size={56} />
            </div>
            <h2>Your shopping cart is empty</h2>
            <p>Explore thousands of premium products and discover great deals today.</p>
            <Link to="/products" className="explore-catalog-btn">
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="cart-split-layout">
            {/* Left: Line Items List */}
            <div className="cart-items-column">
              <div className="cart-items-card">
                <div className="cart-items-table-header">
                  <span>Product</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>

                <div className="cart-items-body">
                  {cart.items.map((item) => {
                    const product = item.variant?.product;
                    const image = getImageUrl(product?.images?.[0]?.url);
                    const unitPrice = Number(item.variant?.price || 0);
                    const itemSubtotal = unitPrice * item.quantity;

                    if (!product) return null;

                    return (
                      <div key={item.id} className="cart-line-item">
                        <div className="item-details-cluster">
                          <Link to={`/products/${product.id}`} className="item-thumbnail-link">
                            <img src={image} alt={product.name} />
                          </Link>

                          <div className="item-text-info">
                            <Link to={`/products/${product.id}`} className="item-name-link">
                              {product.name}
                            </Link>

                            {item.variant?.name && (
                              <span className="item-variant-chip">{item.variant.name}</span>
                            )}

                            <span className="item-unit-price tabular-numbers">
                              ₹{unitPrice.toLocaleString('en-IN')} each
                            </span>
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="item-quantity-column">
                          <div className="cart-qty-stepper">
                            <button
                              disabled={item.quantity <= 1}
                              onClick={() => handleUpdateQty(item, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="qty-digit tabular-numbers">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQty(item, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="item-remove-trigger"
                            onClick={() => handleRemove(item.id)}
                            aria-label={`Remove ${product.name} from cart`}
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Line Item Total */}
                        <div className="item-subtotal-column">
                          <span className="line-item-total tabular-numbers">
                            ₹{itemSubtotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security & Delivery Reassurance */}
              <div className="cart-trust-badges-bar">
                <div className="cart-trust-item">
                  <ShieldCheck size={18} />
                  <span>Safe & Secure Checkout</span>
                </div>
                <div className="cart-trust-item">
                  <Truck size={18} />
                  <span>Free Express Delivery Available</span>
                </div>
              </div>
            </div>

            {/* Right: Sticky Order Summary & Simulation Box */}
            <div className="cart-summary-column">
              <div className="cart-summary-card">
                <h3>Order Summary</h3>

                {/* Delivery Method Selector */}
                <div className="summary-field-group">
                  <label htmlFor="shipping-select">
                    <Truck size={15} />
                    <span>Delivery Method</span>
                  </label>
                  <select
                    id="shipping-select"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  >
                    {shippingMethods.map((method) => (
                      <option key={method.code} value={method.code}>
                        {method.name} ({method.fee === 0 ? "FREE" : `₹${method.fee}`} • {method.estimatedDelivery?.from} to {method.estimatedDelivery?.to})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shipping Address Selector */}
                <div className="summary-field-group">
                  <div className="field-label-with-link">
                    <label htmlFor="address-select">
                      <MapPin size={15} />
                      <span>Delivery Address</span>
                    </label>
                    <Link to="/profile" className="manage-addr-link">Manage</Link>
                  </div>
                  <select
                    id="address-select"
                    value={addressId}
                    onChange={(e) => setAddressId(e.target.value)}
                  >
                    <option value="">Select a saved delivery address</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.label || address.addressLine1}, {address.city} ({address.postalCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Simulation Mode Selector */}
                <div className="summary-field-group simulation-group">
                  <label htmlFor="payment-outcome-select">
                    <CreditCard size={15} />
                    <span>Payment Simulation Mode</span>
                  </label>
                  <select
                    id="payment-outcome-select"
                    value={paymentOutcome}
                    onChange={(e) => setPaymentOutcome(e.target.value)}
                  >
                    <option value="success">Approve Payment (Simulate Success)</option>
                    <option value="failure">Decline Payment (Simulate Failure)</option>
                  </select>
                  <span className="simulation-notice">
                    Test mode: No real payment gateway or cards are charged.
                  </span>
                </div>

                <div className="summary-divider-line" />

                {/* Price Breakdown */}
                <div className="summary-breakdown">
                  <div className="breakdown-row">
                    <span>Items Subtotal</span>
                    <span className="tabular-numbers">₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="breakdown-row">
                    <span>Estimated Shipping</span>
                    <span className={`tabular-numbers ${shippingFee === 0 ? "free-text" : ""}`}>
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="breakdown-row">
                    <span>Estimated Taxes</span>
                    <span className="tabular-numbers">Included</span>
                  </div>

                  <div className="summary-divider-line" />

                  <div className="breakdown-row grand-total-row">
                    <span>Total Amount</span>
                    <span className="grand-total-val tabular-numbers">
                      ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  className="cart-checkout-cta"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Place Order & Pay</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}