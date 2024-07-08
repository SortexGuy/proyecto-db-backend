import { z } from "zod";

export const representativeSchema = z.object({
	id: z.number(),
	ic: z.string(),
	name: z.string(),
	last_name: z.string(),

	user_id: z.number(),
});

export type Representative = z.infer<typeof representativeSchema>;
