import prisma from "../config/client.js";
import { hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/hash.js";

export const register = async (req, res) => {
    try {


        const {
            email,
            password,
            firstName,
            lastName,
            phone,
        } = req.body;

        if (
            !email ||
            !password ||
            !firstName ||
            !lastName
        ) {
            return res.status(400).json({
                message: "All required fields must be provided",
            });
        }


        const existingUser =
            await prisma.user.findUnique({
                where: { email },
            });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const customerRole =
            await prisma.role.findUnique({
                where: {
                    name: "customer",
                },
            });

        if (!customerRole) {
            return res.status(500).json({
                message:
                    "Customer role not found",
            });
        }

        const passwordHash =
            await hashPassword(password);

        const user =
            await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    firstName,
                    lastName,
                    phone,
                },
            });

        await prisma.user_role.create({
            data: {
                user_id: user.id,
                role_id: customerRole.id,
            },
        });

        const token =
            generateToken(user.id.toString());

        res.cookie("token", token, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV ===
                "production",
            sameSite: "strict",
            maxAge:
                7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message:
                "User registered successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};



export const login = async (
    req,
    res
) => {
    try {
        const { email, password } =
            req.body;

        const user =
            await prisma.user.findUnique({
                where: { email },
            });

        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid credentials",
            });
        }
        if (!user.is_active) {
            return res.status(403).json({
                message: "Account disabled",
            });
        }

        const isMatch =
            await comparePassword(
                password,
                user.passwordHash
            );

        if (!isMatch) {
            return res.status(401).json({
                message:
                    "Invalid credentials",
            });
        }

        const token =
            generateToken(
                user.id.toString()
            );

        res.cookie("token", token, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV ===
                "production",
            sameSite: "strict",
            maxAge:
                7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            message: "Login successful",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


export const logout = (
    req,
    res
) => {
    res.clearCookie("token");

    res.json({
        message: "Logged out",
    });
};

export const me = async (
    req,
    res
) => {
    try {
        return res.status(200).json({
            user: {
                id: req.user.id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                phone: req.user.phone,
                isVerified: req.user.is_verified,
                isActive: req.user.is_active,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phone,
      } = req.body;

      const updatedUser =
        await prisma.user.update({
          where: {
            id: req.user.id,
          },

          data: {
            firstName,
            lastName,
            phone,
          },
        });

      return res.status(200).json({
        success: true,

        data: {
          id: updatedUser.id,
          email:
            updatedUser.email,

          firstName:
            updatedUser.firstName,

          lastName:
            updatedUser.lastName,

          phone:
            updatedUser.phone,

          isVerified:
            updatedUser.is_verified,

          isActive:
            updatedUser.is_active,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to update profile",
      });
    }
  };