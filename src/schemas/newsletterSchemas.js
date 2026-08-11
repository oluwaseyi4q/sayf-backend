const { z } = require("zod");

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

const unsubscribeSchema = z.object({
  token: z.string().min(1),
});

module.exports = { subscribeSchema, unsubscribeSchema };
