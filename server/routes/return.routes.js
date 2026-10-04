import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createReturnController, getReturnsController } from "../controllers/return.controller.js";

const router = express.Router();
router.get("/", protect, getReturnsController);
router.post("/:orderId", protect, createReturnController);
export default router;
