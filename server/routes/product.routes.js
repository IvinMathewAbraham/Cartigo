// routes/product.routes.js

import express from "express";
import { getProductDetails,getAllProducts,createProductController } from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductDetails);



export default router;