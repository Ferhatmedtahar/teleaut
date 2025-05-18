import { educationMapping } from "../constants/EducationsMapping";
import { subjectToSpecialty } from "../constants/specialties";

export function getApplicableSubjects(
  studentClass: string,
  studentBranch?: string
): string[] {
  if (!educationMapping[studentClass]) {
    return [];
  }

  // If branch is provided and exists in the mapping, use it; otherwise use default
  if (studentBranch && educationMapping[studentClass][studentBranch]) {
    return educationMapping[studentClass][studentBranch];
  } else if (educationMapping[studentClass]["_default"]) {
    return educationMapping[studentClass]["_default"];
  }

  return [];
}

/**
 * Get teacher specialties applicable for given subjects
 */
export function getApplicableSpecialties(subjects: string[]): string[] {
  return subjects
    .map((subject) => subjectToSpecialty[subject])
    .filter((specialty) => specialty !== undefined);
}
