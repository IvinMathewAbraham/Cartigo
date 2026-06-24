import { useEffect, useState } from "react";

import {
    getCart,
    updateCartItem,
    removeCartItem,
} from "../api/cart";

import "./CartPage.css";

export default function CartPage() {
    const [cart, setCart] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const response =
                await getCart();


            setCart(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }


    };

    const increaseQty =
        async (item) => {
            await updateCartItem(
                item.id,
                item.quantity + 1
            );


            loadCart();
        };


    const decreaseQty =
        async (item) => {
            if (item.quantity <= 1)
                return;


            await updateCartItem(
                item.id,
                item.quantity - 1
            );

            loadCart();
        };


    const handleRemove =
        async (itemId) => {
            await removeCartItem(
                itemId
            );


            loadCart();
        };


    const calculateTotal = () => {
        if (
            !cart ||
            !cart.items
        )
            return 0;


        return cart.items.reduce(
            (total, item) =>
                total +
                Number(
                    item.variant.price
                ) *
                item.quantity,
            0
        );


    };

    if (loading) {
        return (<div className="cart-page">
            Loading Cart... </div>
        );
    }

    if (
        !cart ||
        cart.items.length === 0
    ) {
        return (<div className="cart-page"> <div className="empty-cart"> <h2>
            Your cart is empty </h2>
            <p>
                Add some products
                to get started.
            </p>
        </div>
        </div>
        );


    }

    return (<div className="cart-page"> <div className="cart-layout"> <div className="cart-items"> <h2>Shopping Cart</h2>


        {cart.items.map(
            (item) => {
                const product =
                    item.variant
                        .product;

                const image =
                    product
                        .images?.[0]
                        ?.imageUrl;

                return (
                    <div
                        key={item.id}
                        className="cart-item"
                    >
                        <img
                            src={
                                image ||
                                "https://placehold.co/200x200"
                            }
                            alt={
                                product.name
                            }
                        />

                        <div className="cart-info">
                            <h3>
                                {
                                    product.name
                                }
                            </h3>

                            <p>
                                ₹
                                {
                                    item
                                        .variant
                                        .price
                                }
                            </p>

                            <div className="quantity-controls">
                                <button
                                    onClick={() =>
                                        decreaseQty(
                                            item
                                        )
                                    }
                                >
                                    −
                                </button>

                                <span>
                                    {
                                        item.quantity
                                    }
                                </span>

                                <button
                                    onClick={() =>
                                        increaseQty(
                                            item
                                        )
                                    }
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="remove-btn"
                                onClick={() =>
                                    handleRemove(
                                        item.id
                                    )
                                }
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                );
            }
        )}
    </div>

        <div className="cart-summary">
            <h3>
                Order Summary
            </h3>

            <div className="summary-row">
                <span>
                    Subtotal
                </span>

                <span>
                    ₹
                    {calculateTotal().toFixed(
                        2
                    )}
                </span>
            </div>

            <div className="summary-row">
                <span>
                    Shipping
                </span>

                <span>
                    Free
                </span>
            </div>

            <hr />

            <div className="summary-row total">
                <span>Total</span>

                <span>
                    ₹
                    {calculateTotal().toFixed(
                        2
                    )}
                </span>
            </div>

            <button className="checkout-btn">
                Proceed To Checkout
            </button>
        </div>
    </div>
    </div>


    );
}
