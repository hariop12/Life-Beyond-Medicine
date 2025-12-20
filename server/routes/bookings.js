const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { verifyToken } = require("../middleware/auth");

// Create new booking
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      preferredDate,
      preferredTime,
      message,
    } = req.body;

    console.log("[Backend] Received booking request:", {
      name,
      email,
      phone,
      service,
      preferredDate,
      preferredTime,
    });

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !service ||
      !preferredDate ||
      !preferredTime
    ) {
      console.error("[Backend] Missing required fields:", {
        name,
        email,
        phone,
        service,
        preferredDate,
        preferredTime,
      });
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    let dateObj;
    try {
      dateObj = new Date(preferredDate);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (dateError) {
      console.error("[Backend] Invalid date format:", preferredDate);
      return res.status(400).json({
        error: "Invalid date format",
        details: "Please provide a valid date",
      });
    }

    const booking = new Booking({
      name,
      email,
      phone,
      service,
      preferredDate: dateObj,
      preferredTime,
      message,
    });

    const validationError = booking.validateSync();
    if (validationError) {
      console.error("[Backend] Validation error:", validationError);
      return res.status(400).json({
        error: "Validation failed",
        details: Object.values(validationError.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    await booking.save();
    console.log("[Backend] ✅ Booking created successfully:", booking._id);
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("[Backend] ❌ Error creating booking:", error.message);
    console.error("[Backend] Full error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    res.status(500).json({
      error: "Failed to create booking",
      details: error.message,
      hint: "Check if MongoDB is running",
    });
  }
});

// Get all bookings (admin only)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { status, service, search } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (service && service !== "all") {
      query.service = service;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Get booking by ID (admin only)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

// Update booking status (admin only)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// Delete booking (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

// Get booking statistics (admin only)
router.get("/stats/summary", verifyToken, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: "pending" });
    const confirmed = await Booking.countDocuments({ status: "confirmed" });
    const completed = await Booking.countDocuments({ status: "completed" });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });

    // Get recent bookings (last 5)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      recentBookings,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Delete old bookings (admin only)
router.delete("/cleanup/old", verifyToken, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await Booking.deleteMany({
      createdAt: { $lt: sixMonthsAgo },
      status: { $in: ["completed", "cancelled"] },
    });

    res.json({ message: `Deleted ${result.deletedCount} old bookings` });
  } catch (error) {
    console.error("Error cleaning up bookings:", error);
    res.status(500).json({ error: "Failed to cleanup bookings" });
  }
});

module.exports = router;
