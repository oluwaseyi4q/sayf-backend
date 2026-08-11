const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  ACCESS_EXPIRES_IN,
} = require("../utils/tokens");

// POST /auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");

  const access_token = signAccessToken(admin);
  const refresh_token = signRefreshToken(admin);

  admin.refreshTokenHash = hashToken(refresh_token);
  await admin.save();

  res.json({ access_token, refresh_token, expires_in: ACCESS_EXPIRES_IN });
});

// POST /auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  let payload;
  try {
    payload = verifyRefreshToken(refresh_token);
  } catch {
    throw new ApiError(401, "INVALID_TOKEN", "Invalid or expired refresh token");
  }

  const admin = await Admin.findById(payload.sub);
  if (!admin || admin.refreshTokenHash !== hashToken(refresh_token)) {
    throw new ApiError(401, "INVALID_TOKEN", "Refresh token has been revoked");
  }

  const access_token = signAccessToken(admin);
  res.json({ access_token, expires_in: ACCESS_EXPIRES_IN });
});

// POST /auth/logout  (protected)
const logout = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(req.admin.id, { refreshTokenHash: null });
  res.status(204).send();
});

module.exports = { login, refresh, logout };
