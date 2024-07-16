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

export const newStudentSchema = studentSchema.omit({ id: true });

export type NewStudent = z.infer<typeof newStudentSchema>;

export const updatedStudentSchema = studentSchema.omit({ id: true }).partial();

export type UpdatedStudent = z.infer<typeof updatedStudentSchema>;
