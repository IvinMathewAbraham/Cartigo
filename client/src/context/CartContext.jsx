import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../api/cart';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadCart = async () => {
        try {
            const response = await getCart();
            setCart(response.data);
        } catch (error) {
            console.error("Failed to load cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleUpdateQty = async (item, newQuantity) => {
        if (newQuantity < 1) return;
        const originalCart = { ...cart };
        
        // Optimistic Update
        setCart(prev => ({
            ...prev,
            items: prev.items.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i)
        }));

        try {
            await updateCartItem(item.id, newQuantity);
        } catch (error) {
            setCart(originalCart); // Revert on failure
        }
    };

    const handleRemove = async (itemId) => {
        const originalCart = { ...cart };
        
        // Optimistic Update
        setCart(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== itemId)
        }));

        try {
            await removeCartItem(itemId);
        } catch (error) {
            setCart(originalCart);
        }
    };

    const cartTotal = useMemo(() => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => {
            const price = Number(item.variant?.price) || 0;
            return total + price * item.quantity;
        }, 0);
    }, [cart]);

    const handleAddToCart = async (variantId, quantity = 1) => {
    try {
        await addToCart(variantId, quantity);

        // Refresh cart from server
        await loadCart();

        return true;
    } catch (error) {
        console.error("Failed to add to cart", error);
        return false;
    }
};

    return (
        <CartContext.Provider value={{ cart, loading, handleUpdateQty, handleRemove, cartTotal, handleAddToCart,     refreshCart: loadCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);