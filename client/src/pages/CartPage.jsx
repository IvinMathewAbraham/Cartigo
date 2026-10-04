import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { checkout, getShippingMethods } from "../api/order";
import { getAddresses } from "../api/address";
import "./CartPage.css";
import Header from "../components/layout/Header/Header";

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
                setErrorMessage("Select a shipping address before checking out.");
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
            setErrorMessage(error.response?.data?.message || error.message || "Failed to complete checkout");
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

    if (loading) {
        return <div className="cart-page-loader">Loading Cart...</div>;
    }

    if (!cart?.items || cart.items.length === 0) {
        return (
            <>
                <Header />
                <div className="cart-page">
                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="cart-page">
                {errorMessage && (
                    <div style={{ padding: "12px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "16px" }}>
                        {errorMessage}
                    </div>
                )}
                <div className="cart-layout">
                    {/* Cart Items List */}
                    <div className="cart-items">
                        <h2>Shopping Cart</h2>
                        {cart.items.map((item) => {
                            const product = item.variant?.product;
                            const rawImage = product?.images?.[0]?.url || product?.images?.[0]?.imageUrl;
                            const image = rawImage ? (rawImage.startsWith("http") ? rawImage : rawImage.startsWith("/") ? rawImage : `/${rawImage}`) : "https://placehold.co/200x200";

                            if (!product) return null;

                            return (
                                <div key={item.id} className="cart-item">
                                    <img src={image} alt={product.name} />
                                    <div className="cart-info">
                                        <h3>{product.name}</h3>
                                        <p className="item-price">₹{Number(item.variant?.price).toFixed(2)}</p>

                                        <div className="quantity-controls">
                                            <button 
                                                disabled={item.quantity <= 1}
                                                onClick={() => handleUpdateQty(item, item.quantity - 1)}
                                            >
                                                −
                                            </button>
                                            <span className="qty-display">{item.quantity}</span>
                                            <button onClick={() => handleUpdateQty(item, item.quantity + 1)}>
                                                +
                                            </button>
                                        </div>

                                        <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sticky Order Summary Card */}
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <label className="checkout-field">
                            Delivery method
                            <select value={shippingMethod} onChange={(event) => setShippingMethod(event.target.value)}>
                                {shippingMethods.map((method) => (
                                    <option key={method.code} value={method.code}>
                                        {method.name} - {method.fee === 0 ? "Free" : `₹${method.fee.toFixed(2)}`} ({method.estimatedDelivery.from} to {method.estimatedDelivery.to})
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="checkout-field">
                            Shipping address
                            <select value={addressId} onChange={(event) => setAddressId(event.target.value)}>
                                <option value="">Select an address</option>
                                {addresses.map((address) => (
                                    <option key={address.id} value={address.id}>
                                        {address.label || address.addressLine1}, {address.city}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="checkout-field">
                            Mock payment result
                            <select value={paymentOutcome} onChange={(event) => setPaymentOutcome(event.target.value)}>
                                <option value="success">Approve payment</option>
                                <option value="failure">Simulate payment failure</option>
                            </select>
                        </label>
                        <p className="checkout-note">
                            Test mode only. No card details or external payment provider are used.
                        </p>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shippingFee === 0 ? "Free" : `₹${shippingFee.toFixed(2)}`}</span>
                        </div>
                        <hr className="summary-divider" />
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{(cartTotal + shippingFee).toFixed(2)}</span>
                        </div>
                        <button 
                            className="checkout-btn" 
                            onClick={handleCheckout}
                            disabled={checkingOut}
                        >
                            {checkingOut ? "Processing..." : "Pay and Place Order"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}