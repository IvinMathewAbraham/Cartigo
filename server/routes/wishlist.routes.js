// routes/wishlist.routes.js

import express from "express";
import { addToWishlistController,getWishlistController,removeWishlistItemController } from "../controllers/wishlist.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",protect,addToWishlistController);
router.get("/",protect,getWishlistController);
router.delete("/:itemId",protect,removeWishlistItemController);


export default router;