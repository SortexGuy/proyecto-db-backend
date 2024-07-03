import { z } from "zod";

export const courseSchema = z.object({
  id: z.string(),
  name: z.string(),
  year: z.number().min(1).max(5),
});

export type Course = z.infer<typeof courseSchema>;
