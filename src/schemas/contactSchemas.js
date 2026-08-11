const { z } = require("zod");

const createContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget: z.string().optional(),
  description: z.string().min(1),
  preferred_contact: z.enum(["email", "phone", "whatsapp"]).optional().default("email"),
});

const updateContactSchema = z.object({
  status: z.enum(["new", "in_progress", "completed", "archived"]).optional(),
  assigned_to: z.string().optional(),
});

module.exports = { createContactSchema, updateContactSchema };
