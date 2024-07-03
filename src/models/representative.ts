import { z } from "zod";

export const representativeSchema = z.object({
  id: z.string(),
  ic: z.string(),
  name: z.string(),
  last_name: z.string(),
  user_id: z.string(),
});

export type Representative = z.infer<typeof representativeSchema>;
