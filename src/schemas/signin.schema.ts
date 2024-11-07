import z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email()
    .regex(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi, "invalid email"),
  password: z
    .string()
    .min(8)
    .max(20)
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
      "at least 8 characters must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number Can contain special characters"
    ),
});




