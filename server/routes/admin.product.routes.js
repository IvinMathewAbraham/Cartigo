import express from "express";
import { createProductController,updateProductController,deactivateProductController,uploadProductImage,createAttributeController,createAttributeValueController,createVariantController,setPrimaryProductImage } from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

import { authorize } from "../middleware/auth.middleware.js";
// import { GetAllProductsController } from  "../controllers/product.controller.js";

const router = express.Router();

router.post("/",protect,authorize("ADMIN"), createProductController);
router.put("/:id",protect,authorize("ADMIN"), updateProductController);
router.patch("/:id/deactivate",protect,authorize("ADMIN"),deactivateProductController);
router.post("/:id/images", protect, authorize("ADMIN"), upload.single("image"), uploadProductImage);
router.patch("/images/:imageId/primary",protect,authorize("ADMIN"),setPrimaryProductImage);
router.post("/attributes",protect,authorize("ADMIN"),createAttributeController);
router.post("/attribute-values",protect,authorize("ADMIN"),createAttributeValueController);
router.post("/:id/variants",protect,authorize("ADMIN"),createVariantController);


// router.get(
//   "/admin/products",
//   protect,
//   authorize("ADMIN"),
//   GetAllProductsController
// );
export default router;