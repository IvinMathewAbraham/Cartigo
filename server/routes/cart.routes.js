import express from "express";
import {
  addToCartController,
  getCartController,
  updateCartItemController,
  removeCartItemController,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  addToCartValidator,
  updateCartItemValidator,
  removeCartItemValidator,
} from "../validators/cart.validator.js";

const router = express.Router();

router.post("/", protect, addToCartValidator, validate, addToCartController);
router.get("/", protect, getCartController);
router.patch("/items/:itemId", protect, updateCartItemValidator, validate, updateCartItemController);
router.delete("/items/:itemId", protect, removeCartItemValidator, validate, removeCartItemController);

export default router;