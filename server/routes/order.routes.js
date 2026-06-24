// routes/order.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createOrderController,getOrdersController,getOrderByIdController } from "../controllers/order.controller.js";


const router = express.Router();

router.post("/", protect, createOrderController);
router.get("/", protect, getOrdersController);
router.get("/:id", protect, getOrderByIdController);

export default router;