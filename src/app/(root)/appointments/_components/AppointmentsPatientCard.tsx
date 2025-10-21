"use client";

import {
  deleteAppointment,
  updateAppointment,
} from "@/actions/appointments/updateDeleteAppointment.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Calendar,
  Edit,
  MoreVertical,
  Trash2,
  User,
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

interface Doctor {
  first_name: string;
  last_name: string;
  specialization?: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  status: AppointmentStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
  doctor: Doctor;
}

interface AppointmentsPatientCardProps {
  appointment: Appointment;
}

function AppointmentsPatientCard({
  appointment,
}: AppointmentsPatientCardProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editNote, setEditNote] = useState(appointment.note || "");
  const [editDate, setEditDate] = useState(appointment.appointment_date);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusColor = (status: AppointmentStatus): string => {
    const colors: Record<AppointmentStatus, string> = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      confirmed:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      rejected: "bg-destructive/10 text-destructive",
      rescheduled: "bg-primary/10 text-primary",
      completed: "bg-muted text-muted-foreground",
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status: AppointmentStatus): string => {
    const texts: Record<AppointmentStatus, string> = {
      pending: "En attente",
      confirmed: "Confirmé",
      rejected: "Rejeté",
      rescheduled: "Reprogrammé",
      completed: "Terminé",
    };
    return texts[status] || status;
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

  const handleUpdateAppointment = async () => {
    setIsSubmitting(true);

    try {
      const result = await updateAppointment({
        id: appointment.id,
        note: editNote,
        appointment_date: editDate,
      });

      if (result.success) {
        toast.success(result.message || "Rendez-vous mis à jour avec succès");
        setShowEditModal(false);
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

  const handleDeleteAppointment = async () => {
    setIsSubmitting(true);

    try {
      const result = await deleteAppointment(appointment.id);

      if (result.success) {
        toast.success(result.message || "Rendez-vous supprimé avec succès");
        setShowDeleteModal(false);
        router.refresh();
      } else {
        toast.error(result.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-2">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {appointment.doctor.first_name}{" "}
                    {appointment.doctor.last_name}
                  </h3>
                  {appointment.doctor.specialization && (
                    <p className="text-sm text-muted-foreground">
                      {appointment.doctor.specialization}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(appointment.appointment_date)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getStatusColor(appointment.status)}
                  >
                    {getStatusText(appointment.status)}
                  </Badge>
                </div>

                {appointment.note && (
                  <div className="flex items-start gap-2 text-foreground bg-background border p-3 rounded-md">
                    <AlertCircle className="w-5 h-5 text-muted-foreground dark:text-muted/80 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground  dark:text-muted/80 mb-1">
                        Note
                      </p>
                      <p className="text-sm">{appointment.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-5 h-5" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteModal(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le rendez-vous</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date du rendez-vous</Label>
              <Input
                id="edit-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                min={
                  new Date(Date.now() + 86400000).toISOString().split("T")[0]
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-note">Note (optionnelle)</Label>
              <Textarea
                id="edit-note"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={4}
                placeholder="Raison de la visite ou notes supplémentaires..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button onClick={handleUpdateAppointment} disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <DialogTitle>Supprimer le rendez-vous</DialogTitle>
            </div>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rendez-vous avec{" "}
              {appointment.doctor.first_name} {appointment.doctor.last_name} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAppointment}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AppointmentsPatientCard;
