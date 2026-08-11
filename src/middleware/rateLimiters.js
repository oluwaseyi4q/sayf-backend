const rateLimit = require("express-rate-limit");

// PRD: rate limit /contact and /newsletter/subscribe to 5 req/min per IP
const fiveRequestsPerMinute = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    message: "Too many requests, please try again in a minute.",
    code: "RATE_LIMITED",
  },
});

// Slightly more generous limiter for the login route to slow brute-forcing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: true,
    message: "Too many login attempts, please try again later.",
    code: "RATE_LIMITED",
  },
});

module.exports = { fiveRequestsPerMinute, authLimiter };
