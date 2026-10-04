import express from "express";
import { getShippingMethodsController } from "../controllers/shipping.controller.js";

const router = express.Router();
router.get("/", getShippingMethodsController);
export default router;
