import z from "zod";

export const signupSchema = z.strictObject({
    name: z
    .string()
    .trim()
    .min(1,"Name is Required")
    .max(30, "Name is Too Long"),

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

export type SignupInput = z.infer<typeof signupSchema>