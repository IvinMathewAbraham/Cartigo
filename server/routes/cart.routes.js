import express from "express";
import { addToCartController,getCartController,updateCartItemController,removeCartItemController } from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/",protect,addToCartController);
router.get("/",protect,getCartController);
router.patch("/items/:itemId",protect,updateCartItemController);
router.delete("/items/:itemId",protect,removeCartItemController);

export default router;