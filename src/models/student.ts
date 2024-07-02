import { z } from "zod";

export const studentSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string(),
  ic: z.string(),
});
