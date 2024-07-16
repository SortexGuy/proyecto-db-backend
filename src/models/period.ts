import { z } from "zod";

export const periodSchema = z.object({
	id: z.number(),
	start_date: z.string().date(),
	end_date: z.string().date(),
});

export type Period = z.infer<typeof periodSchema>;

export const newPeriodSchema = periodSchema.omit({ id: true });

export type NewPeriod = z.infer<typeof newPeriodSchema>;

export const updatedPeriodSchema = periodSchema.omit({ id: true }).partial();

export type UpdatedPeriod = z.infer<typeof updatedPeriodSchema>;
