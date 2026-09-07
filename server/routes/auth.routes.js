import express from "express";

import {
  register,
  login,
  logout,
  me,
  updateProfile,
} from "../controllers/auth.controller.js";

import {
  protect,
} from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.post("/logout", logout);

router.get("/me", protect, me);

router.put("/profile", protect, updateProfileValidator, validate, updateProfile);

export default router;