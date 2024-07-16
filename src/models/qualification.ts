import { z } from "zod";

export const qualificationSchema = z.object({
	id: z.number(),
	value: z.number().min(1).max(20),
	lapse: z.number().min(1).max(3),

	student_id: z.number(),
	charge_id: z.number(),
});

export type Qualification = z.infer<typeof qualificationSchema>;

export const extQualificationSchema = z.object({
	id: z.number(),
	value: z.number().min(1).max(20),
	lapse: z.number().min(1).max(3),

	section: z.number().min(1).max(5),
	start_date: z.string().date(),
	end_date: z.string().date(),
	course_name: z.string(),
	course_year: z.number().min(1).max(6),
	teacher_id: z.number(),
});

export type ExtQualification = z.infer<typeof extQualificationSchema>;

export const newQualificationSchema = qualificationSchema.omit({ id: true });

export type NewQualification = z.infer<typeof newQualificationSchema>;

export const updatedQualificationSchema = qualificationSchema
	.omit({ id: true })
	.partial();

export type UpdatedQualification = z.infer<typeof updatedQualificationSchema>;
