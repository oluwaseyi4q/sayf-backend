const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES_IN = Number(process.env.JWT_ACCESS_EXPIRES_IN );
const REFRESH_EXPIRES_IN = Number(process.env.JWT_REFRESH_EXPIRES_IN );

function signAccessToken(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

function signRefreshToken(admin) {
  return jwt.sign({ sub: admin.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

// Refresh tokens are stored server-side only as a hash, so a leaked DB
// doesn't expose usable tokens, and logout can invalidate them.
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
};
