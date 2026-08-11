const express = require("express");
const ctrl = require("../controllers/settingsController");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { updateSettingsSchema } = require("../schemas/settingsSchemas");

const router = express.Router();

router.get("/", ctrl.getSettings);
router.put("/", requireAuth, validateBody(updateSettingsSchema), ctrl.updateSettings);

module.exports = router;
