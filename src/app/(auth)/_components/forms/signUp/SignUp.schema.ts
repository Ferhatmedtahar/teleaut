import { z } from "zod";
const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
//!the entire SignUpSchema
export const SignUpSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .refine(
      (value) => /^(\+216)\d{8}$/.test(value ?? ""),
      "Le numéro de téléphone doit être au format +216 suivi de 8 chiffres (ex: +21612345678)"
    ),
  role: z.enum(["teacher", "student"], {
    message: "Please select a role",
  }),

  branch: z.string().optional(),
  class: z.string({
    message: "Please select a class",
  }),
  password: z.string().min(6, "Password must be at least 6 characters").max(25),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(25),

  diplomeFile: z
    .any()
    .refine((file) => {
      return (
        file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
        "Diplôme must be a PDF, JPG, or PNG file"
      );
    })
    .optional(),

  identityFileFront: z
    .any()
    .refine(
      (file) =>
        file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
      "Carte d'identité must be a PDF file"
    )
    .optional(),
  identityFileBack: z
    .any()
    .refine(
      (file) =>
        file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
      "Carte d'identité must be a PDF file"
    )
    .optional(),

  specialties: z.array(z.string()).optional(),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export type Roles = "teacher" | "student";
