import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
