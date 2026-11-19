import z from "zod";

export const createGoalSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(3, "Goal title is required")
    .max(50, "Goal title must not exceed 50 characters"),

  targetAmount: z
    .number()
    .positive("Target amount must be greater than zero"),

  durationMonths: z
    .number()
    .int("Duration must be a whole number")
    .pipe(
      z.union([
        z.literal(3),
        z.literal(6),
        z.literal(9),
        z.literal(12)
      ])
    )
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
