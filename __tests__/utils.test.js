import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { comparePassword, hashPassword } from "../server/utils/hash.js";
import { generateToken, verifyToken } from "../server/utils/jwt.js";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("server utility helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  test("hashPassword hashes with the expected salt rounds", async () => {
    bcrypt.hash.mockResolvedValue("hashed-password");

    await expect(hashPassword("plain-password")).resolves.toBe("hashed-password");
    expect(bcrypt.hash).toHaveBeenCalledWith("plain-password", 10);
  });

  test("comparePassword delegates to bcrypt compare", async () => {
    bcrypt.compare.mockResolvedValue(true);

    await expect(comparePassword("plain-password", "hashed-password")).resolves.toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith("plain-password", "hashed-password");
  });

  test("generateToken signs the user id with the configured secret", () => {
    jwt.sign.mockReturnValue("signed-token");

    expect(generateToken(42)).toBe("signed-token");
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 42 },
      "test-secret",
      { expiresIn: "7d" }
    );
  });

  test("verifyToken verifies with the configured secret", () => {
    jwt.verify.mockReturnValue({ userId: 42 });

    expect(verifyToken("signed-token")).toEqual({ userId: 42 });
    expect(jwt.verify).toHaveBeenCalledWith("signed-token", "test-secret");
  });
});