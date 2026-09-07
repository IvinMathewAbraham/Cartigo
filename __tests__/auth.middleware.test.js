import jwt from "jsonwebtoken";
import { protect, authorize } from "../server/middleware/auth.middleware.js";
import prisma from "../server/config/client.js";

jest.mock("../server/config/client.js", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    req = {
      cookies: {},
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("protect middleware", () => {
    test("should reject request when neither cookie nor Bearer header is present", async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Authentication required",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should accept token from cookie and attach user", async () => {
      req.cookies.token = "valid-cookie-token";
      jwt.verify.mockReturnValue({ userId: "1" });
      const mockUser = {
        id: BigInt(1),
        email: "test@example.com",
        user_role: [{ role: { name: "CUSTOMER" } }],
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("valid-cookie-token", "test-secret");
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    test("should accept token from Authorization Bearer header and attach user", async () => {
      req.headers.authorization = "Bearer valid-bearer-token";
      jwt.verify.mockReturnValue({ userId: "2" });
      const mockUser = {
        id: BigInt(2),
        email: "bearer@example.com",
        user_role: [{ role: { name: "ADMIN" } }],
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("valid-bearer-token", "test-secret");
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    test("should reject request with 401 when user is not found in database", async () => {
      req.headers.authorization = "Bearer valid-token";
      jwt.verify.mockReturnValue({ userId: "999" });
      prisma.user.findUnique.mockResolvedValue(null);

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should reject request with 401 on invalid/expired token", async () => {
      req.cookies.token = "expired-token";
      jwt.verify.mockImplementation(() => {
        throw new Error("jwt expired");
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid or expired token",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("authorize middleware", () => {
    test("should allow user with matching role", () => {
      req.user = {
        user_role: [{ role: { name: "ADMIN" } }],
      };

      const middleware = authorize("ADMIN", "MANAGER");
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test("should deny user without matching role", () => {
      req.user = {
        user_role: [{ role: { name: "CUSTOMER" } }],
      };

      const middleware = authorize("ADMIN");
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Access denied",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
