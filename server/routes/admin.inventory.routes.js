// routes/admin.inventory.routes.js

import express from "express";
import { createInventoryController,updateInventoryController } from "../controllers/inventory.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/variants/:variantId/inventory",protect,createInventoryController);
router.patch("/variants/:variantId/inventory",protect,updateInventoryController);

export default router;