import { z } from "zod";

export const studentSchema = z.object({
	id: z.number(),
	ic: z.string(),
	name: z.string(),
	last_name: z.string(),
	current_year: z.number().min(1).max(6),
	status: z.enum(["active", "completed", "retired"]),
});

export type Student = z.infer<typeof studentSchema>;
