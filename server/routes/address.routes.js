// routes/address.routes.js

import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {createAddressController,getAddressesController,updateAddressController,deleteAddressController} from "../controllers/address.controller.js";


const router = express.Router();

router.post("/",protect,createAddressController);
router.get(
  "/",
  protect,
  getAddressesController
);

router.put(
  "/:id",
  protect,
  updateAddressController
);
router.delete(
  "/:id",
  protect,
  deleteAddressController
);

export default router;