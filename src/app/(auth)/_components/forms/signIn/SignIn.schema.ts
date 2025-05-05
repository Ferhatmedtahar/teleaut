import { z } from "zod";

export const SignInSchema = z.object({
  emailOrUsername: z.union([z.string().email(), z.string().min(1)]),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
