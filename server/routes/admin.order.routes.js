// routes/order.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { updateOrderStatusController,getAllOrdersController,getOrderDetailsController } from "../controllers/order.controller.js";



const router = express.Router();

router.get(
  "/",
  protect,
  getAllOrdersController
);

// PATCH /api/admin/orders/:id/status
router.patch("/:id/status", protect, updateOrderStatusController);

router.get(
  "/:id",
  protect,
  getOrderDetailsController
);


export default router;