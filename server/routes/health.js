import express from "express";

import prisma from "../config/prisma.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "reachable" });
  } catch (error) {
    console.error("Database health check failed:", error.message);
    res.status(500).json({ status: "error", database: "unreachable" });
  }
});

export default router;
