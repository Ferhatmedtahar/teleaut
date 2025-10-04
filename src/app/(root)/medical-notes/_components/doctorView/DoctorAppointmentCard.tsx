"use client";

import { updateDoctorAppointment } from "@/actions/appointments/doctor/doctor.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  FileText,
  Mail,
  MoreVertical,
  Phone,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "rescheduled"
  | "completed";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  profile_url: string | null;
  address: string | null;
  medical_conditions: string | null;
  emergency_contact: string | null;
  preferred_consultation_time: string | null;
}

interface DoctorAppointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  status: AppointmentStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
  patient: Patient;
}

interface DoctorAppointmentCardProps {
  appointment: DoctorAppointment;
  onViewPatient: (patient: Patient) => void;
}

function DoctorAppointmentCard({
  appointment,
  onViewPatient,
}: DoctorAppointmentCardProps) {
  const router = useRouter();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newDate, setNewDate] = useState(appointment.appointment_date);
  const [doctorNote, setDoctorNote] = useState(appointment.note || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusVariant = (
    status: AppointmentStatus
  ): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<
      AppointmentStatus,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      confirmed: "default",
      rejected: "destructive",
      rescheduled: "outline",
      completed: "secondary",
    };
    return variants[status];
  };

  const getStatusText = (status: AppointmentStatus): string => {
    const texts: Record<AppointmentStatus, string> = {
      pending: "En attente",
      confirmed: "Confirmé",
      rejected: "Rejeté",
      rescheduled: "Reprogrammé",
      completed: "Terminé",
    };
    return texts[status];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    setIsSubmitting(true);

    try {
      const result = await updateDoctorAppointment({
        id: appointment.id,
        status: newStatus,
      });

      if (result.success) {
        toast.success(result.message || "Statut mis à jour");
        router.refresh();
      } else {
        toast.error(result.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReschedule = async () => {
    setIsSubmitting(true);

    try {
      const result = await updateDoctorAppointment({
        id: appointment.id,
        appointment_date: newDate,
        status: "rescheduled",
      });

      if (result.success) {
        toast.success(result.message || "Rendez-vous reprogrammé");
        setShowRescheduleModal(false);
        router.refresh();
      } else {
        toast.error(result.message || "Erreur lors de la reprogrammation");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNote = async () => {
    setIsSubmitting(true);

    try {
      const result = await updateDoctorAppointment({
        id: appointment.id,
        note: doctorNote,
      });

      if (result.success) {
        toast.success(result.message || "Note mise à jour");
        setShowNoteModal(false);
        router.refresh();
      } else {
        toast.error(result.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="p-6 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="flex justify-between items-start h-full">
          <div className="flex-1 flex flex-col">
            {/* Patient Info */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                {appointment?.patient?.profile_url ? (
                  <img
                    src={appointment.patient.profile_url || "/placeholder.svg"}
                    alt={`${appointment.patient.first_name} ${appointment.patient.last_name}`}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <button
                  onClick={() => onViewPatient(appointment.patient)}
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  {appointment.patient.first_name}{" "}
                  {appointment.patient.last_name}
                </button>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  {appointment.patient.phone_number && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${appointment.patient.phone_number}`}
                        className="hover:text-primary"
                      >
                        {appointment.patient.phone_number}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${appointment.patient.email}`}
                      className="hover:text-primary"
                    >
                      {appointment.patient.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {formatDate(appointment.appointment_date)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(appointment.status)}>
                  {getStatusText(appointment.status)}
                </Badge>
              </div>

              {appointment.patient.medical_conditions && (
                <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-destructive font-medium mb-1">
                      Conditions médicales
                    </p>
                    <p className="text-sm text-destructive/90">
                      {appointment.patient.medical_conditions}
                    </p>
                  </div>
                </div>
              )}

              {appointment.note && (
                <div className="flex items-start gap-2 bg-muted p-3 rounded-md">
                  <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Note</p>
                    <p className="text-sm">{appointment.note}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isSubmitting}>
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => onViewPatient(appointment.patient)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir le profil patient
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setShowRescheduleModal(true)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reprogrammer
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setShowNoteModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier la note
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {appointment.status !== "confirmed" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("confirmed")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmer
                </DropdownMenuItem>
              )}

              {appointment.status !== "completed" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("completed")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marquer comme terminé
                </DropdownMenuItem>
              )}

              {appointment.status !== "rejected" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("rejected")}
                  className="text-destructive focus:text-destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeter
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprogrammer le rendez-vous</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Date actuelle:
              </p>
              <p className="font-medium">
                {formatDate(appointment.appointment_date)}
              </p>
            </div>

            <div>
              <Label htmlFor="new-date">Nouvelle date</Label>
              <Input
                id="new-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRescheduleModal(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button onClick={handleReschedule} disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : "Reprogrammer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la note</DialogTitle>
          </DialogHeader>

          <div>
            <Label htmlFor="doctor-note">Note du rendez-vous</Label>
            <Textarea
              id="doctor-note"
              value={doctorNote}
              onChange={(e) => setDoctorNote(e.target.value)}
              rows={6}
              placeholder="Ajoutez des notes sur ce rendez-vous..."
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNoteModal(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button onClick={handleUpdateNote} disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DoctorAppointmentCard;
