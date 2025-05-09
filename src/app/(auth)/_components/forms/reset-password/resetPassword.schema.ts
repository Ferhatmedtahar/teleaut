import { z } from "zod";

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(25),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(25),
});

export type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
