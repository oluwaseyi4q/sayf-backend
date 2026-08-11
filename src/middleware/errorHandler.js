const ApiError = require("../utils/ApiError");

function notFoundHandler(req, res, next) {
  next(new ApiError(404, "NOT_FOUND", `Route ${req.method} ${req.originalUrl} not found`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let { statusCode, code, message } = err;

  // Mongoose duplicate key error (e.g. unique email/slug already exists)
  if (err.code === 11000) {
    statusCode = 409;
    code = "CONFLICT";
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}`;
  }

  // Mongoose failed schema validation
  if (err.name === "ValidationError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
  }

  // Mongoose cast error (e.g. malformed ObjectId reached a query)
  if (err.name === "CastError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = `Invalid value for ${err.path}`;
  }

  if (!(err instanceof ApiError) && !statusCode) {
    statusCode = 500;
    code = "INTERNAL_SERVER_ERROR";
    message = process.env.NODE_ENV === "production" ? "Something went wrong" : err.message;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode || 500).json({
    error: true,
    message: message || "Something went wrong",
    code: code || "INTERNAL_SERVER_ERROR",
  });
}

module.exports = { notFoundHandler, errorHandler };
