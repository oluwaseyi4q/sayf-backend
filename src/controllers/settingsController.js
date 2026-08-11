const Settings = require("../models/Settings");
const asyncHandler = require("../utils/asyncHandler");

function toApi(doc) {
  if (!doc) return doc;
  const row = doc.toObject ? doc.toObject() : doc;
  return {
    company_name: row.companyName,
    tagline: row.tagline,
    email: row.email,
    phone: row.phone,
    address: row.address,
    logo_url: row.logoUrl,
    favicon_url: row.faviconUrl,
    twitter_url: row.twitterUrl,
    linkedin_url: row.linkedinUrl,
    instagram_url: row.instagramUrl,
    github_url: row.githubUrl,
    meta_title: row.metaTitle,
    meta_description: row.metaDescription,
  };
}

function toDb(body) {
  const data = {};
  if (body.company_name !== undefined) data.companyName = body.company_name;
  if (body.tagline !== undefined) data.tagline = body.tagline;
  if (body.email !== undefined) data.email = body.email;
  if (body.phone !== undefined) data.phone = body.phone;
  if (body.address !== undefined) data.address = body.address;
  if (body.logo_url !== undefined) data.logoUrl = body.logo_url;
  if (body.favicon_url !== undefined) data.faviconUrl = body.favicon_url;
  if (body.twitter_url !== undefined) data.twitterUrl = body.twitter_url;
  if (body.linkedin_url !== undefined) data.linkedinUrl = body.linkedin_url;
  if (body.instagram_url !== undefined) data.instagramUrl = body.instagram_url;
  if (body.github_url !== undefined) data.githubUrl = body.github_url;
  if (body.meta_title !== undefined) data.metaTitle = body.meta_title;
  if (body.meta_description !== undefined) data.metaDescription = body.meta_description;
  return data;
}

// Settings is a singleton document, auto-created on first read.
async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
}

// GET /settings (public)
const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ data: toApi(settings) });
});

// PUT /settings (protected)
const updateSettings = asyncHandler(async (req, res) => {
  const existing = await getOrCreateSettings();
  const settings = await Settings.findByIdAndUpdate(existing._id, toDb(req.body), {
    new: true,
    runValidators: true,
  });
  res.json({ data: toApi(settings) });
});

module.exports = { getSettings, updateSettings };
