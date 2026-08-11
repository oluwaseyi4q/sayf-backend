const ApiError = require("../utils/ApiError");
const { verifyAccessToken } = require("../utils/tokens");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "UNAUTHORIZED", "Missing or malformed Authorization header"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return next(new ApiError(401, "UNAUTHORIZED", "Invalid or expired access token"));
  }
}

module.exports = { requireAuth };
