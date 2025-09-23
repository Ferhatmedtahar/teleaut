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
  //review
  speciality?: string;
}
