const express = require("express");
const ctrl = require("../controllers/newsletterController");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { subscribeSchema } = require("../schemas/newsletterSchemas");
const { fiveRequestsPerMinute } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/subscribe", fiveRequestsPerMinute, validateBody(subscribeSchema), ctrl.subscribe);
// Token may come via body (API clients) or query string (links clicked from email)
router.post("/unsubscribe", ctrl.unsubscribe);

router.get("/subscribers", requireAuth, ctrl.getSubscribers);
router.get("/subscribers/export", requireAuth, ctrl.exportSubscribers);

module.exports = router;
