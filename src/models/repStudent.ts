import { z } from "zod";

export const repStudentSchema = z.object({
	representative_id: z.number(),
	student_id: z.number(),
});

export type RepStudent = z.infer<typeof repStudentSchema>;

export const newRepStudentSchema = repStudentSchema;

export type NewRepStudent = z.infer<typeof newRepStudentSchema>;

export const updatedRepStudentSchema = repStudentSchema.partial();

export type UpdatedRepStudent = z.infer<typeof updatedRepStudentSchema>;
