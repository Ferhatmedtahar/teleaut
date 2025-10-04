import { z } from "zod";

export const medicalNoteContentSchema = z.object({
  diagnosis: z.string().optional(),
  symptoms: z.string().optional(),
  treatment: z.string().optional(),
  medications: z
    .array(
      z.object({
        name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
        duration: z.string().optional(),
      })
    )
    .optional(),
  tests_ordered: z.array(z.string()).optional(),
  follow_up_instructions: z.string().optional(),
  additional_notes: z.string().optional(),
});

export const createMedicalNoteSchema = z.object({
  patient_id: z.string().uuid({ message: "ID patient invalide" }),
  appointment_id: z.string().uuid().optional().nullable(),
  content: medicalNoteContentSchema,
});

export const updateMedicalNoteSchema = z.object({
  id: z.string().uuid({ message: "ID note invalide" }),
  content: medicalNoteContentSchema,
});

export type MedicalNoteContent = z.infer<typeof medicalNoteContentSchema>;
export type CreateMedicalNoteInput = z.infer<typeof createMedicalNoteSchema>;
export type UpdateMedicalNoteInput = z.infer<typeof updateMedicalNoteSchema>;
