const { z } = require("zod");

const createTeamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().optional(),
  photo: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
  twitter_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  order: z.number().int().optional().default(0),
  is_published: z.boolean().optional().default(true),
});

const updateTeamMemberSchema = createTeamMemberSchema.partial();

module.exports = { createTeamMemberSchema, updateTeamMemberSchema };
