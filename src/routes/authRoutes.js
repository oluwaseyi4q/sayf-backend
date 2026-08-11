const express = require("express");
const { login, refresh, logout } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { loginSchema, refreshSchema } = require("../schemas/authSchemas");
const { authLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/login", authLimiter, validateBody(loginSchema), login);
router.post("/refresh", validateBody(refreshSchema), refresh);
router.post("/logout", requireAuth, logout);

module.exports = router;
