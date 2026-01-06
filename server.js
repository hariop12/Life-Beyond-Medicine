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
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/life-beyond-medicine";

// Set up connection event handlers BEFORE connecting
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

// Connect to MongoDB with proper options
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    console.error("Make sure MongoDB is running on:", MONGODB_URI);
  });

// Middleware to check database connection for API routes only
app.use("/api", (req, res, next) => {
  const dbState = mongoose.connection.readyState;
  
  if (dbState !== 1) {
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    
    console.error(
      "[Backend] Database not connected. State:",
      dbState,
      `(${states[dbState]})`
    );
    
    return res.status(503).json({
      error: "Database connection unavailable",
      message: "Please make sure MongoDB is running",
      state: states[dbState],
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
