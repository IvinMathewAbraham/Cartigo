// routes/order.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
} from "../controllers/order.controller.js";
import { getOrderByIdValidator } from "../validators/order.validator.js";

const router = express.Router();

router.post("/", protect, createOrderController);
router.get("/", protect, getOrdersController);
router.get("/:id", protect, getOrderByIdValidator, validate, getOrderByIdController);

export default router;