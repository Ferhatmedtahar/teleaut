"use client";
import { Button } from "@/components/common/buttons/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createAppointment } from "@/actions/appointments/createAppointment.action";
import { DatePicker } from "@/components/common/DatePicker";
import { Doctor } from "@/types/entities/Doctor.interface";
import DoctorCardAppForm from "../DoctorCardAppForm";
import { appointmentSchema, AppointmentSchemaType } from "./AppointmentSchema";

export default function AppointmentForm({
  patientId,
  doctor,
}: {
  readonly patientId: string;
  readonly doctor: Doctor;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentSchemaType>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      appointment_date: "",
      note: "",
    },
  });

  async function onSubmit(data: AppointmentSchemaType) {
    if (!data.appointment_date) {
      toast.error("Veuillez choisir une date");
      return;
    }

    try {
      const loadingToastId = toast.loading("Création du rendez-vous...");

      const result = await createAppointment({
        patient_id: patientId,
        doctor_id: doctor.id,
        appointment_date: data.appointment_date,
        note: data.note || null,
      });

      toast.dismiss(loadingToastId);

      if (result.success) {
        toast.success("Rendez-vous créé avec succès!");
        reset();
        router.push(`/appointments`);
      } else {
        toast.error(
          result.message || "Erreur lors de la création du rendez-vous"
        );
      }
    } catch (err) {
      console.error("Appointment creation error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de la création du rendez-vous"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-blue-100 dark:border-gray-600">
        <div className="p-6 flex flex-col items-center justify-center">
          <Calendar className="w-16 h-16 mb-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Prendre un rendez-vous
          </h3>
          <p className="text-sm text-center mb-4 max-w-md text-gray-600 dark:text-gray-300">
            Sélectionnez une date pour votre rendez-vous avec <br />
            <span className="font-medium">
              Dr. {doctor?.first_name} {doctor?.last_name}
            </span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold my-4 text-gray-900 dark:text-white">
        Détails du rendez-vous
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Selected Doctor Display */}
          <div>
            <Label className="block text-sm font-medium mb-1">
              Médecin sélectionné
            </Label>
            <DoctorCardAppForm doctor={doctor} />
          </div>

          {/* Appointment Date */}
          <div>
            <Label className="block text-sm font-medium mb-2">
              Date du rendez-vous <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="appointment_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Choisir une date de rendez-vous"
                  error={!!errors.appointment_date}
                />
              )}
            />
            {errors.appointment_date && (
              <p className="mt-1 text-sm text-red-500">
                {errors.appointment_date.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Note/Reason */}
          <div>
            <Label htmlFor="note" className="block text-sm font-medium mb-1">
              Motif du rendez-vous
              <span className="text-gray-500 text-xs"> (optionnel)</span>
            </Label>
            <Textarea
              id="note"
              {...register("note")}
              placeholder="Décrivez la raison de votre visite, vos symptômes ou toute information importante pour le médecin..."
              className="w-full min-h-[120px] dark:placeholder:text-gray-400"
            />
            {errors.note && (
              <p className="mt-1 text-sm text-red-500">{errors.note.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full md:w-auto lg:w-1/4 xl:h-10 flex items-center justify-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span>Créer le rendez-vous</span>
          </>
        )}
      </Button>
    </form>
  );
}
