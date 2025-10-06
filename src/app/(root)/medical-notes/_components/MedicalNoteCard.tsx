"use client";

import { deleteMedicalNote } from "@/actions/medical-notes/deleteMedicalNote.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  Calendar,
  Edit,
  FileText,
  MoreVertical,
  Pill,
  Stethoscope,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface MedicalNote {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_id: string | null;
  content: {
    diagnosis?: string;
    symptoms?: string;
    treatment?: string;
    medications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration?: string;
    }>;
    tests_ordered?: string[];
    follow_up_instructions?: string;
    additional_notes?: string;
  };
  created_at: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  doctor?: {
    id: string;
    first_name: string;
    last_name: string;
    specialty?: string;
  };
  appointment?: {
    id: string;
    appointment_date: string;
    status: string;
  };
}

interface MedicalNoteCardProps {
  note: MedicalNote;
  isDoctor: boolean;
}

export default function MedicalNoteCard({
  note,
  isDoctor,
}: MedicalNoteCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteMedicalNote(note.id);

      if (result.success) {
        toast.success(result.message);
        setShowDeleteModal(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const displayPerson = isDoctor ? note.patient : note.doctor;

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3" onClick={() => setShowDetailsModal(true)}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                {isDoctor ? (
                  <User className="w-5 h-5 text-primary" />
                ) : (
                  <Stethoscope className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {displayPerson?.first_name} {displayPerson?.last_name}
                </h3>
                {isDoctor ? (
                  <p className="text-xs text-muted-foreground truncate">
                    {note.patient?.email}
                  </p>
                ) : (
                  note.doctor?.specialty && (
                    <p className="text-xs text-muted-foreground truncate">
                      {note.doctor.specialty}
                    </p>
                  )
                )}
              </div>
            </div>

            {isDoctor && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/medical-notes/edit/${note.id}`);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(true);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent
          className="space-y-3"
          onClick={() => setShowDetailsModal(true)}
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(note.created_at)}</span>
          </div>

          {note.appointment && (
            <Badge variant="secondary" className="text-xs">
              Rendez-vous: {formatDate(note.appointment.appointment_date)}
            </Badge>
          )}

          {note.content.diagnosis && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium">
                <FileText className="w-4 h-4" />
                Diagnostic
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {note.content.diagnosis}
              </p>
            </div>
          )}

          {note.content.medications && note.content.medications.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <Pill className="w-4 h-4" />
              <span className="text-muted-foreground">
                {note.content.medications.length} médicament(s)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la note médicale</DialogTitle>
            <DialogDescription>
              Créée le {formatDate(note.created_at)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {isDoctor ? (
                  <User className="w-6 h-6 text-primary" />
                ) : (
                  <Stethoscope className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <p className="font-semibold">
                  {displayPerson?.first_name} {displayPerson?.last_name}
                </p>
                {isDoctor ? (
                  <p className="text-sm text-muted-foreground">
                    {note.patient?.email}
                  </p>
                ) : (
                  note.doctor?.specialty && (
                    <p className="text-sm text-muted-foreground">
                      {note.doctor.specialty}
                    </p>
                  )
                )}
              </div>
            </div>

            {note.content.symptoms && (
              <div>
                <h4 className="font-semibold mb-2">Symptômes</h4>
                <p className="text-sm text-muted-foreground">
                  {note.content.symptoms}
                </p>
              </div>
            )}

            {note.content.diagnosis && (
              <div>
                <h4 className="font-semibold mb-2">Diagnostic</h4>
                <p className="text-sm text-muted-foreground">
                  {note.content.diagnosis}
                </p>
              </div>
            )}

            {note.content.treatment && (
              <div>
                <h4 className="font-semibold mb-2">Traitement</h4>
                <p className="text-sm text-muted-foreground">
                  {note.content.treatment}
                </p>
              </div>
            )}

            {note.content.medications &&
              note.content.medications.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Médicaments prescrits</h4>
                  <div className="space-y-3">
                    {note.content.medications.map((med, index) => (
                      <div
                        key={index}
                        className="p-3 bg-muted rounded-lg space-y-1"
                      >
                        <p className="font-medium text-sm">{med.name}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Dosage:</span>{" "}
                            {med.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Fréquence:</span>{" "}
                            {med.frequency}
                          </div>
                          {med.duration && (
                            <div className="col-span-2">
                              <span className="font-medium">Durée:</span>{" "}
                              {med.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {note.content.tests_ordered &&
              note.content.tests_ordered.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Examens prescrits</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {note.content.tests_ordered.map((test, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {note.content.follow_up_instructions && (
              <div>
                <h4 className="font-semibold mb-2">Instructions de suivi</h4>
                <p className="text-sm text-muted-foreground">
                  {note.content.follow_up_instructions}
                </p>
              </div>
            )}

            {note.content.additional_notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes additionnelles</h4>
                <p className="text-sm text-muted-foreground">
                  {note.content.additional_notes}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            {isDoctor && (
              <Button
                onClick={() => {
                  setShowDetailsModal(false);
                  router.push(`/medical-notes/edit/${note.id}`);
                }}
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
            <Button onClick={() => setShowDetailsModal(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <DialogTitle>Supprimer la note médicale</DialogTitle>
            </div>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette note médicale pour{" "}
              {note.patient?.first_name} {note.patient?.last_name}? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
