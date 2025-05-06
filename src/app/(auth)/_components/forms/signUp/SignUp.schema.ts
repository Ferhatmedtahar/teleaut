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
      "Invalid phone number"
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

  //teacher
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
  // specialty: z.string().optional(),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export type Roles = "teacher" | "student";

//* for students removed  residence: z.string().min(3, "Residence must be at least 3 characters"),
// .superRefine(
//   (
//     { password, repeatPassword, role, diplomeFile, identityFile, specialty },
//     ctx
//   ) => {
//     if (password !== repeatPassword) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Passwords don't match",
//       });
//     }
//     if (role === "teacher") {
//       if (!diplomeFile) {
//         ctx.addIssue({
//           path: ["diplomeFile"],
//           code: "custom",
//           message: "Le fichier du diplôme est requis pour les enseignants",
//         });
//       }
//       if (!identityFile) {
//         ctx.addIssue({
//           path: ["identityFile"],
//           code: "custom",
//           message:
//             "La photo de la carte d'identité est requise pour les enseignants",
//         });
//       }
//       if (!specialty) {
//         ctx.addIssue({
//           path: ["specialty"],
//           code: "custom",
//           message: "La spécialité est requise pour les enseignants",
//         });
//       }
//     }
//   }
// );
