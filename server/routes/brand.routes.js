// routes/brand.routes.js

import express from "express";
import { getAllBrands } from "../controllers/brand.controller.js";

const router = express.Router();

router.get("/", getAllBrands);

export default router;