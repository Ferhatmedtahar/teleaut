export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  verification_status: string;
  phone_number: string;
  location: string;
  education: string;
  license_file_url: string;
  created_at: string;
  specialty?: string;
  years_of_experience: number;
  consultation_fee: number;
  availability_times: string;
  national_id_card?: string;
  profile_url?: string; // Add this line
}
