import { educationMapping } from "../constants/EducationsMapping";
import { subjectToSpecialty } from "../constants/specialties";

export function getApplicableSubjects(
  studentClass: string,
  studentBranch?: string
) {
  const classData = educationMapping[studentClass];
  if (!classData) return [];

  if (studentBranch && classData[studentBranch]) {
    return classData[studentBranch];
  }
  // console.log(classData["_default"]);
  return classData["_default"] ?? [];
}
/**
 * Get teacher specialties applicable for given subjects
 */
export function getApplicableSpecialties(subjects: string[]): string[] {
  return subjects
    .map((subject) => subjectToSpecialty[subject])
    .filter((specialty) => specialty !== undefined);
}
