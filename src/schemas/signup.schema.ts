import { z } from "zod";

export const usernameValidationSchema = z
  .string()
  .min(3)
  .max(24)
  .regex(
    /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim,
    "Can only contain alphanumeric characters and the following special characters: dot (.), underscore(_) and dash (-). The special characters cannot appear more than once consecutively or combined."
  );

export const signupSchema = z.object({
  username: usernameValidationSchema,

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
