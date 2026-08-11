const crypto = require("crypto");
const Subscriber = require("../models/Subscriber");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendMail } = require("../utils/mailer");

function toApi(doc) {
  if (!doc) return doc;
  const row = doc.toObject ? doc.toObject() : doc;
  return {
    id: row._id,
    email: row.email,
    name: row.name,
    is_active: row.isActive,
    subscribed_at: row.subscribedAt,
  };
}

// POST /newsletter/subscribe (public)
const subscribe = asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  const existing = await Subscriber.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (existing.isActive) {
      throw new ApiError(409, "CONFLICT", "This email is already subscribed");
    }
    existing.isActive = true;
    if (name) existing.name = name;
    await existing.save();
    return res.status(200).json({ message: "Subscribed successfully", data: toApi(existing) });
  }

  const unsubscribeToken = crypto.randomBytes(24).toString("hex");
  const subscriber = await Subscriber.create({ email, name, unsubscribeToken });

  const unsubscribeUrl = `${process.env.FRONTEND_URL || ""}/newsletter/unsubscribe?token=${unsubscribeToken}`;
  await sendMail({
    to: email,
    subject: "Welcome to the Sayf Technology Newsletter",
    html: `<p>Hi ${name || "there"},</p><p>Thanks for subscribing to the Sayf Technology newsletter! You'll hear from us with updates and insights.</p><p><a href="${unsubscribeUrl}">Unsubscribe</a> at any time.</p>`,
  });

  res.status(201).json({ message: "Subscribed successfully", data: toApi(subscriber) });
});

// POST /newsletter/unsubscribe (public, via token)
const unsubscribe = asyncHandler(async (req, res) => {
  const token = req.body.token || req.query.token;
  if (!token) throw new ApiError(400, "VALIDATION_ERROR", "token is required");

  const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
  if (!subscriber) throw new ApiError(404, "NOT_FOUND", "Invalid unsubscribe token");

  subscriber.isActive = false;
  await subscriber.save();
  res.json({ message: "Unsubscribed successfully" });
});

// GET /newsletter/subscribers (protected)
const getSubscribers = asyncHandler(async (req, res) => {
  const { limit, page } = req.query;
  const take = limit ? Number(limit) : 50;
  const currentPage = page ? Number(page) : 1;

  const [items, total] = await Promise.all([
    Subscriber.find()
      .sort({ subscribedAt: -1 })
      .skip((currentPage - 1) * take)
      .limit(take),
    Subscriber.countDocuments(),
  ]);

  res.json({
    data: items.map(toApi),
    pagination: { total, page: currentPage, limit: take, pages: Math.ceil(total / take) },
  });
});

// GET /newsletter/subscribers/export (protected) — CSV
const exportSubscribers = asyncHandler(async (req, res) => {
  const items = await Subscriber.find().sort({ subscribedAt: -1 });

  const escapeCsv = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const header = "id,email,name,is_active,subscribed_at";
  const rows = items.map((s) =>
    [s._id, s.email, s.name || "", s.isActive, s.subscribedAt.toISOString()].map(escapeCsv).join(",")
  );
  const csv = [header, ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");
  res.send(csv);
});

module.exports = { subscribe, unsubscribe, getSubscribers, exportSubscribers };
