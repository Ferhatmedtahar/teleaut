"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";
import { useState } from "react";

// Education data
export const studentClassesAndBranches = {
  "7ème année de base": ["Aucune filière"],
  "8ème année de base": ["Aucune filière"],
  "9ème année de base": ["Aucune filière"],
  "1ère année secondaire": ["Aucune filière"],
  "2ème année secondaire": [
    "Sciences expérimentales",
    "Sciences techniques",
    "Lettres",
    "Économie & gestion",
    "Sciences de l'informatique",
    "Sciences sportives",
  ],
  "3ème année secondaire": [
    "Mathématiques",
    "Sciences expérimentales",
    "Sciences techniques",
    "Lettres",
    "Économie & gestion",
    "Sciences de l'informatique",
    "Sciences sportives",
  ],
  "4ème année secondaire (BAC)": [
    "Mathématiques",
    "Sciences expérimentales",
    "Sciences techniques",
    "Lettres",
    "Économie & gestion",
    "Sciences de l'informatique",
    "Sciences sportives",
  ],
};

export const educationMapping: Record<string, Record<string, string[]>> = {
  "7ème année de base": {
    _default: [
      "Arabe",
      "Français",
      "Anglais",
      "Mathématiques",
      "Sciences Physiques",
      "Sciences de la Vie et de la Terre",
      "Histoire-Géographie",
      "Éducation Civique",
      "Éducation Islamique",
      "Éducation Artistique",
      "Éducation Physique",
      "Technologie",
    ],
  },
  "8ème année de base": {
    _default: [
      "Arabe",
      "Français",
      "Anglais",
      "Mathématiques",
      "Sciences Physiques",
      "Sciences de la Vie et de la Terre",
      "Histoire-Géographie",
      "Éducation Civique",
      "Éducation Islamique",
      "Éducation Artistique",
      "Éducation Physique",
      "Technologie",
    ],
  },
  "9ème année de base": {
    _default: [
      "Arabe",
      "Français",
      "Anglais",
      "Mathématiques",
      "Sciences Physiques",
      "Sciences de la Vie et de la Terre",
      "Histoire-Géographie",
      "Éducation Civique",
      "Éducation Islamique",
      "Éducation Artistique",
      "Éducation Physique",
      "Technologie",
    ],
  },
  "1ère année secondaire": {
    _default: [
      "Arabe",
      "Français",
      "Anglais",
      "Mathématiques",
      "Sciences Physiques",
      "Sciences de la Vie et de la Terre",
      "Histoire-Géographie",
      "Éducation Islamique",
      "Éducation Physique",
      "Technologie",
      "Informatique",
    ],
  },
  "2ème année secondaire": {
    Lettres: [
      "Arabe",
      "Français",
      "Anglais",
      "Philosophie",
      "Histoire-Géographie",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    Sciences: [
      "Mathématiques",
      "Sciences Physiques",
      "Sciences de la Vie et de la Terre",
      "Informatique",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    "Économie et Gestion": [
      "Économie",
      "Gestion",
      "Comptabilité",
      "Mathématiques",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    Techniques: [
      "Technologie",
      "Mathématiques",
      "Sciences Physiques",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
  },
  "3ème année secondaire": {
    Lettres: [
      "Arabe",
      "Français",
      "Anglais",
      "Philosophie",
      "Histoire-Géographie",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    "Sciences Expérimentales": [
      "Sciences de la Vie et de la Terre",
      "Mathématiques",
      "Sciences Physiques",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    Mathématiques: [
      "Mathématiques",
      "Sciences Physiques",
      "Informatique",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    Techniques: [
      "Technologie",
      "Mathématiques",
      "Sciences Physiques",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    "Économie et Gestion": [
      "Économie",
      "Gestion",
      "Comptabilité",
      "Mathématiques",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
  },
  "4ème année secondaire (BAC)": {
    Lettres: [
      "Arabe",
      "Français",
      "Anglais",
      "Philosophie",
      "Histoire-Géographie",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    "Sciences Expérimentales": [
      "Sciences de la Vie et de la Terre",
      "Mathématiques",
      "Sciences Physiques",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    Mathématiques: [
      "Mathématiques",
      "Sciences Physiques",
      "Informatique",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    "Sciences techniques": [
      "Technologie",
      "Mathématiques",
      "Sciences Physiques",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
    "Économie et Gestion": [
      "Économie",
      "Gestion",
      "Comptabilité",
      "Mathématiques",
      "Français",
      "Anglais",
      "Arabe",
      "Éducation Islamique",
      "Éducation Physique",
    ],
  },
};

export const studentClasses = Object.keys(studentClassesAndBranches);

interface FilterState {
  sortBy: string;
  dateFilter: string;
  duration: string;
  type: string;
  selectedClass: string;
  selectedBranch: string;
  selectedSubjects: string[];
}

const initialFilterState: FilterState = {
  sortBy: "",
  dateFilter: "",
  duration: "",
  type: "",
  selectedClass: "",
  selectedBranch: "",
  selectedSubjects: [],
};

export function FilterModal() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Get available branches based on selected class
  const availableBranches = filters.selectedClass
    ? studentClassesAndBranches[
        filters.selectedClass as keyof typeof studentClassesAndBranches
      ] || []
    : [];

  // Get available subjects based on selected class and branch
  const getAvailableSubjects = () => {
    if (!filters.selectedClass) return [];

    const classData = educationMapping[filters.selectedClass];
    if (!classData) return [];

    if (filters.selectedBranch && filters.selectedBranch !== "Aucune filière") {
      return classData[filters.selectedBranch] || classData._default || [];
    }

    return classData._default || [];
  };

  const availableSubjects = getAvailableSubjects();

  const handleSubjectToggle = (subject: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter((s) => s !== subject)
        : [...prev.selectedSubjects, subject],
    }));
  };

  const handleClassChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedClass: value,
      selectedBranch: "", // Reset branch when class changes
      selectedSubjects: [], // Reset subjects when class changes
    }));
  };

  const handleBranchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedBranch: value,
      selectedSubjects: [], // Reset subjects when branch changes
    }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilterState);
  };

  const applyFilters = () => {
    // Here you would typically update the URL params or call a callback
    console.log("Applied filters:", filters);
    setOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== ""
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
          {hasActiveFilters && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              !
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filtres de recherche
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Effacer tout
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sort By */}
          <div className="space-y-3">
            <h4 className="font-medium">Trier par</h4>
            <div className="flex flex-wrap gap-2">
              {["Nombre de vues", "Date de création"].map((option) => (
                <Button
                  key={option}
                  variant={filters.sortBy === option ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, sortBy: option }))
                  }
                  className="text-xs"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Filter */}
          <div className="space-y-3">
            <h4 className="font-medium">Date</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Dernière heure",
                "Aujourd'hui",
                "Cette semaine",
                "Ce mois",
                "Cette année",
              ].map((option) => (
                <Button
                  key={option}
                  variant={
                    filters.dateFilter === option ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, dateFilter: option }))
                  }
                  className="text-xs"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Type */}
          <div className="space-y-3">
            <h4 className="font-medium">Type</h4>
            <div className="flex flex-wrap gap-2">
              {["Vidéo", "Professeur", "Élève"].map((option) => (
                <Button
                  key={option}
                  variant={filters.type === option ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, type: option }))
                  }
                  className="text-xs"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Class Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Classe</h4>
            <Select
              value={filters.selectedClass}
              onValueChange={handleClassChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                {studentClasses.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Branch Selection */}
          {filters.selectedClass && availableBranches.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Filière</h4>
              <Select
                value={filters.selectedBranch}
                onValueChange={handleBranchChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une filière" />
                </SelectTrigger>
                <SelectContent>
                  {availableBranches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Subject Selection */}
          {availableSubjects.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Matières</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableSubjects.map((subject) => (
                  <Button
                    key={subject}
                    variant={
                      filters.selectedSubjects.includes(subject)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleSubjectToggle(subject)}
                    className="text-xs"
                  >
                    {subject}
                    {filters.selectedSubjects.includes(subject) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                ))}
              </div>
              {filters.selectedSubjects.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {filters.selectedSubjects.length} matière
                  {filters.selectedSubjects.length > 1 ? "s" : ""} sélectionnée
                  {filters.selectedSubjects.length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}

          {/* Apply Button */}
          <Button onClick={applyFilters} className="w-full">
            Appliquer les filtres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
