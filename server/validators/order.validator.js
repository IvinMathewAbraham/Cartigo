import { body, param } from "express-validator";

export const getOrderByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .custom((value) => {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        throw new Error("Order ID must be a valid positive integer");
      }
      return true;
    }),
];

export const checkoutValidator = [
  body("addressId")
    .notEmpty()
    .withMessage("Shipping address is required")
    .custom((value) => {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        throw new Error("Shipping address must be a valid positive integer");
      }
      return true;
    }),
  body("paymentProvider")
    .optional()
    .isIn(["MOCK"])
    .withMessage("Unsupported payment provider"),
  body("paymentDetails")
    .optional()
    .isObject()
    .withMessage("Payment details must be an object"),
];

export const updateOrderStatusValidator = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .custom((value) => {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        throw new Error("Order ID must be a valid positive integer");
      }
      return true;
    }),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"])
    .withMessage("Invalid order status"),
];
