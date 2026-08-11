// Lightweight sanitization: trims strings and strips null bytes from
// req.body/query/params. Keeps things simple and dependency-free.
function sanitizeValue(value) {
  if (typeof value === "string") {
    return value.replace(/\0/g, "").trim();
  }
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) out[key] = sanitizeValue(value[key]);
    return out;
  }
  return value;
}

function sanitizeInputs(req, res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}

module.exports = { sanitizeInputs };
