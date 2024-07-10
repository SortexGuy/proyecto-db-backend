import { z } from "zod";

export const chargeSchema = z.object({
	id: z.number(),

	period_id: z.number(),
	course_id: z.number(),
	teacher_id: z.number(),
});

export type Charge = z.infer<typeof chargeSchema>;

export const extChargeSchema = z.object({
	start_date: z.string().date(),
	end_date: z.string().date(),
	course_name: z.string(),
	course_year: z.number(),
});

export type ExtCharge = z.infer<typeof extChargeSchema>;
