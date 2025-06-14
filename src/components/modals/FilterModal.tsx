"use client";

import { Button } from "@/components/common/buttons/Button";
import { Badge } from "@/components/ui/badge";
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
import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
import type { RelatedVideo } from "@/types/RelatedVideos.interface";
import { Filter } from "lucide-react";
import { useState } from "react";

export const studentClasses = Object.keys(studentClassesAndBranches);

interface FilterState {
  sortBy: string;
  dateFilter: string;
  selectedClass: string;
  selectedBranch: string;
  selectedSubjects: string[];
}

const initialFilterState: FilterState = {
  sortBy: "",
  dateFilter: "",
  selectedClass: "",
  selectedBranch: "",
  selectedSubjects: [],
};

interface FilterModalProps {
  readonly searchVideos: RelatedVideo[];
  readonly onFiltersChange?: (videos: RelatedVideo[]) => void;
}

export function FilterModal({
  searchVideos,
  onFiltersChange,
}: FilterModalProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  console.log("search videos", { searchVideos, filters });

  // Get available branches based on selected class
  const availableBranches =
    filters.selectedClass == "4ème année secondaire (bac)"
      ? studentClassesAndBranches["4ème année secondaire (BAC)"] || []
      : studentClassesAndBranches[
          filters.selectedClass as keyof typeof studentClassesAndBranches
        ] || [];

  // Function to filter videos based on current filters
  const filterVideos = (
    videos: RelatedVideo[],
    currentFilters: FilterState
  ): RelatedVideo[] => {
    let filtered = [...videos];

    // Filter by subjects
    if (currentFilters.selectedSubjects.length > 0) {
      filtered = filtered.filter((video) =>
        currentFilters.selectedSubjects.some((subject) =>
          video.subject?.toLowerCase().includes(subject.toLowerCase())
        )
      );
    }

    // Filter by class - FIXED: use 'class' instead of 'class_level'
    if (currentFilters.selectedClass) {
      filtered = filtered.filter(
        (video) =>
          (video as any).class.toLowerCase() === currentFilters.selectedClass
      );
    }

    if (
      currentFilters.selectedBranch &&
      currentFilters.selectedBranch !== "Aucune filière"
    ) {
      filtered = filtered.filter((video) => {
        const videoBranch = (video as any).branch;
        // Handle both array and string cases
        if (Array.isArray(videoBranch)) {
          return videoBranch.includes(currentFilters.selectedBranch);
        } else if (typeof videoBranch === "string") {
          return videoBranch === currentFilters.selectedBranch;
        }
        return false;
      });
    }

    // Filter by date
    if (currentFilters.dateFilter) {
      const now = new Date();
      filtered = filtered.filter((video) => {
        const videoDate = new Date(video.created_at);
        const diffTime = now.getTime() - videoDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        switch (currentFilters.dateFilter) {
          case "Aujourd'hui":
            return diffDays <= 1;
          case "Cette semaine":
            return diffDays <= 7;
          case "Ce mois":
            return diffDays <= 30;
          case "Cette année":
            return diffDays <= 365;
          default:
            return true;
        }
      });
    }

    // Sort videos
    if (currentFilters.sortBy) {
      filtered.sort((a, b) => {
        switch (currentFilters.sortBy) {
          case "Nombre de vues":
            return ((b as any).views ?? 0) - ((a as any).views ?? 0);
          case "Date de création":
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const handleClassChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedClass: value,
      selectedBranch: "",
      selectedSubjects: [],
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
    if (onFiltersChange) {
      onFiltersChange(searchVideos); // Reset to original videos
    }
  };

  const applyFilters = () => {
    const filteredResults = filterVideos(searchVideos, filters);
    if (onFiltersChange) {
      onFiltersChange(filteredResults);
    }
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
          <span className="hidden sm:inline">Filtrer</span>
          <span className="sm:hidden">Filtres</span>
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
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-base sm:text-lg">
            <span>Filtres de recherche</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
              >
                Effacer tout
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Sort By */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-medium text-sm sm:text-base">Trier par</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["Nombre de vues", "Date de création"].map((option) => (
                <Button
                  key={option}
                  variant={filters.sortBy === option ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, sortBy: option }))
                  }
                  className="text-xs sm:text-sm w-full"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Filter */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-medium text-sm sm:text-base">Date</h4>
            <div className="grid grid-cols-2 gap-2">
              {["Aujourd'hui", "Cette semaine", "Ce mois", "Cette année"].map(
                (option) => (
                  <Button
                    key={option}
                    variant={
                      filters.dateFilter === option ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, dateFilter: option }))
                    }
                    className="text-xs sm:text-sm w-full"
                  >
                    {option}
                  </Button>
                )
              )}
            </div>
          </div>

          <Separator />

          {/* Class Selection */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-medium text-sm sm:text-base">Classe</h4>
            <Select
              value={filters.selectedClass}
              onValueChange={handleClassChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une classe" />
              </SelectTrigger>
              <SelectContent>
                {studentClasses.map((cls) => (
                  <SelectItem key={cls} value={cls.toLowerCase()}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Branch Selection */}
          {availableBranches.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-medium text-sm sm:text-base">Filière</h4>
              <Select
                value={filters.selectedBranch}
                onValueChange={handleBranchChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une filière" />
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

          {/* <Separator /> */}

          {/* Apply Button */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={applyFilters}
              className="flex-1 w-full sm:w-auto order-2 sm:order-1"
            >
              Appliquer les filtres
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
