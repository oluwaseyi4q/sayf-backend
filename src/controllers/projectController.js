const Project = require("../models/Project");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { generateUniqueSlug } = require("../utils/slug");
const { requireValidId } = require("../utils/objectId");

// Mongo doc -> API shape (snake_case, matches PRD contract)
function toApi(doc) {
  if (!doc) return doc;
  const row = doc.toObject ? doc.toObject() : doc;
  return {
    id: row._id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    problem: row.problem,
    solution: row.solution,
    cover_image: row.coverImage,
    gallery: row.gallery || [],
    technologies: row.technologies || [],
    category: row.category,
    client: row.client,
    completion_date: row.completionDate,
    live_url: row.liveUrl,
    github_url: row.githubUrl,
    is_featured: row.isFeatured,
    is_published: row.isPublished,
    related_projects: row.relatedProjects || [],
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

// Request body (snake_case) -> Mongoose data (camelCase)
function toDb(body) {
  const data = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.problem !== undefined) data.problem = body.problem;
  if (body.solution !== undefined) data.solution = body.solution;
  if (body.cover_image !== undefined) data.coverImage = body.cover_image;
  if (body.gallery !== undefined) data.gallery = body.gallery;
  if (body.technologies !== undefined) data.technologies = body.technologies;
  if (body.category !== undefined) data.category = body.category;
  if (body.client !== undefined) data.client = body.client;
  if (body.completion_date !== undefined) data.completionDate = body.completion_date;
  if (body.live_url !== undefined) data.liveUrl = body.live_url || null;
  if (body.github_url !== undefined) data.githubUrl = body.github_url || null;
  if (body.is_featured !== undefined) data.isFeatured = body.is_featured;
  if (body.is_published !== undefined) data.isPublished = body.is_published;
  if (body.related_projects !== undefined) data.relatedProjects = body.related_projects;
  return data;
}

// GET /projects  (public — published only)
const getProjects = asyncHandler(async (req, res) => {
  const { category, limit, page } = req.query;
  const take = limit ? Number(limit) : 20;
  const currentPage = page ? Number(page) : 1;

  const where = { isPublished: true, ...(category ? { category } : {}) };

  const [items, total] = await Promise.all([
    Project.find(where)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * take)
      .limit(take),
    Project.countDocuments(where),
  ]);

  res.json({
    data: items.map(toApi),
    pagination: { total, page: currentPage, limit: take, pages: Math.ceil(total / take) },
  });
});

// GET /projects/featured  (public)
const getFeaturedProjects = asyncHandler(async (req, res) => {
  const items = await Project.find({ isPublished: true, isFeatured: true }).sort({ createdAt: -1 });
  res.json({ data: items.map(toApi) });
});

// GET /projects/:slug  (public)
const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project || !project.isPublished) {
    throw new ApiError(404, "NOT_FOUND", "Project not found");
  }
  res.json({ data: toApi(project) });
});

// POST /projects  (protected)
const createProject = asyncHandler(async (req, res) => {
  const slug = await generateUniqueSlug(Project, req.body.title);
  const project = await Project.create({ ...toDb(req.body), slug });
  res.status(201).json({ data: toApi(project) });
});

// PUT /projects/:id  (protected)
const updateProject = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const existing = await Project.findById(req.params.id);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "Project not found");

  const data = toDb(req.body);
  if (req.body.title && req.body.title !== existing.title) {
    data.slug = await generateUniqueSlug(Project, req.body.title, req.params.id);
  }

  const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  res.json({ data: toApi(project) });
});

// DELETE /projects/:id  (protected)
const deleteProject = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const existing = await Project.findByIdAndDelete(req.params.id);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "Project not found");
  res.status(204).send();
});

module.exports = {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
