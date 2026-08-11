const express = require("express");
const ctrl = require("../controllers/articleController");
const { requireAuth } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { createArticleSchema, updateArticleSchema } = require("../schemas/articleSchemas");

const router = express.Router();

router.get("/", ctrl.getArticles);
router.get("/:slug", ctrl.getArticleBySlug);

router.post("/", requireAuth, validateBody(createArticleSchema), ctrl.createArticle);
router.put("/:id", requireAuth, validateBody(updateArticleSchema), ctrl.updateArticle);
router.delete("/:id", requireAuth, ctrl.deleteArticle);

module.exports = router;
