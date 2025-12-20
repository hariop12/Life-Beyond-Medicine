const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("."));

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/life-beyond-medicine";

let isConnected = false;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
    console.log("📍 Database:", mongoose.connection.name);
  })
  .catch((err) => {
    isConnected = false;
    console.error("❌ MongoDB connection error:", err.message);
    console.error("Make sure MongoDB is running on:", MONGODB_URI);
  });

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  isConnected = true;
  console.log("✅ MongoDB reconnected");
});

app.use((req, res, next) => {
  if (!isConnected && mongoose.connection.readyState !== 1) {
    console.error(
      "[Backend] Database not connected. State:",
      mongoose.connection.readyState
    );
    return res.status(503).json({
      error: "Database connection unavailable",
      message: "Please make sure MongoDB is running",
      hint: "Run 'mongod' in a terminal or install MongoDB from https://www.mongodb.com/try/download/community",
    });
  }
  next();
});

// Import routes
const bookingRoutes = require("./server/routes/bookings");
const authRoutes = require("./server/routes/auth");
const contentRoutes = require("./server/routes/content");

// Use routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);

// Health check endpoint for database connection
app.get("/api/health/db", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  if (dbState === 1) {
    res.json({
      connected: true,
      state: states[dbState],
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } else {
    res.status(503).json({
      connected: false,
      state: states[dbState],
      error: "MongoDB is not connected",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at: http://localhost:${PORT}`);
});
