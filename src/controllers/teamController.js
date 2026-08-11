const TeamMember = require("../models/TeamMember");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { requireValidId } = require("../utils/objectId");

function toApi(doc) {
  if (!doc) return doc;
  const row = doc.toObject ? doc.toObject() : doc;
  return {
    id: row._id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    photo: row.photo,
    linkedin_url: row.linkedinUrl,
    twitter_url: row.twitterUrl,
    github_url: row.githubUrl,
    order: row.order,
    is_published: row.isPublished,
    created_at: row.createdAt,
  };
}

function toDb(body) {
  const data = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.role !== undefined) data.role = body.role;
  if (body.bio !== undefined) data.bio = body.bio;
  if (body.photo !== undefined) data.photo = body.photo;
  if (body.linkedin_url !== undefined) data.linkedinUrl = body.linkedin_url;
  if (body.twitter_url !== undefined) data.twitterUrl = body.twitter_url;
  if (body.github_url !== undefined) data.githubUrl = body.github_url;
  if (body.order !== undefined) data.order = body.order;
  if (body.is_published !== undefined) data.isPublished = body.is_published;
  return data;
}

// GET /team (public — published only)
const getTeam = asyncHandler(async (req, res) => {
  const items = await TeamMember.find({ isPublished: true }).sort({ order: 1 });
  res.json({ data: items.map(toApi) });
});

// POST /team (protected)
const createTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.create(toDb(req.body));
  res.status(201).json({ data: toApi(member) });
});

// PUT /team/:id (protected)
const updateTeamMember = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const member = await TeamMember.findByIdAndUpdate(req.params.id, toDb(req.body), {
    new: true,
    runValidators: true,
  });
  if (!member) throw new ApiError(404, "NOT_FOUND", "Team member not found");
  res.json({ data: toApi(member) });
});

// DELETE /team/:id (protected)
const deleteTeamMember = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) throw new ApiError(404, "NOT_FOUND", "Team member not found");
  res.status(204).send();
});

module.exports = { getTeam, createTeamMember, updateTeamMember, deleteTeamMember };
