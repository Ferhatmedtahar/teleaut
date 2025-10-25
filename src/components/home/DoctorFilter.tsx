"use client";

import { Doctor } from "@/types/entities/Doctor.interface";
import { Filter, SortDesc } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import DoctorCard from "./DoctorCard";

interface DoctorsFilterProps {
  doctors: Doctor[];
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
          <Select
            value={selectedSpecialty}
            onValueChange={setSelectedSpecialty}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Toutes les spécialités" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Toutes les spécialités</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty!}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <SortDesc className="w-5 h-5 text-muted-foreground" />
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trier par expérience" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="desc">Plus d'expérience</SelectItem>
                <SelectItem value="asc">Moins d'expérience</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
