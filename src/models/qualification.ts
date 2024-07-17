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

	charge_id: z.number(),
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

export const searchQualificationSchema = z.object({
	value: z.coerce.number().min(1).max(20).optional(),
	lapse: z.coerce.number().min(1).max(3).optional(),

	section: z.coerce.number().min(1).max(5).optional(),
	start_date: z.coerce.string().date().optional(),
	end_date: z.coerce.string().date().optional(),
	course_name: z.coerce.string().optional(),
	course_year: z.coerce.number().min(1).max(6).optional(),
	teacher_id: z.coerce.number().optional(),
});

export type SearchQualification = z.infer<typeof searchQualificationSchema>;
