"use client";

import {
  createMedicalNote,
  updateMedicalNote,
} from "@/actions/medical-notes/createMedicalNote.action";
import { getDoctorPatients } from "@/actions/medical-notes/getDoctorPatients.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  status: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
  }[];
}

interface MedicalNoteFormProps {
  patients?: Patient[];
  appointments?: Appointment[];
  initialData?: {
    id?: string;
    patient_id?: string;
    appointment_id?: string | null;
    content: {
      diagnosis?: string;
      symptoms?: string;
      treatment?: string;
      medications?: Medication[];
      tests_ordered?: string[];
      follow_up_instructions?: string;
      additional_notes?: string;
    };
  };
  isEdit?: boolean;
}

export default function MedicalNoteForm({
  patients: initialPatients,
  appointments: initialAppointments,
  initialData,
  isEdit = false,
}: MedicalNoteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(initialPatients || []);
  const [selectedPatientId, setSelectedPatientId] = useState(
    initialData?.patient_id || ""
  );
  const [appointmentId, setAppointmentId] = useState<string>(
    initialData?.appointment_id || ""
  );

  const [diagnosis, setDiagnosis] = useState(
    initialData?.content?.diagnosis || ""
  );
  const [symptoms, setSymptoms] = useState(
    initialData?.content?.symptoms || ""
  );
  const [treatment, setTreatment] = useState(
    initialData?.content?.treatment || ""
  );
  const [medications, setMedications] = useState<Medication[]>(
    initialData?.content?.medications || []
  );
  const [testsOrdered, setTestsOrdered] = useState<string[]>(
    initialData?.content?.tests_ordered || []
  );
  const [newTest, setNewTest] = useState("");
  const [followUpInstructions, setFollowUpInstructions] = useState(
    initialData?.content?.follow_up_instructions || ""
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    initialData?.content?.additional_notes || ""
  );

  useEffect(() => {
    if (!initialPatients) {
      loadPatients();
    }
  }, []);

  const loadPatients = async () => {
    const result = await getDoctorPatients();
    if (result.success && result.data) {
      setPatients(result.data);
    }
  };

  // Filter appointments for the selected patient
  const patientAppointments = useMemo(() => {
    if (!selectedPatientId || !initialAppointments) {
      return [];
    }
    return initialAppointments.filter(
      (app) => app.patient_id === selectedPatientId
    );
  }, [selectedPatientId, initialAppointments]);

  // Reset appointment selection when patient changes
  useEffect(() => {
    if (!isEdit && selectedPatientId) {
      setAppointmentId("");
    }
  }, [selectedPatientId, isEdit]);

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addTest = () => {
    if (newTest.trim()) {
      setTestsOrdered([...testsOrdered, newTest.trim()]);
      setNewTest("");
    }
  };

  const removeTest = (index: number) => {
    setTestsOrdered(testsOrdered.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatientId && !isEdit) {
      toast.error("Veuillez sélectionner un patient");
      return;
    }

    setIsLoading(true);

    const content = {
      diagnosis: diagnosis.trim() || undefined,
      symptoms: symptoms.trim() || undefined,
      treatment: treatment.trim() || undefined,
      medications:
        medications.filter((m) => m.name.trim()).length > 0
          ? medications.filter((m) => m.name.trim())
          : undefined,
      tests_ordered: testsOrdered.length > 0 ? testsOrdered : undefined,
      follow_up_instructions: followUpInstructions.trim() || undefined,
      additional_notes: additionalNotes.trim() || undefined,
    };

    try {
      let result;

      if (isEdit && initialData?.id) {
        result = await updateMedicalNote({
          id: initialData.id,
          content,
        });
      } else {
        result = await createMedicalNote({
          patient_id: selectedPatientId,
          appointment_id: appointmentId || null,
          content,
        });
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/medical-notes");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isEdit && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Informations du patient
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="patient">Patient *</Label>
              <Select
                value={selectedPatientId}
                onValueChange={setSelectedPatientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPatientId && patientAppointments.length > 0 && (
              <div>
                <Label htmlFor="appointment">Rendez-vous (optionnel)</Label>
                <div className="space-y-2">
                  <Select
                    value={appointmentId || undefined}
                    onValueChange={(value) => setAppointmentId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Lier à un rendez-vous" />
                    </SelectTrigger>
                    <SelectContent>
                      {patientAppointments.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {new Date(app.appointment_date).toLocaleDateString(
                            "fr-FR",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}{" "}
                          - {app.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {appointmentId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAppointmentId("")}
                    >
                      Retirer le lien au rendez-vous
                    </Button>
                  )}
                </div>
              </div>
            )}

            {selectedPatientId && patientAppointments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ce patient n'a pas de rendez-vous confirmés ou complétés.
              </p>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Diagnostic et Symptômes</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="symptoms">Symptômes</Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Décrivez les symptômes du patient..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="diagnosis">Diagnostic</Label>
            <Textarea
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Votre diagnostic..."
              rows={4}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Traitement</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="treatment">Plan de traitement</Label>
            <Textarea
              id="treatment"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="Décrivez le plan de traitement..."
              rows={4}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Médicaments prescrits</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addMedication}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>

            {medications.map((med, index) => (
              <Card key={index} className="p-4 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Nom du médicament</Label>
                    <Input
                      value={med.name}
                      onChange={(e) =>
                        updateMedication(index, "name", e.target.value)
                      }
                      placeholder="Ex: Paracétamol"
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      value={med.dosage}
                      onChange={(e) =>
                        updateMedication(index, "dosage", e.target.value)
                      }
                      placeholder="Ex: 500mg"
                    />
                  </div>
                  <div>
                    <Label>Fréquence</Label>
                    <Input
                      value={med.frequency}
                      onChange={(e) =>
                        updateMedication(index, "frequency", e.target.value)
                      }
                      placeholder="Ex: 3 fois par jour"
                    />
                  </div>
                  <div>
                    <Label>Durée</Label>
                    <Input
                      value={med.duration}
                      onChange={(e) =>
                        updateMedication(index, "duration", e.target.value)
                      }
                      placeholder="Ex: 7 jours"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeMedication(index)}
                  className="mt-3"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Examens et Suivi</h2>

        <div className="space-y-4">
          <div>
            <Label>Examens prescrits</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTest}
                onChange={(e) => setNewTest(e.target.value)}
                placeholder="Ex: Analyse de sang"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTest())
                }
              />
              <Button type="button" onClick={addTest} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {testsOrdered.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted p-2 rounded"
                >
                  <span>{test}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeTest(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="followUp">Instructions de suivi</Label>
            <Textarea
              id="followUp"
              value={followUpInstructions}
              onChange={(e) => setFollowUpInstructions(e.target.value)}
              placeholder="Instructions pour le suivi du patient..."
              rows={4}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Notes additionnelles</h2>
        <Textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Autres notes ou observations..."
          rows={4}
        />
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEdit ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? "Mettre à jour" : "Créer la note"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
