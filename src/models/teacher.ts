import { z } from "zod";
import { newUserSchema } from "./user";

export const teacherSchema = z.object({
	id: z.number(),
	ic: z.string(),
	name: z.string(),
	last_name: z.string(),
	contact: z.string(),

	user_id: z.number(),
});

export type Teacher = z.infer<typeof teacherSchema>;

export const newTeacherSchema = teacherSchema
	.omit({ id: true, user_id: true })
	.merge(newUserSchema.omit({ role: true }));

export type NewTeacher = z.infer<typeof newTeacherSchema>;

export const updatedTeacherSchema = teacherSchema
	.omit({ id: true, user_id: true })
	.partial();

export type UpdatedTeacher = z.infer<typeof updatedTeacherSchema>;
