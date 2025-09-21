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
      "Le numéro de téléphone doit être au format +213 suivi de 9 chiffres (ex: +213123456789)"
    ),
  //review use constant
  role: z.enum([roles.patient, roles.doctor], {
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

  // Teacher/Doctor specific fields
  location: z.string().optional(),
  yearsOfExperience: z
    .string()
    .refine((val) => !val || !isNaN(Number(val)), "Doit être un nombre valide")
    .optional(),
  nationalIdCard: z
    .string()
    .refine(
      (val) => !val || /^\d{18}$/.test(val),
      "La carte d'identité doit contenir 18 chiffres"
    ),
  licenseFileUrl: z
    .string()
    .url("Veuillez entrer une URL valide")
    .optional()
    .or(z.literal("")),

  availabilityTimes: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)$/,
      "Time must be in the format HH:MM - HH:MM (e.g., 08:00 - 17:30)"
    )
    .optional(),
  consultationFee: z
    .string()
    .refine((val) => !val || !isNaN(Number(val)), "Doit être un montant valide")
    .optional(),
  education: z.string().optional(),

  address: z.string().optional(),
  preferredTime: z
    .enum(["morning", "afternoon", "evening", "night"])
    .optional(),
  emergencyContact: z
    .string()
    .refine(
      (value) => /^(\+213)\d{9}$/.test(value ?? ""),
      "Le numéro de téléphone doit être au format +213 suivi de 9 chiffres (ex: +213123456789)"
    ),
  medicalConditions: z.string().optional(),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export type Roles = "patient" | "doctor" | "admin";
// import { roles } from "@/types/roles.enum";
// import { z } from "zod";
// const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
// //!the entire SignUpSchema
// export const SignUpSchema = z.object({
//   firstName: z
//     .string()
//     .min(3, "Le prénom doit comporter au moins 3 caractères"),
//   lastName: z
//     .string()
//     .min(3, "Le nom de famille doit comporter au moins 3 caractères"),
//   email: z.string().email(),
//   phoneNumber: z
//     .string()
//     .refine(
//       (value) => /^(\+213)\d{9}$/.test(value ?? ""),
//       "Le numéro de téléphone doit être au format +216 suivi de 8 chiffres (ex: +21612345678)"
//     ),
//   //review use constant
//   role: z.enum([roles.student, roles.teacher], {
//     message: "Veuillez sélectionner un rôle",
//   }),
//   password: z
//     .string()
//     .min(6, "Le mot de passe doit comporter au moins 6 caractères")
//     .max(25),
//   confirmPassword: z
//     .string()
//     .min(6, "Le mot de passe doit comporter au moins 6 caractères")
//     .max(25),

//   diplomeFile: z
//     .any()
//     .refine((file) => {
//       return (
//         file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
//         "Le diplôme doit être un fichier PDF, JPG ou PNG"
//       );
//     })
//     .optional(),

//   identityFileFront: z
//     .any()
//     .refine(
//       (file) =>
//         file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
//       "La carte d'identité doit être un fichier PDF"
//     )
//     .optional(),
//   identityFileBack: z
//     .any()
//     .refine(
//       (file) =>
//         file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type),
//       "La carte d'identité doit être un fichier PDF"
//     )
//     .optional(),

//   specialties: z.array(z.string()).optional(),
// });

// export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

// export type Roles = "patient" | "doctor" | "admin";
