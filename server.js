// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("✅ Server is running successfully!");
});

// Define port from .env or default
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});