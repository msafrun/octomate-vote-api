import { z } from 'zod';

export const createVoteSchema = z.object({
  name: z.string(),
});

export type CreateVoteSchema = z.infer<typeof createVoteSchema>;
