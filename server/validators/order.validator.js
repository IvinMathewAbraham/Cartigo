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
