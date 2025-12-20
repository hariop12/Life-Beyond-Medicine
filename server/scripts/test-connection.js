// Test MongoDB connection
const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/life-beyond-medicine";

console.log("Testing MongoDB connection...");
console.log("Connection string:", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ SUCCESS! MongoDB is connected and working!");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    console.log("Port:", mongoose.connection.port);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ FAILED! Could not connect to MongoDB");
    console.error("Error:", error.message);
    console.error("\nTroubleshooting:");
    console.error(
      "1. Is MongoDB installed? Download from: https://www.mongodb.com/try/download/community"
    );
    console.error("2. Is MongoDB running? Check with: mongosh");
    console.error("3. Is the connection string correct in .env file?");
    console.error("4. Is port 27017 open and not blocked by firewall?");
    process.exit(1);
  });
