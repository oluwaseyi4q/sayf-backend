const { z } = require("zod");

const updateSettingsSchema = z.object({
  company_name: z.string().optional(),
  tagline: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  logo_url: z.string().url().optional(),
  favicon_url: z.string().url().optional(),
  twitter_url: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
  instagram_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

module.exports = { updateSettingsSchema };
