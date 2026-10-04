import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import axios from "axios";
import path from "path";

import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import adminProductRouter from "./routes/admin.product.routes.js";
import adminInventoryRouter from "./routes/admin.inventory.routes.js";
import cartRouter from "./routes/cart.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import addressRouter from "./routes/address.routes.js";
import orderRouter from "./routes/order.routes.js";
import adminOrderRouter  from "./routes/admin.order.routes.js"
import categoryRouter from "./routes/category.routes.js"; 
import brandRouter from "./routes/brand.routes.js"; 
import returnRouter from "./routes/return.routes.js";
import shippingRouter from "./routes/shipping.routes.js";

// Load environment variables from .env file
dotenv.config();

if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes("change_in_production"))) {
  throw new Error("JWT_SECRET must be configured with a production-only value");
}


BigInt.prototype.toJSON =
function () {
	return this.toString();
};

// Create Express app
const app = express();
// Set the port from environment variable or default to 3000
const port = Number(process.env.PORT || 3000);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
// Parse JSON and URL-encoded data
app.use(express.json());
// Parse cookies
app.use(cookieParser());
// Parse URL-encoded data with querystring library (extended: false)
app.use(express.urlencoded({ extended: false }));

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);


// Routes
app.get("/", (req, res) => {
	res.json({ status: "ok", message: "Shopping Cart API" });
});

// Health check route
app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/inventory", adminInventoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin/orders",adminOrderRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/brands", brandRouter);
app.use("/api/returns", returnRouter);
app.use("/api/shipping", shippingRouter);

// 404 Not Found handler
app.use((req, res) => {
	res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

export default app;
