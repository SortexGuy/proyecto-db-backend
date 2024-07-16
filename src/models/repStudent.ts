import { z } from "zod";

export const repStudentSchema = z.object({
	id: z.number(),
	representative_id: z.number(),
	student_id: z.number(),
});

export type RepStudent = z.infer<typeof repStudentSchema>;

export const newRepStudentSchema = repStudentSchema.omit({ id: true });

export type NewRepStudent = z.infer<typeof newRepStudentSchema>;
