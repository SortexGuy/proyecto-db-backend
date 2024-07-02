import { z } from "zod";

export const qualificationSchema = z.object({
  id: z.string(),
  value: z.number().min(1).max(20),
});
