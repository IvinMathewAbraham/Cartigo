// routes/order.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { updateOrderStatusController,getAllOrdersController,getOrderDetailsController } from "../controllers/order.controller.js";

import { authorize } from "../middleware/auth.middleware.js";


const router = express.Router();

// GET /api/admin/orders
router.get("/",protect,authorize("ADMIN"),getAllOrdersController);

// PATCH /api/admin/orders/:id/status
router.patch("/:id/status", protect, authorize("ADMIN"), updateOrderStatusController);

// GET /api/admin/orders/:id
router.get("/:id",protect,authorize("ADMIN"),getOrderDetailsController);


export default router;