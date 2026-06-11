import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import healthRouter from "./routes/health.js";

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
// Set the port from environment variable or default to 3000
const port = Number(process.env.PORT || 3000);

// Middleware
app.use(cors());
// Parse JSON and URL-encoded data
app.use(express.json());
// Parse URL-encoded data with querystring library (extended: false)
app.use(express.urlencoded({ extended: false }));


// Routes
app.get("/", (req, res) => {
	res.json({ status: "ok", message: "Shopping Cart API" });
});

// Health check route
app.use("/health", healthRouter);

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
