import { body } from "express-validator";

export const createAddressValidator = [
  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 is required"),
  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),
  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal Code is required"),
  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
  body("label")
    .optional()
    .trim(),
  body("addressLine2")
    .optional()
    .trim(),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
];

export const updateAddressValidator = [
  body("addressLine1")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 cannot be empty"),
  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),
  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty"),
  body("postalCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Postal Code cannot be empty"),
  body("country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country cannot be empty"),
  body("label")
    .optional()
    .trim(),
  body("addressLine2")
    .optional()
    .trim(),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
];
