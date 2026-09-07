import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../api/order";
import { getAddresses } from "../api/address";
import "./CartPage.css";
import Header from "../components/layout/Header/Header";

export default function CartPage() {
    const { cart, loading, handleUpdateQty, handleRemove, cartTotal, clearCart, refreshCart } = useCart();
    const [checkingOut, setCheckingOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            setCheckingOut(true);
            setErrorMessage("");

            // Check if user has an address configured
            const addressResponse = await getAddresses();
            const addresses = addressResponse?.data || addressResponse || [];

            if (addresses.length === 0) {
                alert("Please add a shipping address in your profile before checking out.");
                navigate("/profile", { state: { tab: "addresses" } });
                return;
            }

            // Create order
            await createOrder();
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
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <hr className="summary-divider" />
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <button 
                            className="checkout-btn" 
                            onClick={handleCheckout}
                            disabled={checkingOut}
                        >
                            {checkingOut ? "Processing..." : "Proceed To Checkout"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}