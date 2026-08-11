const Testimonial = require("../models/Testimonial");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { requireValidId } = require("../utils/objectId");

function toApi(doc) {
  if (!doc) return doc;
  const row = doc.toObject ? doc.toObject() : doc;
  return {
    id: row._id,
    client_name: row.clientName,
    client_role: row.clientRole,
    client_company: row.clientCompany,
    client_photo: row.clientPhoto,
    review: row.review,
    rating: row.rating,
    project_id: row.project,
    is_published: row.isPublished,
    created_at: row.createdAt,
  };
}

function toDb(body) {
  const data = {};
  if (body.client_name !== undefined) data.clientName = body.client_name;
  if (body.client_role !== undefined) data.clientRole = body.client_role;
  if (body.client_company !== undefined) data.clientCompany = body.client_company;
  if (body.client_photo !== undefined) data.clientPhoto = body.client_photo;
  if (body.review !== undefined) data.review = body.review;
  if (body.rating !== undefined) data.rating = body.rating;
  if (body.project_id !== undefined) data.project = body.project_id || null;
  if (body.is_published !== undefined) data.isPublished = body.is_published;
  return data;
}

// GET /testimonials (public — published only)
const getTestimonials = asyncHandler(async (req, res) => {
  const items = await Testimonial.find({ isPublished: true }).sort({ createdAt: -1 });
  res.json({ data: items.map(toApi) });
});

// POST /testimonials (protected)
const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(toDb(req.body));
  res.status(201).json({ data: toApi(testimonial) });
});

// PUT /testimonials/:id (protected)
const updateTestimonial = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, toDb(req.body), {
    new: true,
    runValidators: true,
  });
  if (!testimonial) throw new ApiError(404, "NOT_FOUND", "Testimonial not found");
  res.json({ data: toApi(testimonial) });
});

// DELETE /testimonials/:id (protected)
const deleteTestimonial = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw new ApiError(404, "NOT_FOUND", "Testimonial not found");
  res.status(204).send();
});

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
