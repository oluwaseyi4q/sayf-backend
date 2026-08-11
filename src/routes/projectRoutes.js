const express = require("express");
const ctrl = require("../controllers/projectController");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { createProjectSchema, updateProjectSchema } = require("../schemas/projectSchemas");

const router = express.Router();

router.get("/featured", ctrl.getFeaturedProjects);
router.get("/", ctrl.getProjects);
router.get("/:slug", ctrl.getProjectBySlug);

router.post("/", requireAuth, validateBody(createProjectSchema), ctrl.createProject);
router.put("/:id", requireAuth, validateBody(updateProjectSchema), ctrl.updateProject);
router.delete("/:id", requireAuth, ctrl.deleteProject);

module.exports = router;
