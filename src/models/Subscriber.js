const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: String,
    isActive: { type: Boolean, default: true },
    unsubscribeToken: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: "subscribedAt", updatedAt: false } }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
