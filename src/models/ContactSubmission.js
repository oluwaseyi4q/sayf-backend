const mongoose = require("mongoose");

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    budget: String,
    description: { type: String, required: true },
    preferredContact: { type: String, enum: ["email", "phone", "whatsapp"], default: "email" },
    status: {
      type: String,
      enum: ["new", "in_progress", "completed", "archived"],
      default: "new",
    },
    assignedTo: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("ContactSubmission", contactSubmissionSchema);
