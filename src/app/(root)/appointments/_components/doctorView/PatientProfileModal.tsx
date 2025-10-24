"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Clock, Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";

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

interface PatientProfileModalProps {
  patient: Patient;
  onClose: () => void;
}

export default function PatientProfileModal({
  patient,
  onClose,
}: PatientProfileModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profil du Patient</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              {patient.profile_url ? (
                <Image
                  width={100}
                  height={100}
                  src={patient.profile_url || "/images/profile.png"}
                  alt={`${patient.first_name} ${patient.last_name}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {patient.first_name} {patient.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Informations de contact</h4>

            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a
                href={`mailto:${patient.email}`}
                className="text-primary hover:underline"
              >
                {patient.email}
              </a>
            </div>

            {patient.phone_number && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`tel:${patient.phone_number}`}
                  className="text-primary hover:underline"
                >
                  {patient.phone_number}
                </a>
              </div>
            )}

            {patient.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span>{patient.address}</span>
              </div>
            )}
          </div>

          {/* Medical Information */}
          {patient.medical_conditions && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">
                  Informations médicales
                </h4>
                <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-destructive font-medium mb-1">
                      Conditions médicales
                    </p>
                    <p className="text-sm">{patient.medical_conditions}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Additional Information */}
          {(patient.emergency_contact ||
            patient.preferred_consultation_time) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">
                  Informations supplémentaires
                </h4>

                {patient.emergency_contact && (
                  <div className="flex items-start gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Contact d'urgence
                      </p>
                      <p>{patient.emergency_contact}</p>
                    </div>
                  </div>
                )}

                {patient.preferred_consultation_time && (
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Horaire préféré
                      </p>
                      <p>{patient.preferred_consultation_time}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
