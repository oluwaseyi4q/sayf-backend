const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: "Sayf Technology" },
  tagline: String,
  email: String,
  phone: String,
  address: String,
  logoUrl: String,
  faviconUrl: String,
  twitterUrl: String,
  linkedinUrl: String,
  instagramUrl: String,
  githubUrl: String,
  metaTitle: String,
  metaDescription: String,
});

module.exports = mongoose.model("Settings", settingsSchema);
