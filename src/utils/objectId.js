const mongoose = require("mongoose");
const ApiError = require("./ApiError");

// Validates a route param looks like a Mongo ObjectId before querying,
// so bad input returns a clean 400/404 instead of a Mongoose CastError.
function requireValidId(id, label = "id") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "VALIDATION_ERROR", `Invalid ${label}`);
  }
}

module.exports = { requireValidId };
