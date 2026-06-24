
import ProductCard from "../product/ProductCard/ProductCard";
import { useEffect, useState } from "react";
import api from "../../api/api";
import '../../pages/ProfilePage.css';

export default function WishlistSection() {

  
  const [wishlist, setWishlist] =
    useState([]);

    

  useEffect(() => {
    loadWishlist();
  }, []);


  const loadWishlist = async () => {
    try {
      const response =
        await api.get(
          "/wishlist"
        );

      setWishlist(
        response.data.data
          ?.wishlist_item || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem =
    async (itemId) => {
      try {
        await api.delete(
          `/wishlist/${itemId}`
        );

        loadWishlist();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="profile-card">
      <h3>My Wishlist</h3>

      <div className="wishlist-grid">
        {wishlist.map((item) => {
          const variant =
            item.product_variant;

          const product =
            variant.product;

          return (
            <div
              key={item.id}
              className="wishlist-item"
            >
              <img
                src={
                  product.images?.[0]
                    ?.url
                }
                alt={product.name}
              />

              <h4>
                {product.name}
              </h4>

              <p>
                ₹
                {Number(
                  variant.price
                ).toFixed(2)}
              </p>

              <button
                onClick={() =>
                  removeItem(
                    item.id
                  )
                }
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}