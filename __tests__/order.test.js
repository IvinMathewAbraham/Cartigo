// Ensure BigInt values can be serialized to JSON (mirrors server/config/client.js behavior)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import orderRoutes from "../server/routes/order.routes.js";
import prisma from "../server/config/client.js";
import { generateToken } from "../server/utils/jwt.js";

jest.mock("../server/config/client.js", () => {
  const mockTx = {
    cart: { findFirst: jest.fn() },
    order: { create: jest.fn() },
    orderItem: { create: jest.fn() },
    cartItem: { deleteMany: jest.fn() },
    $executeRaw: jest.fn(),
  };

  return {
    __esModule: true,
    default: {
      user: {
        findUnique: jest.fn(),
      },
      order: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(mockTx)),
      _mockTx: mockTx,
    },
  };
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/orders", orderRoutes);

describe("Order Routes & Concurrency Service", () => {
  let userToken;
  const mockUser = {
    id: BigInt(1),
    email: "buyer@example.com",
    user_role: [{ role: { name: "CUSTOMER" } }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    userToken = generateToken(1);
    prisma.user.findUnique.mockResolvedValue(mockUser);
  });

  describe("POST /api/orders", () => {
    test("should successfully create order and atomically decrement stock", async () => {
      prisma._mockTx.cart.findFirst.mockResolvedValue({
        id: BigInt(10),
        items: [
          {
            id: BigInt(101),
            quantity: 2,
            variant: {
              id: BigInt(50),
              sku: "PROD-50",
              price: 50.0,
              product: { name: "Test Product" },
            },
          },
        ],
      });

      prisma._mockTx.order.create.mockResolvedValue({
        id: BigInt(1),
        userId: BigInt(1),
        totalAmount: 100.0,
        status: "PENDING",
      });

      // Mock successful atomic SQL update (1 row affected)
      prisma._mockTx.$executeRaw.mockResolvedValue(1);
      prisma._mockTx.orderItem.create.mockResolvedValue({});
      prisma._mockTx.cartItem.deleteMany.mockResolvedValue({});

      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ addressId: 1 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(prisma._mockTx.$executeRaw).toHaveBeenCalled();
    });

    test("should reject checkout with 400 when cart is empty", async () => {
      prisma._mockTx.cart.findFirst.mockResolvedValue({
        id: BigInt(10),
        items: [],
      });

      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Cart is empty");
    });

    test("should return 409 Conflict when atomic inventory update detects insufficient stock", async () => {
      prisma._mockTx.cart.findFirst.mockResolvedValue({
        id: BigInt(10),
        items: [
          {
            id: BigInt(101),
            quantity: 5,
            variant: {
              id: BigInt(50),
              sku: "PROD-50",
              price: 50.0,
              product: { name: "Test Product" },
            },
          },
        ],
      });

      prisma._mockTx.order.create.mockResolvedValue({
        id: BigInt(2),
      });

      // Atomic update affected 0 rows (stock < requested quantity)
      prisma._mockTx.$executeRaw.mockResolvedValue(0);

      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(409);
      expect(res.body.message).toContain("Insufficient stock");
    });
  });

  describe("GET /api/orders/:id", () => {
    test("should return order details for authorized owner", async () => {
      prisma.order.findFirst.mockResolvedValue({
        id: BigInt(1),
        userId: BigInt(1),
        totalAmount: 100.0,
        items: [],
      });

      const res = await request(app)
        .get("/api/orders/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should return 404 if order not found", async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/orders/999")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toContain("Order not found");
    });
  });
});
