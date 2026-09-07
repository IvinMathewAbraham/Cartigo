import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import authRoutes from "../server/routes/auth.routes.js";
import prisma from "../server/config/client.js";
import * as hashUtils from "../server/utils/hash.js";

jest.mock("../server/config/client.js", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    role: {
      findFirst: jest.fn(),
    },
    user_role: {
      create: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

describe("Auth Routes & Endpoints Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("POST /api/auth/register", () => {
    test("should register a new customer successfully", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findFirst.mockResolvedValue({ id: BigInt(2), name: "CUSTOMER" });
      prisma.user.create.mockResolvedValue({
        id: BigInt(1),
        email: "newuser@example.com",
        firstName: "Jane",
        lastName: "Doe",
        phone: "1234567890",
      });
      prisma.user_role.create.mockResolvedValue({});

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "newuser@example.com",
          password: "Password123",
          firstName: "Jane",
          lastName: "Doe",
          phone: "1234567890",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("newuser@example.com");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("should reject registration if email already exists", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: BigInt(1), email: "exists@example.com" });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "exists@example.com",
          password: "Password123",
          firstName: "Jane",
          lastName: "Doe",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Email already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    test("should login valid user and return cookie", async () => {
      const hashedPassword = await hashUtils.hashPassword("Password123");
      prisma.user.findUnique.mockResolvedValue({
        id: BigInt(1),
        email: "user@example.com",
        passwordHash: hashedPassword,
        is_active: true,
        user_role: [{ role: { name: "CUSTOMER" } }],
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "user@example.com",
          password: "Password123",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("should reject login with wrong password", async () => {
      const hashedPassword = await hashUtils.hashPassword("CorrectPassword");
      prisma.user.findUnique.mockResolvedValue({
        id: BigInt(1),
        email: "user@example.com",
        passwordHash: hashedPassword,
        is_active: true,
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "user@example.com",
          password: "WrongPassword",
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain("Invalid credentials");
    });
  });

  describe("POST /api/auth/logout", () => {
    test("should clear the cookie on logout", async () => {
      const res = await request(app).post("/api/auth/logout");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
