"use client";

import { getPatientNotes } from "@/actions/medical-notes/getMedicalNotebyPatient.action";
import { Button } from "@/components/ui/button";
import { Loader2, Notebook, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MedicalNoteCard from "../../../medical-notes/_components/MedicalNoteCard";

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

interface PatientMedicalNotesProps {
  patientId: string;
}

export default function PatientMedicalNotes({
  patientId,
}: PatientMedicalNotesProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<MedicalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotes() {
      try {
        setLoading(true);
        const result = await getPatientNotes(patientId);
        if (result.success) {
          setNotes(
            result.data?.map((data) => ({
              id: data.id,
              doctor_id: data.doctor_id,
              patient_id: data.patient_id,
              appointment_id: data.appointment_id,
              content: data.content,
              created_at: data.created_at,
              doctor: {
                id: data.doctor[0].id,
                first_name: data.doctor[0].first_name,
                last_name: data.doctor[0].last_name,
                specialty: data.doctor[0].specialty,
              },
              appointment: {
                id: data.appointment[0].id,
                appointment_date: data.appointment[0].appointment_date,
                status: data.appointment[0].status,
              },
            })) || []
          );
        } else {
          setError("Impossible de charger les notes médicales");
        }
      } catch (err) {
        setError("Une erreur s'est produite");
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.length === 0 ? (
        <div className="text-center py-12 border border-border/20 dark:border-border/60 rounded-md">
          <div className="w-16 h-16 bg-muted dark:bg-background dark:border rounded-full flex items-center justify-center mx-auto mb-4">
            <Notebook className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucune note médicale</h3>
          <p className="text-muted-foreground mb-4">
            Ce patient n&apos;a pas encore de notes médicales
          </p>
          <Button
            onClick={() =>
              router.push(`/medical-notes/new?patientId=${patientId}`)
            }
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {notes.map((note) => (
            <MedicalNoteCard key={note.id} note={note} isDoctor={true} />
          ))}
        </div>
      )}
    </div>
  );
}
