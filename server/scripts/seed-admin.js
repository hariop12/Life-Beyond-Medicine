// Script to create default admin user
const mongoose = require("mongoose")
const Admin = require("../models/Admin")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/life-beyond-medicine"

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("Connected to MongoDB")

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      process.exit(0)
    }

    // Create default admin
    const admin = new Admin({
      username: "admin",
      password: "admin123",
      email: "admin@lifebeyondmedicine.com",
      name: "Administrator",
    })

    await admin.save()
    console.log("Default admin created successfully")
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Please change the password after first login")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding admin:", error)
    process.exit(1)
  }
}

seedAdmin()
