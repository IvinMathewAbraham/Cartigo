import express from "express";
import request from "supertest";
import { validate } from "../server/middleware/validate.middleware.js";
import { registerValidator, loginValidator } from "../server/validators/auth.validator.js";
import { createAddressValidator } from "../server/validators/address.validator.js";
import { addToCartValidator } from "../server/validators/cart.validator.js";

const app = express();
app.use(express.json());

app.post("/test/register", registerValidator, validate, (req, res) => {
  res.status(200).json({ success: true, body: req.body });
});

app.post("/test/login", loginValidator, validate, (req, res) => {
  res.status(200).json({ success: true, body: req.body });
});

app.post("/test/address", createAddressValidator, validate, (req, res) => {
  res.status(201).json({ success: true, body: req.body });
});

app.post("/test/cart", addToCartValidator, validate, (req, res) => {
  res.status(201).json({ success: true, body: req.body });
});

describe("Express-Validator Request Validation", () => {
  describe("Register Validator", () => {
    test("rejects invalid email and short password", async () => {
      const res = await request(app)
        .post("/test/register")
        .send({
          email: "not-an-email",
          password: "123",
          firstName: "John",
          lastName: "Doe",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === "email")).toBe(true);
      expect(res.body.errors.some((e) => e.field === "password")).toBe(true);
    });

    test("accepts valid registration data", async () => {
      const res = await request(app)
        .post("/test/register")
        .send({
          email: "user@example.com",
          password: "securePassword123",
          firstName: "John",
          lastName: "Doe",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("Address Validator", () => {
    test("rejects when required address fields are missing", async () => {
      const res = await request(app)
        .post("/test/address")
        .send({
          label: "Home",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e) => e.field === "addressLine1")).toBe(true);
      expect(res.body.errors.some((e) => e.field === "city")).toBe(true);
      expect(res.body.errors.some((e) => e.field === "state")).toBe(true);
      expect(res.body.errors.some((e) => e.field === "postalCode")).toBe(true);
    });

    test("accepts complete address data", async () => {
      const res = await request(app)
        .post("/test/address")
        .send({
          addressLine1: "123 Main St",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA",
          isDefault: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("Cart Validator", () => {
    test("rejects invalid variantId or negative quantity", async () => {
      const res = await request(app)
        .post("/test/cart")
        .send({
          variantId: "invalid",
          quantity: -5,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test("accepts valid variantId and quantity", async () => {
      const res = await request(app)
        .post("/test/cart")
        .send({
          variantId: 10,
          quantity: 2,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });
});
