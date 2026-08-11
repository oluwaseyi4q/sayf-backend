const slugify = require("slugify");

// Generates a unique slug for a Mongoose model by appending -2, -3, ... on collision.
async function generateUniqueSlug(Model, title, ignoreId = null) {
  const base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Model.findOne({ slug });
    if (!existing || String(existing._id) === String(ignoreId)) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

module.exports = { generateUniqueSlug };
