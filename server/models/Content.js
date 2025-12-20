const mongoose = require("mongoose")

const contentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ["home", "about", "contact"],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Content", contentSchema)
