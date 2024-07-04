import { z } from "zod";

export const coordinatorSchema = z.object({
	id: z.number(),
	ic: z.string(),
	name: z.string(),
	last_name: z.string(),
	entry_date: z.string(),
	withdraw_date: z.string().nullable(),

	user_id: z.number(),
});

export type Coordinator = z.infer<typeof coordinatorSchema>;
