import { z } from "zod";

export const SignUpSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .refine(
      (value) => /^(\+216)\d{8}$/.test(value ?? ""),
      "Invalid phone number"
    ),
  role: z.enum(["teacher", "student"], {
    message: "Please select a role",
  }),
  password: z.string().min(6, "Password must be at least 6 characters").max(25),
  repeatPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(25),
});

export type SignInSchemaType = z.infer<typeof SignUpSchema>;

export type Roles = "teacher" | "student";
