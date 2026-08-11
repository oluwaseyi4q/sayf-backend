const { z } = require("zod");

const createTestimonialSchema = z.object({
  client_name: z.string().min(1),
  client_role: z.string().optional(),
  client_company: z.string().optional(),
  client_photo: z.string().url().optional(),
  review: z.string().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  project_id: z.string().optional(), // Mongo ObjectId string
  is_published: z.boolean().optional().default(true),
});

const updateTestimonialSchema = createTestimonialSchema.partial();

module.exports = { createTestimonialSchema, updateTestimonialSchema };
