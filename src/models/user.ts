import { z } from "zod";

const userBaseSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  ic: z.string(),
  name: z.string(),
  lastName: z.string(),
});

const teacherSchema = userBaseSchema.extend({
  role: z.literal("teacher"),
});

const representativeSchema = userBaseSchema.extend({
  role: z.literal("representative"),
});

const coordinatorSchema = userBaseSchema.extend({
  role: z.literal("coordinator"),
  entry_date: z.string().date(),
  withdraw_date: z.string().date().optional(),
});

export type Teacher = z.infer<typeof teacherSchema>;
export type Representative = z.infer<typeof representativeSchema>;
export type Coordinator = z.infer<typeof coordinatorSchema>;
