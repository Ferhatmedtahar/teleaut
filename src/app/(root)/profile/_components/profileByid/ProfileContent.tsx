import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { roles } from "@/types/roles.enum";
import { User } from "@/types/User";
import { DoctorProps } from "@/types/UserProps";
import {
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  MapPin,
  Notebook,
} from "lucide-react";
import Image from "next/image";
import ErrorProfile from "../ErrorProfile";
import ChatButton from "./ContactButton";
import PatientMedicalNotes from "./PatientMedicalNotes";

export default function ProfileContent({
  user,
  currentUser,
}: {
  readonly user: DoctorProps;
  readonly currentUser: User;
}) {
  if (!currentUser?.id || !currentUser?.role) return <ErrorProfile />;

  const firstName = user?.first_name ?? "User";
  const lastName = user?.last_name ?? "";
  const role = user?.role ?? "student";
  const specialty = user?.specialty;
  const location = user?.location;
  const yearsOfExperience = user?.years_of_experience;
  const consultationFee = user?.consultation_fee;
  const education = user?.education;
  const availabilityTimes = user?.availability_times;
  const bio = user?.bio ?? `Hi, i'm ${firstName} ${lastName}.`;
  const profileUrl = user?.profile_url;
  const background_cover = user?.background_url;

  const isOwnProfile = user?.id === currentUser?.id;

  const canChat = !(
    currentUser.role === roles.patient && user.role === roles.patient
  );

  const isDoctor = role === roles.doctor;

  const isDoctorViewingPatient =
    currentUser.role === roles.doctor && role === roles.patient;

  return (
    <div className="w-full p-3">
      <div className="relative mb-6">
        {background_cover ? (
          <div className="relative h-40 w-full rounded-t-lg overflow-hidden">
            <Image
              height={1920}
              width={1080}
              src={background_cover}
              alt={`background cover image for ${firstName} ${lastName}`}
              className="w-full h-50 object-cover rounded-t-lg"
            />
          </div>
        ) : (
          <div className="h-40 w-full rounded-t-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-primary-500 via-secondary-700 to-secondary-400"></div>
          </div>
        )}

        <div className="absolute left-8 -bottom-12">
          <Avatar className="h-24 w-24 border-4 border-white dark:border-border/90">
            <AvatarImage
              src={`${profileUrl}`}
              alt={`${firstName} ${lastName}`}
            />
            <AvatarFallback className="text-2xl">
              {firstName[0]}
              {lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="px-8 pt-10 pb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-xl font-bold">
              {isDoctor ? "Dr. " : ""}
              {firstName} {lastName}
            </h1>

            <div className="flex flex-wrap gap-2">
              {specialty && <Badge className="text-sm">{specialty}</Badge>}
              {location && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {location}
                </Badge>
              )}
              {/* Only show email if viewing own profile */}
              {isOwnProfile && user.email && (
                <Badge variant="outline" className="text-sm">
                  {user.email}
                </Badge>
              )}
            </div>
          </div>
          <p className="dark:text-white text-background text-sm capitalize bg-primary w-fit px-3 py-1 rounded-md">
            {role}
          </p>
        </div>
        {canChat && (
          <div className="mt-4 flex flex-col items-center w-full sm:w-auto sm:flex-row gap-2">
            <ChatButton
              currentUserId={currentUser.id}
              targetUserId={user.id}
              targetUserName={firstName}
            />
          </div>
        )}
        <div className="mt-4 border border-border/20 dark:border-border/60 rounded-md p-4">
          <h2 className="text-sm font-semibold mb-2">À propos</h2>
          <p className="text-sm text-muted-foreground dark:text-white/90">
            {bio}
          </p>
        </div>

        {/* Professional Information Grid - Only for Doctors */}
        {isDoctor && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Experience */}
            {yearsOfExperience !== undefined && (
              <div className="border border-border/20 dark:border-border/60 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Expérience</h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-white/90">
                  {yearsOfExperience} {yearsOfExperience > 1 ? "ans" : "an"}{" "}
                  d&apos;expérience
                </p>
              </div>
            )}

            {/* Consultation Fee */}
            {consultationFee !== undefined && (
              <div className="border border-border/20 dark:border-border/60 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">
                    Tarif de consultation
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-white/90">
                  {consultationFee} DZD
                </p>
              </div>
            )}

            {/* Education */}
            {education && (
              <div className="border border-border/20 dark:border-border/60 rounded-md p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Formation</h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-white/90">
                  {education}
                </p>
              </div>
            )}

            {/* Availability */}
            {availabilityTimes && (
              <div className="border border-border/20 dark:border-border/60 rounded-md p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Disponibilité</h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-white/90">
                  {availabilityTimes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Medical Notes - Only when doctor views patient profile */}
        {isDoctorViewingPatient && user?.id && (
          <div className="mt-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Notebook className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Notes Médicales</h2>
              </div>
              <p className="text-sm text-muted-foreground dark:text-muted/80">
                Historique médical de {firstName} {lastName}
              </p>
            </div>
            <PatientMedicalNotes patientId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
}
