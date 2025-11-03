import { roles } from "@/types/roles.enum";
import { z } from "zod";

const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

// Specialty options
export const specialtyOptions = [
  "pédopsychiatres",
  "neuropédiates",
  "pédiatres",
  "psychomotriciens",
  "ergothérapeutes",
  "psychologues",
  "orthophonistes",
  "Orl",
] as const;

// Base schema with common fields
const BaseSignUpSchema = z.object({
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
});

const DoctorFields = z.object({
  specialty: z.enum(specialtyOptions, {
    required_error: "La spécialité est requise",
    invalid_type_error: "Veuillez sélectionner une spécialité valide",
  }),
  location: z.string().min(1, "La localisation est requise"),
  yearsOfExperience: z
    .number({
      required_error: "Les années d'expérience sont requises",
      invalid_type_error:
        "Les années d'expérience doivent être un nombre valide",
    })
    .min(0, "Les années d'expérience ne peuvent pas être négatives"),
  nationalIdCard: z
    .string({ required_error: "La carte d'identité est requise" })
    .min(1, "La carte d'identité est requise")
    .regex(
      /^\d{18}$/,
      "La carte d'identité doit contenir exactement 18 chiffres"
    ),
  licenseFileUrl: z
    .string({ required_error: "L'URL de la licence est requise" })
    .min(1, "L'URL de la licence est requise")
    .url("Veuillez entrer une URL valide pour la licence"),
  availabilityTimes: z
    .string({ required_error: "Les heures de disponibilité sont requises" })
    .min(1, "Les heures de disponibilité sont requises")
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)$/,
      "Les heures doivent être au format HH:MM - HH:MM (ex: 08:00 - 17:30)"
    ),
  consultationFee: z
    .number({
      required_error: "Les frais de consultation sont requis",
      invalid_type_error:
        "Les frais de consultation doivent être un nombre valide",
    })
    .min(0, "Les frais de consultation ne peuvent pas être négatifs"),
  education: z
    .string({ required_error: "L'éducation est requise" })
    .min(1, "L'éducation est requise"),
});

// Patient-specific fields - all required
const PatientFields = z.object({
  address: z
    .string({ required_error: "L'adresse est requise" })
    .min(1, "L'adresse est requise"),
  preferredTime: z.enum(["morning", "afternoon", "evening", "night"], {
    required_error: "L'heure préférée est requise",
    invalid_type_error: "Veuillez sélectionner une heure préférée valide",
  }),
  emergencyContact: z
    .string({ required_error: "Le contact d'urgence est requis" })
    .min(1, "Le contact d'urgence est requis")
    .refine(
      (value) => /^(\+213)\d{9}$/.test(value ?? ""),
      "Le contact d'urgence doit être au format +213 suivi de 9 chiffres"
    ),
  medicalConditions: z
    .string({ required_error: "Les conditions médicales sont requises" })
    .min(
      1,
      "Les conditions médicales sont requises (écrivez 'Aucune' si vous n'en avez pas)"
    ),
});

// Complete schema that includes all fields (for server-side use)
export const SignUpSchema = BaseSignUpSchema.extend({
  // Doctor fields (optional in complete schema for flexibility)
  specialty: z.enum(specialtyOptions).optional(),
  location: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  nationalIdCard: z.string().optional(),
  licenseFileUrl: z.string().url().optional().or(z.literal("")),
  availabilityTimes: z.string().optional(),
  consultationFee: z.number().optional(),
  education: z.string().optional(),

  // Patient fields (optional in complete schema for flexibility)
  address: z.string().optional(),
  preferredTime: z
    .enum(["morning", "afternoon", "evening", "night"])
    .optional(),
  emergencyContact: z.string().optional(),
  medicalConditions: z.string().optional(),
});

// Form-specific schemas with required fields
export const DoctorFormSchema = BaseSignUpSchema.extend(DoctorFields.shape);
export const PatientFormSchema = BaseSignUpSchema.extend(PatientFields.shape);

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type DoctorFormSchemaType = z.infer<typeof DoctorFormSchema>;
export type PatientFormSchemaType = z.infer<typeof PatientFormSchema>;

export type Roles = "patient" | "doctor" | "admin";
