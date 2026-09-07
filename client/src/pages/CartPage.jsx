import { useCart } from "../context/CartContext.jsx"; // Replaced local API hooks with Global Context Hook
import "./CartPage.css";
import Header from "../components/layout/Header/Header";

export default function CartPage() {
    // Everything is pulled clean from global context state
    const { cart, loading, handleUpdateQty, handleRemove, cartTotal } = useCart();

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
                        <button className="checkout-btn">Proceed To Checkout</button>
                    </div>
                </div>
            </div>
        </>
    );
}