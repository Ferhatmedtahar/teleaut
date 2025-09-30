import { z } from "zod";

export const appointmentSchema = z.object({
  appointment_date: z
    .string()
    .min(1, "La date du rendez-vous est requise")
    .refine((date) => {
      const selectedDate = new Date(date);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return selectedDate >= tomorrow;
    }, "La date doit être au minimum demain"),
  note: z.string().optional(),
});

export type AppointmentSchemaType = z.infer<typeof appointmentSchema>;
