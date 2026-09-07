import jwt from "jsonwebtoken";
import prisma from "../config/client.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: BigInt(decoded.userId),
      },
      include: {
        user_role: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRoles = req.user.user_role.map(
      ur => ur.role.name
    );

    const allowed = roles.some(role =>
      userRoles.includes(role)
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
};