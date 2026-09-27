const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getUpdates,
  getAllUpdates,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} = require("../controllers/updateController");

router.get("/", getUpdates); // Public
router.get("/all", protect, getAllUpdates); // Protected
router.post("/", protect, createUpdate);
router.put("/:id", protect, updateUpdate);
router.delete("/:id", protect, deleteUpdate);

module.exports = router;
