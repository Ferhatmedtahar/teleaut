import { subjectToSpecialty } from "../constants/specialties";

export function extractSubjectFromSpecialty(specialty: string): string {
  // Check if we have a direct mapping
  if (specialtyToSubject[specialty]) {
    return specialtyToSubject[specialty];
  }

  // Otherwise try to extract using regex
  const deMatch = specialty.match(/Professeur de (.*)/i);
  if (deMatch && deMatch[1]) {
    return deMatch[1];
  }

  const dMatch = specialty.match(/Professeur d['\u2019](.*)/i);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }

  // If no match, return the original specialty
  return specialty;
}

const specialtyToSubject = Object.entries(subjectToSpecialty).reduce(
  (acc, [subject, specialty]) => {
    acc[specialty] = subject;
    return acc;
  },
  {} as Record<string, string>
);
