import { z } from "zod";

export const qualificationSchema = z.object({
	id: z.string(),
	value: z.number().min(1).max(20),
	section: z.number().min(1).max(5),
	lapse: z.number().min(1).max(3),

	student_id: z.number(),
	period_id: z.number(),
	course_id: z.number(),
});

export type Qualification = z.infer<typeof qualificationSchema>;
