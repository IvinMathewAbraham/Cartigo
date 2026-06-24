import express from "express";
import { createProductController,updateProductController,deactivateProductController,uploadProductImage,createAttributeController,createAttributeValueController,createVariantController,setPrimaryProductImage } from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

import { authorize } from "../middleware/auth.middleware.js";
import { GetAllProductsController } from  "../controllers/product.controller.js";

const router = express.Router();

router.post("/",protect, createProductController);
router.put("/:id",protect, updateProductController);
router.patch("/:id/deactivate",protect,deactivateProductController);
router.post("/:id/images", protect,  upload.single("image"),  uploadProductImage);
router.patch("/images/:imageId/primary",protect,setPrimaryProductImage);
router.post("/attributes",protect,createAttributeController);
router.post("/attribute-values",protect,createAttributeValueController);
router.post("/:id/variants",protect,createVariantController);


// router.get(
//   "/admin/products",
//   authorize("ADMIN"),
//   GetAllProductsController
// );

export default router;