const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    problem: String,
    solution: String,
    coverImage: String,
    gallery: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    category: { type: String, required: true, enum: ["mobile", "web", "branding", "design"] },
    client: String,
    completionDate: Date,
    liveUrl: String,
    githubUrl: String,
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
