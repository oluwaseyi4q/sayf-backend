const Project = require("../models/Project");
const Article = require("../models/Article");
const Subscriber = require("../models/Subscriber");
const ContactSubmission = require("../models/ContactSubmission");
const Testimonial = require("../models/Testimonial");
const asyncHandler = require("../utils/asyncHandler");

// GET /admin/stats (protected)
const getStats = asyncHandler(async (req, res) => {
  const [
    total_projects,
    total_articles,
    total_subscribers,
    new_contacts,
    total_testimonials,
  ] = await Promise.all([
    Project.countDocuments(),
    Article.countDocuments(),
    Subscriber.countDocuments({ isActive: true }),
    ContactSubmission.countDocuments({ status: "new" }),
    Testimonial.countDocuments(),
  ]);

  res.json({ total_projects, total_articles, total_subscribers, new_contacts, total_testimonials });
});

module.exports = { getStats };
