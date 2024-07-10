import { z } from "zod";

export const studentSchema = z.object({
	id: z.number(),
	ic: z.string(),
	name: z.string(),
	last_name: z.string(),
});

export type Student = z.infer<typeof studentSchema>;
