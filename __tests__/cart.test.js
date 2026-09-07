// Ensure BigInt values can be serialized to JSON (mirrors server/config/client.js behavior)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import cartRoutes from "../server/routes/cart.routes.js";
import prisma from "../server/config/client.js";
import { generateToken } from "../server/utils/jwt.js";

jest.mock("../server/config/client.js", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    inventory: {
      findUnique: jest.fn(),
    },
    cart: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    cartItem: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/cart", cartRoutes);

describe("Cart Routes & Service Integration", () => {
  let userToken;
  const mockUser = {
    id: BigInt(1),
    email: "test@example.com",
    user_role: [{ role: { name: "CUSTOMER" } }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    userToken = generateToken(1);
    prisma.user.findUnique.mockResolvedValue(mockUser);
  });

  describe("POST /api/cart", () => {
    test("should add variant to cart successfully", async () => {
      prisma.inventory.findUnique.mockResolvedValue({
        id: BigInt(1),
        variant_id: BigInt(10),
        quantity: 20,
      });

      prisma.cart.findFirst.mockResolvedValue({
        id: BigInt(5),
        userId: BigInt(1),
      });

      prisma.cartItem.findFirst.mockResolvedValue(null);
      prisma.cartItem.create.mockResolvedValue({
        id: BigInt(100),
        cartId: BigInt(5),
        variantId: BigInt(10),
        quantity: 2,
      });

      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          variantId: 10,
          quantity: 2,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test("should reject adding item if stock is insufficient", async () => {
      prisma.inventory.findUnique.mockResolvedValue({
        id: BigInt(1),
        variant_id: BigInt(10),
        quantity: 1,
      });

      const res = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          variantId: 10,
          quantity: 5,
        });

      expect(res.status).toBe(500);
      expect(res.body.message).toContain("Insufficient stock");
    });
  });

  describe("PATCH /api/cart/items/:itemId", () => {
    test("should update quantity for user-owned cart item", async () => {
      prisma.cartItem.findFirst.mockResolvedValue({
        id: BigInt(100),
        variant: {
          inventory: { quantity: 15 },
        },
      });

      prisma.cartItem.update.mockResolvedValue({
        id: BigInt(100),
        quantity: 3,
      });

      const res = await request(app)
        .patch("/api/cart/items/100")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 3 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should reject update with 403 if item belongs to another user (IDOR prevention)", async () => {
      prisma.cartItem.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .patch("/api/cart/items/999")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 3 });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("unauthorized");
    });
  });

  describe("DELETE /api/cart/items/:itemId", () => {
    test("should remove cart item when authorized", async () => {
      prisma.cartItem.findFirst.mockResolvedValue({
        id: BigInt(100),
      });
      prisma.cartItem.delete.mockResolvedValue({
        id: BigInt(100),
      });

      const res = await request(app)
        .delete("/api/cart/items/100")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("Item removed");
    });

    test("should reject deletion if item does not belong to user", async () => {
      prisma.cartItem.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .delete("/api/cart/items/999")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("unauthorized");
    });
  });
});
