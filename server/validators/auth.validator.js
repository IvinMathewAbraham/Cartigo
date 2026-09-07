import { body } from "express-validator";

export const registerValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const updateProfileValidator = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),
  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty"),
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
];
