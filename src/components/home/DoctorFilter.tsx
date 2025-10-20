"use client";

import { useState, useMemo } from "react";
import { Filter, SortDesc } from "lucide-react";
import { DoctorProps } from "@/types/UserProps";
import DoctorCard from "./DoctorCard";

interface DoctorsFilterProps {
  doctors: DoctorProps[];
}

export default function DoctorsFilter({ doctors }: DoctorsFilterProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Extract unique specialties from doctors
  const specialties = useMemo(() => {
    const uniqueSpecialties = Array.from(
      new Set(doctors.map((doc) => doc.specialty))
    );
    return uniqueSpecialties.sort();
  }, [doctors]);

  // Filter and sort doctors
  const filteredAndSortedDoctors = useMemo(() => {
    let result = [...doctors];

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      result = result.filter((doc) => doc.specialty === selectedSpecialty);
    }

    // Sort by years of experience
    result.sort((a, b) => {
      const diff = a.years_of_experience - b.years_of_experience;
      return sortOrder === "desc" ? -diff : diff;
    });

    return result;
  }, [doctors, selectedSpecialty, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Toutes les spécialités</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <SortDesc className="w-5 h-5 text-muted-foreground" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="desc">Plus d'expérience</option>
            <option value="asc">Moins d'expérience</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 text-sm text-muted-foreground">
        {filteredAndSortedDoctors.length} médecin
        {filteredAndSortedDoctors.length !== 1 ? "s" : ""} trouvé
        {filteredAndSortedDoctors.length !== 1 ? "s" : ""}
      </div>

      {/* Doctors Grid */}
      {filteredAndSortedDoctors.length === 0 ? (
        <div className="flex justify-center items-center w-full h-40 p-6 rounded-lg">
          <p className="text-muted-foreground">
            Aucun médecin trouvé pour cette spécialité
          </p>
        </div>
      ) : (
        <div className="w-full px-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 py-2">
          {filteredAndSortedDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}
