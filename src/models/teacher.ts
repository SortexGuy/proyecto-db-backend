import { z } from "zod";

export const teacherSchema = z.object({
	id: z.number(),
	ic: z.string(),
	name: z.string(),
	last_name: z.string(),

	user_id: z.number(),
});

export type Teacher = z.infer<typeof teacherSchema>;
