import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { getImageUrl } from "../../utils/image";
import { useCart } from "../../context/CartContext";
import { Heart, ShoppingCart, Trash2, Check, Package } from "lucide-react";

export default function WishlistSection() {
  const { handleAddToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const response = await api.get("/wishlist");
      setWishlist(response.data?.data?.wishlist_item || response.data?.wishlist_item || []);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/wishlist/${itemId}`);
      setFeedback({ type: "success", message: "Item removed from your wishlist." });
      loadWishlist();
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Failed to remove item." });
    }
  };

  const handleMoveToCart = async (item) => {
    const variantId = item.product_variant_id || item.product_variant?.id;
    if (!variantId) return;

    try {
      setAddingId(item.id);
      const success = await handleAddToCart(variantId, 1);
      if (success) {
        setAddedIds((prev) => new Set(prev).add(item.id));
        setFeedback({ type: "success", message: "Item successfully moved to cart!" });
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="profile-card">
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-muted)" }}>
          Loading your saved wishlist items...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <h2>My Wishlist</h2>
          <p>Saved products you want to buy later or track prices on</p>
        </div>
      </div>

      {feedback && (
        <div className={`profile-feedback-banner ${feedback.type}`} role="alert">
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 600 }}
          >
            ✕
          </button>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="profile-empty-state">
          <div className="profile-empty-icon">
            <Heart size={32} />
          </div>
          <h3>Your Wishlist is Empty</h3>
          <p>
            Explore our curated catalog and tap the heart icon on any product to save it here for later.
          </p>
          <Link to="/products" className="btn-primary-navy" style={{ textDecoration: "none" }}>
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid-container">
          {wishlist.map((item) => {
            const variant = item.product_variant || {};
            const product = variant.product || {};
            const rawImage = product.images?.[0]?.url || product.images?.[0]?.imageUrl;
            const imageUrl = getImageUrl(rawImage);
            const isAdded = addedIds.has(item.id);
            const isAdding = addingId === item.id;

            return (
              <div key={item.id} className="wishlist-card">
                <button
                  type="button"
                  className="wishlist-remove-btn"
                  onClick={() => removeItem(item.id)}
                  title="Remove from wishlist"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>

                <div className="wishlist-card-media">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name || "Product"} />
                  ) : (
                    <Package size={40} color="#94A3B8" />
                  )}
                </div>

                <div className="wishlist-card-content">
                  <h4 className="wishlist-item-title" title={product.name}>
                    {product.name || "Cartigo Item"}
                  </h4>

                  <div className="wishlist-item-price">
                    ₹{Number(variant.price || product.basePrice || 0).toFixed(2)}
                  </div>

                  <button
                    type="button"
                    className="wishlist-cart-btn"
                    onClick={() => handleMoveToCart(item)}
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      "Adding..."
                    ) : isAdded ? (
                      <>
                        <Check size={16} /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} /> Move to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}