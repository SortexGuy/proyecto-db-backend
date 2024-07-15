import { z } from "zod";

export const courseSchema = z.object({
	id: z.number(),
	name: z.string(),
	year: z.number().min(1).max(6),
});

export type Course = z.infer<typeof courseSchema>;

export const newCourseSchema = courseSchema.omit({ id: true });

export type NewCourse = z.infer<typeof newCourseSchema>;
