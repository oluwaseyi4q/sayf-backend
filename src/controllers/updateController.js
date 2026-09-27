const Update = require("../models/Update");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { requireValidId } = require("../utils/objectId");

function toApi(doc) {
  if (!doc) return doc;
  const row = doc.toObject ? doc.toObject() : doc;
  return {
    id: row._id,
    title: row.title,
    body: row.body,
    tag: row.tag,
    is_latest: row.isLatest,
    is_published: row.isPublished,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

// GET /updates (public) — returns only published
const getUpdates = asyncHandler(async (req, res) => {
  const items = await Update.find({ isPublished: true }).sort({
    createdAt: -1,
  });
  res.json({ data: items.map(toApi) });
});

// GET /updates/all (protected) — returns all
const getAllUpdates = asyncHandler(async (req, res) => {
  const items = await Update.find({}).sort({ createdAt: -1 });
  res.json({ data: items.map(toApi) });
});

// POST /updates (protected)
const createUpdate = asyncHandler(async (req, res) => {
  const b = req.body;
  // If this is being set as latest, clear previous latest
  if (b.is_latest) {
    await Update.updateMany({}, { isLatest: false });
  }
  const update = await Update.create({
    title: b.title,
    body: b.body,
    tag: b.tag || "",
    isLatest: !!b.is_latest,
    isPublished: b.is_published !== undefined ? !!b.is_published : true,
  });
  res.status(201).json({ data: toApi(update) });
});

// PUT /updates/:id (protected)
const updateUpdate = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const b = req.body;
  if (b.is_latest) {
    await Update.updateMany(
      { _id: { $ne: req.params.id } },
      { isLatest: false },
    );
  }
  const update = await Update.findByIdAndUpdate(
    req.params.id,
    {
      ...(b.title !== undefined && { title: b.title }),
      ...(b.body !== undefined && { body: b.body }),
      ...(b.tag !== undefined && { tag: b.tag }),
      ...(b.is_latest !== undefined && { isLatest: b.is_latest }),
      ...(b.is_published !== undefined && { isPublished: b.is_published }),
    },
    { new: true, runValidators: true },
  );
  if (!update) throw new ApiError(404, "NOT_FOUND", "Update not found");
  res.json({ data: toApi(update) });
});

// DELETE /updates/:id (protected)
const deleteUpdate = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const update = await Update.findByIdAndDelete(req.params.id);
  if (!update) throw new ApiError(404, "NOT_FOUND", "Update not found");
  res.json({ data: { id: req.params.id } });
});

module.exports = {
  getUpdates,
  getAllUpdates,
  createUpdate,
  updateUpdate,
  deleteUpdate,
};
