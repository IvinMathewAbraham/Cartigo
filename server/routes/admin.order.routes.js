// routes/order.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { updateOrderStatusController,getAllOrdersController,getOrderDetailsController } from "../controllers/order.controller.js";
import { updateReturnStatus } from "../services/return.service.js";

import { authorize } from "../middleware/auth.middleware.js";


const router = express.Router();

// GET /api/admin/orders
router.get("/",protect,authorize("ADMIN"),getAllOrdersController);

// PATCH /api/admin/orders/:id/status
router.patch("/:id/status", protect, authorize("ADMIN"), updateOrderStatusController);

// GET /api/admin/orders/:id
router.get("/:id",protect,authorize("ADMIN"),getOrderDetailsController);
router.patch("/returns/:id/status", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const allowed = ["APPROVED", "REJECTED", "COMPLETED"];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid return status" });
    }
    const result = await updateReturnStatus(req.user.id, req.params.id, req.body.status);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
});


export default router;