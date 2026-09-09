const express = require("express");
const multer = require("multer");
const ctrl = require("../controllers/mediaController");
const { requireAuth } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

const router = express.Router();

// Change 'image' to 'file' to match frontend
router.post("/upload", requireAuth, upload.single("file"), ctrl.uploadMedia);
//                                                      ^^^^

module.exports = router;