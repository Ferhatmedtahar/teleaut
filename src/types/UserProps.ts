import { roles } from "./roles.enum";

export type UserProps = {
  id: string;
  first_name: string;
  last_name?: string;
  role: roles;
  bio: string | null;
  background_url: string;
  profile_url: string;
};

export type DoctorProps = UserProps & {
  specialty: string;
  location: string;
  years_of_experience: number;
  consultation_fee: number;
  education: string;
  availability_times: string;
  verification_status?: string;
  license_file_url?: string;
  national_id_card?: string;
};

export type PatientProps = UserProps & {
  address?: string | null;
  medical_conditions?: string | null;
  emergency_contact?: string | null;
  preferred_consultation_time?: string | null;
};

export type RelatedVideoUser = {
  id: string;
  first_name: string;
  last_name?: string;
  profile_url: string | null;
};
