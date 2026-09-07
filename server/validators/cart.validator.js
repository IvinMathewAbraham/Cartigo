import { body, param } from "express-validator";

export const addToCartValidator = [
  body("variantId")
    .notEmpty()
    .withMessage("variantId is required")
    .custom((value) => {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        throw new Error("variantId must be a valid positive integer");
      }
      return true;
    }),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

export const updateCartItemValidator = [
  param("itemId")
    .notEmpty()
    .withMessage("itemId is required")
    .custom((value) => {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        throw new Error("itemId must be a valid positive integer");
      }
      return true;
    }),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer (minimum 1)"),
];

export const removeCartItemValidator = [
  param("itemId")
    .notEmpty()
    .withMessage("itemId is required")
    .custom((value) => {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        throw new Error("itemId must be a valid positive integer");
      }
      return true;
    }),
];
