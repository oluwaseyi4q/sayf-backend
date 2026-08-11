const { z } = require("zod");

const CATEGORIES = ["mobile", "web", "branding", "design"];

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  problem: z.string().optional(),
  solution: z.string().optional(),
  cover_image: z.string().url().optional(),
  gallery: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  category: z.enum(CATEGORIES),
  client: z.string().optional(),
  completion_date: z.coerce.date().optional(),
  live_url: z.string().url().optional().or(z.literal("")),
  github_url: z.string().url().optional().or(z.literal("")),
  is_featured: z.boolean().optional().default(false),
  is_published: z.boolean().optional().default(false),
  related_projects: z.array(z.string()).optional().default([]), // Mongo ObjectId strings
});

const updateProjectSchema = createProjectSchema.partial();

module.exports = { createProjectSchema, updateProjectSchema, CATEGORIES };
