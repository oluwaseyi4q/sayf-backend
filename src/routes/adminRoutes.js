const express = require("express");
const ctrl = require("../controllers/adminController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", requireAuth, ctrl.getStats);

module.exports = router;
