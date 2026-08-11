const express = require("express");
const ctrl = require("../controllers/testimonialController");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { createTestimonialSchema, updateTestimonialSchema } = require("../schemas/testimonialSchemas");

const router = express.Router();

router.get("/", ctrl.getTestimonials);
router.post("/", requireAuth, validateBody(createTestimonialSchema), ctrl.createTestimonial);
router.put("/:id", requireAuth, validateBody(updateTestimonialSchema), ctrl.updateTestimonial);
router.delete("/:id", requireAuth, ctrl.deleteTestimonial);

module.exports = router;
