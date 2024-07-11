import { z } from "zod";

export const qualificationSchema = z.object({
	id: z.number(),
	value: z.number().min(1).max(20),
	section: z.number().min(1).max(5),
	lapse: z.number().min(1).max(3),

	student_id: z.number(),
	charge_id: z.number(),
});

export type Qualification = z.infer<typeof qualificationSchema>;

export const extQualificationSchema = z.object({
	id: z.number(),
	value: z.number().min(1).max(20),
	section: z.number().min(1).max(5),
	lapse: z.number().min(1).max(3),

	start_date: z.string().date(),
	end_date: z.string().date(),
	course_name: z.string(),
	course_year: z.number().min(1).max(6),
	teacher_id: z.number(),
});

export type ExtQualification = z.infer<typeof extQualificationSchema>;
