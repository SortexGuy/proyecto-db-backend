import { z } from "zod";

export const courseSchema = z.object({
	id: z.number(),
	name: z.string(),
	year: z.number().min(1).max(6),
});

export type Course = z.infer<typeof courseSchema>;
