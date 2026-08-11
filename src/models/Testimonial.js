const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientRole: String,
    clientCompany: String,
    clientPhoto: String,
    review: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
