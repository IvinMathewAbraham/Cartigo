// routes/order.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createOrderController,
  checkoutController,
  getOrdersController,
  getOrderByIdController,
  getOrderReceiptController,
} from "../controllers/order.controller.js";
import { checkoutValidator, getOrderByIdValidator } from "../validators/order.validator.js";

const router = express.Router();

router.post("/", protect, createOrderController);
router.post("/checkout", protect, checkoutValidator, validate, checkoutController);
router.get("/", protect, getOrdersController);
router.get("/:id", protect, getOrderByIdValidator, validate, getOrderByIdController);
router.get("/:id/receipt", protect, getOrderByIdValidator, validate, getOrderReceiptController);

export default router;