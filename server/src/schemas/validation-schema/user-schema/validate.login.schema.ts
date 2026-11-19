import z from "zod";

export const loginSchema = z.strictObject({

    email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email()),

    password: z
    .string()
    .min(8, "Passport must be at least 15 characters")
    .max(30, "Password is too long")
})

export type loginInput = z.infer<typeof loginSchema>