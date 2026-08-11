const Article = require("../models/Article");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { generateUniqueSlug } = require("../utils/slug");
const { requireValidId } = require("../utils/objectId");

function toApi(doc) {
  if (!doc) return doc;
  const row = doc.toObject ? doc.toObject() : doc;
  return {
    id: row._id,
    title: row.title,
    slug: row.slug,
    author: row.author,
    featured_image: row.featuredImage,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    read_time: row.readTime,
    is_published: row.isPublished,
    published_at: row.publishedAt,
    seo_title: row.seoTitle,
    seo_description: row.seoDescription,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

function toDb(body) {
  const data = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.author !== undefined) data.author = body.author;
  if (body.featured_image !== undefined) data.featuredImage = body.featured_image;
  if (body.excerpt !== undefined) data.excerpt = body.excerpt;
  if (body.content !== undefined) data.content = body.content;
  if (body.category !== undefined) data.category = body.category;
  if (body.tags !== undefined) data.tags = body.tags;
  if (body.read_time !== undefined) data.readTime = body.read_time;
  if (body.seo_title !== undefined) data.seoTitle = body.seo_title;
  if (body.seo_description !== undefined) data.seoDescription = body.seo_description;
  if (body.is_published !== undefined) {
    data.isPublished = body.is_published;
    if (body.is_published) data.publishedAt = new Date();
  }
  return data;
}

// GET /articles  (public — published only)
const getArticles = asyncHandler(async (req, res) => {
  const { category, tag, limit, page } = req.query;
  const take = limit ? Number(limit) : 20;
  const currentPage = page ? Number(page) : 1;

  const where = { isPublished: true, ...(category ? { category } : {}), ...(tag ? { tags: tag } : {}) };

  const [items, total] = await Promise.all([
    Article.find(where)
      .sort({ publishedAt: -1 })
      .skip((currentPage - 1) * take)
      .limit(take),
    Article.countDocuments(where),
  ]);

  res.json({
    data: items.map(toApi),
    pagination: { total, page: currentPage, limit: take, pages: Math.ceil(total / take) },
  });
});

// GET /articles/:slug  (public)
const getArticleBySlug = asyncHandler(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article || !article.isPublished) {
    throw new ApiError(404, "NOT_FOUND", "Article not found");
  }
  res.json({ data: toApi(article) });
});

// POST /articles  (protected)
const createArticle = asyncHandler(async (req, res) => {
  const slug = await generateUniqueSlug(Article, req.body.title);
  const article = await Article.create({ ...toDb(req.body), slug });
  res.status(201).json({ data: toApi(article) });
});

// PUT /articles/:id  (protected)
const updateArticle = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const existing = await Article.findById(req.params.id);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "Article not found");

  const data = toDb(req.body);
  if (req.body.title && req.body.title !== existing.title) {
    data.slug = await generateUniqueSlug(Article, req.body.title, req.params.id);
  }

  const article = await Article.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  res.json({ data: toApi(article) });
});

// DELETE /articles/:id  (protected)
const deleteArticle = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const existing = await Article.findByIdAndDelete(req.params.id);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "Article not found");
  res.status(204).send();
});

module.exports = {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
};
