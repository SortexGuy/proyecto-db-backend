import { z } from "zod";

export const chargeSchema = z.object({
	id: z.number(),
	section: z.number().min(1).max(5),

	period_id: z.number(),
	course_id: z.number(),
	teacher_id: z.number(),
});

export type Charge = z.infer<typeof chargeSchema>;

export const extChargeSchema = z.object({
	section: z.number().min(1).max(5),
	start_date: z.string().date(),
	end_date: z.string().date(),
	course_name: z.string(),
	course_year: z.number().min(1).max(6),
});

export type ExtCharge = z.infer<typeof extChargeSchema>;

export const newChargeSchema = chargeSchema.omit({ id: true });

export type NewCharge = z.infer<typeof newChargeSchema>;
