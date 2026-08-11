const express = require("express");
const ctrl = require("../controllers/contactController");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { createContactSchema, updateContactSchema } = require("../schemas/contactSchemas");
const { fiveRequestsPerMinute } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/", fiveRequestsPerMinute, validateBody(createContactSchema), ctrl.createContactSubmission);
router.get("/", requireAuth, ctrl.getContactSubmissions);
router.put("/:id", requireAuth, validateBody(updateContactSchema), ctrl.updateContactSubmission);
router.delete("/:id", requireAuth, ctrl.archiveContactSubmission);

module.exports = router;
