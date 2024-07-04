import { z } from "zod";

export const envSchema = z.object({
	JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
