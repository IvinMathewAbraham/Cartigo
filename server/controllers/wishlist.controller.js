// wishlist.controller.js

import prisma from "../config/client.js";
import { addToWishlist,getWishlist,removeWishlistItem } from "../services/wishlist.service.js";

// POST /api/wishlist

export const addToWishlistController = async (req, res) => {
    try {
      const { variantId } =
        req.body;

      const item =
        await addToWishlist(
          req.user.id,
          variantId
        );

      return res.status(201).json({
        success: true,
        data: item,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// GET /api/wishlist
export const getWishlistController = async (req, res) => {
    try {
      const wishlist =
        await getWishlist(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        data: wishlist,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// DELETE /api/wishlist/:itemId
export const removeWishlistItemController = async (req, res) => {
    try {
      const { itemId } =
        req.params;

      await removeWishlistItem(
        req.user.id,
        itemId
      );

      return res.status(200).json({
        success: true,
        message:
          "Item removed from wishlist",
      });
    } catch (error) {
      return res.status(error.message.includes("unauthorized") ? 403 : 400).json({
        success: false,
        message: error.message,
      });
    }
  };