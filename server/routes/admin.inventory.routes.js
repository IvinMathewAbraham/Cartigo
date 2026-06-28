// routes/admin.inventory.routes.js

import express from "express";
import { createInventoryController,updateInventoryController } from "../controllers/inventory.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/variants/:variantId/inventory",protect, authorize("ADMIN"),createInventoryController);
router.patch("/variants/:variantId/inventory",protect, authorize("ADMIN"),updateInventoryController);

export default router;