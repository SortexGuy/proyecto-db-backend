import { z } from "zod";

export const periodSchema = z.object({
	id: z.string(),
	start: z.string().date(),
	end: z.string().date(),
});

export type Period = z.infer<typeof periodSchema>;
