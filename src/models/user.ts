import { z } from "zod";

export const userSchema = z.object({
	id: z.number(),
	username: z.string(),
	password: z.string(),
	role: z.union([
		z.literal("coordinator"),
		z.literal("teacher"),
		z.literal("representative"),
	]),
});

export type User = z.infer<typeof userSchema>;

export const newUserSchema = userSchema.omit({ id: true });

export type NewUser = z.infer<typeof newUserSchema>;

export const updatedUserSchema = userSchema
	.omit({ id: true, role: true })
	.partial();

export type UpdatedUser = z.infer<typeof updatedUserSchema>;
