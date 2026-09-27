const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tag: { type: String, default: "" },
    isLatest: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Update", updateSchema);
