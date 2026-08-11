const ApiError = require("../utils/ApiError");

// Wraps a zod schema: validates req.body and replaces it with the parsed
// (and coerced/defaulted) result, or forwards a 400 ApiError.
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return next(new ApiError(400, "VALIDATION_ERROR", message));
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validateBody };
