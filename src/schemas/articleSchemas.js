const { z } = require("zod");

const CATEGORIES = ["flutter", "design", "development", "business", "ai", "startup", "case-study"];

const createArticleSchema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  featured_image: z.string().url().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string()).optional().default([]),
  read_time: z.number().int().positive().optional(),
  is_published: z.boolean().optional().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

const updateArticleSchema = createArticleSchema.partial();

module.exports = { createArticleSchema, updateArticleSchema, CATEGORIES };
