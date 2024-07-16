import { z } from "zod";
import { newUserSchema } from "./user";

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

export const newCoordinatorSchema = coordinatorSchema
	.omit({ id: true, user_id: true })
	.partial({ withdraw_date: true })
	.merge(newUserSchema.omit({ role: true }));

export type NewCoordinator = z.infer<typeof newCoordinatorSchema>;
