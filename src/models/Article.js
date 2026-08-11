const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: String,
    featuredImage: String,
    excerpt: String,
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["flutter", "design", "development", "business", "ai", "startup", "case-study"],
    },
    tags: { type: [String], default: [] },
    readTime: Number,
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
