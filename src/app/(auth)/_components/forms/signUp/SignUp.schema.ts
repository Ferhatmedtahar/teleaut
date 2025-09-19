import { roles } from "@/types/roles.enum";
import { z } from "zod";
const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
//!the entire SignUpSchema
export const SignUpSchema = z.object({
  firstName: z
    .string()
    .min(3, "Le prénom doit comporter au moins 3 caractères"),
  lastName: z
    .string()
    .min(3, "Le nom de famille doit comporter au moins 3 caractères"),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .refine(
      (value) => /^(\+213)\d{9}$/.test(value ?? ""),
      "Le numéro de téléphone doit être au format +216 suivi de 8 chiffres (ex: +21612345678)"
    ),
  //review use constant
  role: z.enum([roles.student, roles.teacher], {
    message: "Veuillez sélectionner un rôle",
  }),
  password: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères")
    .max(25),
  confirmPassword: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères")
    .max(25),

  diplomeFile: z
    .any()
    .refine((file) => {
      return (
        file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
        "Le diplôme doit être un fichier PDF, JPG ou PNG"
      );
    })
    .optional(),

  identityFileFront: z
    .any()
    .refine(
      (file) =>
        file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
      "La carte d'identité doit être un fichier PDF"
    )
    .optional(),
  identityFileBack: z
    .any()
    .refine(
      (file) =>
        file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
      "La carte d'identité doit être un fichier PDF"
    )
    .optional(),

  specialties: z.array(z.string()).optional(),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export type Roles = "patient" | "doctor" | "admin";
