import { z } from "zod";
import { newUserSchema } from "./user";

export const representativeSchema = z.object({
	id: z.number(),
	ic: z.string(),
	name: z.string(),
	last_name: z.string(),

	user_id: z.number(),
});

export type Representative = z.infer<typeof representativeSchema>;

export const newRepresentativeSchema = representativeSchema
	.omit({ id: true, user_id: true })
	.merge(newUserSchema.omit({ role: true }));

export type NewRepresentative = z.infer<typeof newRepresentativeSchema>;
