import prisma from "../config/client.js";
import { addToCart,getCart,updateCartItem,removeCartItem } from '../services/cart.service.js';


// POST /api/cart
export const addToCartController = async (req, res) => {
    try {
      const {
        variantId,
        quantity,
      } = req.body;

      const item =
        await addToCart(
          req.user.id,
          variantId,
          quantity
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

// GET /api/cart
export const getCartController = async (req, res) => {
    try {
      const cart =
        await getCart(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// PATCH /api/cart/items/:itemId
export const updateCartItemController = async (req, res) => {
    try {
      const { itemId } =
        req.params;

      const { quantity } =
        req.body;

      const item =
        await updateCartItem(
          req.user.id,
          itemId,
          Number(quantity)
        );

      return res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      return res.status(error.message.includes("unauthorized") ? 403 : 400).json({
        success: false,
        message: error.message,
      });
    }
  };

//DELETE /api/cart/items/:itemId
export const removeCartItemController = async (req, res) => {
    try {
      const { itemId } =
        req.params;

      await removeCartItem(
        req.user.id,
        itemId
      );

      return res.status(200).json({
        success: true,
        message:
          "Item removed from cart",
      });
    } catch (error) {
      return res.status(error.message.includes("unauthorized") ? 403 : 400).json({
        success: false,
        message: error.message,
      });
    }
  };