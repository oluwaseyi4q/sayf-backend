const express = require("express");
const ctrl = require("../controllers/teamController");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { createTeamMemberSchema, updateTeamMemberSchema } = require("../schemas/teamSchemas");

const router = express.Router();

router.get("/", ctrl.getTeam);
router.post("/", requireAuth, validateBody(createTeamMemberSchema), ctrl.createTeamMember);
router.put("/:id", requireAuth, validateBody(updateTeamMemberSchema), ctrl.updateTeamMember);
router.delete("/:id", requireAuth, ctrl.deleteTeamMember);

module.exports = router;
