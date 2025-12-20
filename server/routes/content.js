const express = require("express")
const router = express.Router()
const Content = require("../models/Content")
const { verifyToken } = require("../middleware/auth")

// Get content by page
router.get("/:page", async (req, res) => {
  try {
    const content = await Content.findOne({ page: req.params.page })
    if (!content) {
      return res.status(404).json({ error: "Content not found" })
    }
    res.json(content)
  } catch (error) {
    console.error("Error fetching content:", error)
    res.status(500).json({ error: "Failed to fetch content" })
  }
})

// Update content (admin only)
router.put("/:page", verifyToken, async (req, res) => {
  try {
    const { data } = req.body
    const content = await Content.findOneAndUpdate(
      { page: req.params.page },
      { data },
      { new: true, upsert: true, runValidators: true },
    )

    res.json({ message: "Content updated successfully", content })
  } catch (error) {
    console.error("Error updating content:", error)
    res.status(500).json({ error: "Failed to update content" })
  }
})

module.exports = router
