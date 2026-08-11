const ContactSubmission = require("../models/ContactSubmission");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendMail } = require("../utils/mailer");
const { requireValidId } = require("../utils/objectId");

function toApi(doc) {
  if (!doc) return doc;
  const row = doc.toObject ? doc.toObject() : doc;
  return {
    id: row._id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    budget: row.budget,
    description: row.description,
    preferred_contact: row.preferredContact,
    status: row.status,
    assigned_to: row.assignedTo,
    created_at: row.createdAt,
  };
}

// POST /contact (public)
const createContactSubmission = asyncHandler(async (req, res) => {
  const b = req.body;
  const submission = await ContactSubmission.create({
    name: b.name,
    email: b.email,
    phone: b.phone,
    company: b.company,
    budget: b.budget,
    description: b.description,
    preferredContact: b.preferred_contact,
  });

  await Promise.allSettled([
    sendMail({
      to: submission.email,
      subject: "We received your message — Sayf Technology",
      html: `<p>Hi ${submission.name},</p><p>Thanks for reaching out to Sayf Technology. We've received your message and will get back to you shortly.</p>`,
      text: `Hi ${submission.name}, thanks for reaching out to Sayf Technology. We've received your message and will get back to you shortly.`,
    }),
    sendMail({
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      subject: `New contact submission from ${submission.name}`,
      html: `<p><strong>Name:</strong> ${submission.name}</p><p><strong>Email:</strong> ${submission.email}</p><p><strong>Phone:</strong> ${submission.phone || "-"}</p><p><strong>Company:</strong> ${submission.company || "-"}</p><p><strong>Budget:</strong> ${submission.budget || "-"}</p><p><strong>Message:</strong> ${submission.description}</p>`,
    }),
  ]);

  res.status(201).json({ data: toApi(submission) });
});

// GET /contact (protected)
const getContactSubmissions = asyncHandler(async (req, res) => {
  const { status, limit, page } = req.query;
  const take = limit ? Number(limit) : 20;
  const currentPage = page ? Number(page) : 1;
  const where = status ? { status } : {};

  const [items, total] = await Promise.all([
    ContactSubmission.find(where)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * take)
      .limit(take),
    ContactSubmission.countDocuments(where),
  ]);

  res.json({
    data: items.map(toApi),
    pagination: { total, page: currentPage, limit: take, pages: Math.ceil(total / take) },
  });
});

// PUT /contact/:id (protected) — update status / assign
const updateContactSubmission = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const data = {};
  if (req.body.status !== undefined) data.status = req.body.status;
  if (req.body.assigned_to !== undefined) data.assignedTo = req.body.assigned_to;

  const submission = await ContactSubmission.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!submission) throw new ApiError(404, "NOT_FOUND", "Contact submission not found");
  res.json({ data: toApi(submission) });
});

// DELETE /contact/:id (protected) — archive submission
const archiveContactSubmission = asyncHandler(async (req, res) => {
  requireValidId(req.params.id);
  const submission = await ContactSubmission.findByIdAndUpdate(
    req.params.id,
    { status: "archived" },
    { new: true }
  );
  if (!submission) throw new ApiError(404, "NOT_FOUND", "Contact submission not found");
  res.json({ data: toApi(submission) });
});

module.exports = {
  createContactSubmission,
  getContactSubmissions,
  updateContactSubmission,
  archiveContactSubmission,
};
