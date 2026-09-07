// routes/address.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createAddressController,
  getAddressesController,
  updateAddressController,
  deleteAddressController,
} from "../controllers/address.controller.js";
import {
  createAddressValidator,
  updateAddressValidator,
} from "../validators/address.validator.js";

const router = express.Router();

router.post("/", protect, createAddressValidator, validate, createAddressController);
router.get("/", protect, getAddressesController);
router.put("/:id", protect, updateAddressValidator, validate, updateAddressController);
router.delete("/:id", protect, deleteAddressController);

export default router;