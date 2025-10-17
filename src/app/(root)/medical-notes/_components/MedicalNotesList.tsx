"use client";

import { Button } from "@/components/ui/button";
import { Notebook, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import MedicalNoteCard from "./MedicalNoteCard";

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

interface MedicalNotesListProps {
  notes: MedicalNote[];
  isDoctor: boolean;
}

export default function MedicalNotesList({
  notes,
  isDoctor,
}: MedicalNotesListProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {isDoctor && (
        <div className="flex justify-end">
          <Button
            onClick={() => router.push("/medical-notes/new")}
            className="gap-2"
          >
            <Notebook className="w-4 h-4" />
            Créer une note médicale
          </Button>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted dark:bg-background dark:border rounded-full flex items-center justify-center mx-auto mb-4">
            <Notebook className="w-8 h-8 text-muted-foreground " />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucune note médicale</h3>
          <p className="text-muted-foreground mb-4">
            {isDoctor
              ? "Commencez par créer votre première note médicale"
              : "Vous n'avez pas encore de notes médicales"}
          </p>
          {isDoctor && (
            <Button
              onClick={() => router.push("/medical-notes/new")}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer une note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <MedicalNoteCard key={note.id} note={note} isDoctor={isDoctor} />
          ))}
        </div>
      )}
    </div>
  );
}
