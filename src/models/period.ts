import { z } from "zod";

export const periodSchema = z.object({
	id: z.number(),
	start_date: z.string().date(),
	end_date: z.string().date(),
});

export type Period = z.infer<typeof periodSchema>;
