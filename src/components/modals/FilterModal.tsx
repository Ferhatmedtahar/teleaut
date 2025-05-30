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

  // Get available branches based on selected class
  const availableBranches = filters.selectedClass
    ? studentClassesAndBranches[
        filters.selectedClass as keyof typeof studentClassesAndBranches
      ] || []
    : [];

  // Function to filter videos based on current filters
  const filterVideos = (
    videos: RelatedVideo[],
    currentFilters: FilterState
  ): RelatedVideo[] => {
    let filtered = [...videos];

    console.log("Original videos:", filtered.length);

    // Filter by subjects
    if (currentFilters.selectedSubjects.length > 0) {
      filtered = filtered.filter((video) =>
        currentFilters.selectedSubjects.some((subject) =>
          video.subject?.toLowerCase().includes(subject.toLowerCase())
        )
      );
      console.log("After subject filter:", filtered.length);
    }

    // Filter by class - FIXED: use 'class' instead of 'class_level'
    if (currentFilters.selectedClass) {
      filtered = filtered.filter(
        (video) => (video as any).class === currentFilters.selectedClass
      );
      console.log(
        "After class filter:",
        filtered.length,
        "looking for:",
        currentFilters.selectedClass
      );
    }

    // Filter by branch - FIXED: check if branch array includes the selected branch
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
      console.log(
        "After branch filter:",
        filtered.length,
        "looking for:",
        currentFilters.selectedBranch
      );
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
          default:
            return true;
        }
      });
      console.log("After date filter:", filtered.length);
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

    console.log("Final filtered results:", filtered.length);
    return filtered;
  };

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
              {["Aujourd'hui", "Cette semaine", "Ce mois"].map((option) => (
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

          {/* Class Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Classe</h4>
            <Select
              value={filters.selectedClass}
              onValueChange={handleClassChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une classe" />
              </SelectTrigger>
              <SelectContent>
                {studentClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Branch Selection */}
          {availableBranches.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Filière</h4>
              <Select
                value={filters.selectedBranch}
                onValueChange={handleBranchChange}
              >
                <SelectTrigger>
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

          <Separator />

          {/* Apply Button */}
          <div className="flex gap-2">
            <Button onClick={applyFilters} className="flex-1">
              Appliquer les filtres
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
// "use client";

// import { Button } from "@/components/common/buttons/Button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
// import type { RelatedVideo } from "@/types/RelatedVideos.interface";
// import { Filter } from "lucide-react";
// import { useState } from "react";

// export const studentClasses = Object.keys(studentClassesAndBranches);

// interface FilterState {
//   sortBy: string;
//   dateFilter: string;
//   selectedClass: string;
//   selectedBranch: string;
//   selectedSubjects: string[];
// }

// const initialFilterState: FilterState = {
//   sortBy: "",
//   dateFilter: "",
//   selectedClass: "",
//   selectedBranch: "",
//   selectedSubjects: [],
// };

// interface FilterModalProps {
//   readonly searchVideos: RelatedVideo[];
//   readonly onFiltersChange?: (videos: RelatedVideo[]) => void;
// }

// export function FilterModal({
//   searchVideos,
//   onFiltersChange,
// }: FilterModalProps) {
//   const [open, setOpen] = useState(false);
//   const [filters, setFilters] = useState<FilterState>(initialFilterState);

//   // Get available branches based on selected class
//   const availableBranches = filters.selectedClass
//     ? studentClassesAndBranches[
//         filters.selectedClass as keyof typeof studentClassesAndBranches
//       ] || []
//     : [];

//   // Get available subjects based on selected class and branch
//   // const getAvailableSubjects = () => {
//   //   if (!filters.selectedClass) return [];

//   //   const classData = educationMapping[filters.selectedClass];
//   //   if (!classData) return [];

//   //   if (filters.selectedBranch && filters.selectedBranch !== "Aucune filière") {
//   //     return classData[filters.selectedBranch] || classData._default || [];
//   //   }

//   //   return classData._default || [];
//   // };

//   // const availableSubjects = getAvailableSubjects();

//   // Function to filter videos based on current filters
//   const filterVideos = (
//     videos: RelatedVideo[],
//     currentFilters: FilterState
//   ): RelatedVideo[] => {
//     let filtered = [...videos];

//     console.log("", filtered, videos);
//     // Filter by subjects
//     if (currentFilters.selectedSubjects.length > 0) {
//       filtered = filtered.filter((video) =>
//         currentFilters.selectedSubjects.some((subject) =>
//           video.subject?.toLowerCase().includes(subject.toLowerCase())
//         )
//       );
//     }

//     // Filter by class (if video has class_level property)
//     if (currentFilters.selectedClass) {
//       filtered = filtered.filter(
//         (video) => (video as any).class_level === currentFilters.selectedClass
//       );
//     }

//     // Filter by branch (if video has branch property)
//     if (
//       currentFilters.selectedBranch &&
//       currentFilters.selectedBranch !== "Aucune filière"
//     ) {
//       filtered = filtered.filter(
//         (video) => (video as any).branch === currentFilters.selectedBranch
//       );
//     }

//     // Filter by date
//     if (currentFilters.dateFilter) {
//       const now = new Date();
//       filtered = filtered.filter((video) => {
//         const videoDate = new Date(video.created_at);
//         const diffTime = now.getTime() - videoDate.getTime();
//         const diffDays = diffTime / (1000 * 60 * 60 * 24);

//         switch (currentFilters.dateFilter) {
//           case "Aujourd'hui":
//             return diffDays <= 1;
//           case "Cette semaine":
//             return diffDays <= 7;
//           case "Ce mois":
//             return diffDays <= 30;
//           default:
//             return true;
//         }
//       });
//     }

//     // Sort videos
//     if (currentFilters.sortBy) {
//       filtered.sort((a, b) => {
//         switch (currentFilters.sortBy) {
//           case "Nombre de vues":
//             return ((b as any).views ?? 0) - ((a as any).views ?? 0);
//           case "Date de création":
//             return (
//               new Date(b.created_at).getTime() -
//               new Date(a.created_at).getTime()
//             );
//           default:
//             return 0;
//         }
//       });
//     }

//     return filtered;
//   };

//   const handleSubjectToggle = (subject: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       selectedSubjects: prev.selectedSubjects.includes(subject)
//         ? prev.selectedSubjects.filter((s) => s !== subject)
//         : [...prev.selectedSubjects, subject],
//     }));
//   };

//   const handleClassChange = (value: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       selectedClass: value,
//       selectedBranch: "", // Reset branch when class changes
//     }));
//   };

//   const handleBranchChange = (value: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       selectedBranch: value,
//       selectedSubjects: [], // Reset subjects when branch changes
//     }));
//   };

//   const clearAllFilters = () => {
//     setFilters(initialFilterState);
//     if (onFiltersChange) {
//       onFiltersChange(searchVideos); // Reset to original videos
//     }
//   };

//   const applyFilters = () => {
//     const filteredResults = filterVideos(searchVideos, filters);
//     if (onFiltersChange) {
//       onFiltersChange(filteredResults);
//     }
//     setOpen(false);
//   };

//   const hasActiveFilters = Object.values(filters).some((value) =>
//     Array.isArray(value) ? value.length > 0 : value !== ""
//   );

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm" className="relative">
//           <Filter className="h-4 w-4 mr-2" />
//           Filtrer
//           {hasActiveFilters && (
//             <Badge
//               variant="destructive"
//               className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
//             >
//               !
//             </Badge>
//           )}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center justify-between">
//             Filtres de recherche
//             {hasActiveFilters && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={clearAllFilters}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 Effacer tout
//               </Button>
//             )}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Sort By */}
//           <div className="space-y-3">
//             <h4 className="font-medium">Trier par</h4>
//             <div className="flex flex-wrap gap-2">
//               {["Nombre de vues", "Date de création"].map((option) => (
//                 <Button
//                   key={option}
//                   variant={filters.sortBy === option ? "default" : "outline"}
//                   size="sm"
//                   onClick={() =>
//                     setFilters((prev) => ({ ...prev, sortBy: option }))
//                   }
//                   className="text-xs"
//                 >
//                   {option}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           <Separator />

//           {/* Date Filter */}
//           <div className="space-y-3">
//             <h4 className="font-medium">Date</h4>
//             <div className="flex flex-wrap gap-2">
//               {["Aujourd'hui", "Cette semaine", "Ce mois"].map((option) => (
//                 <Button
//                   key={option}
//                   variant={
//                     filters.dateFilter === option ? "default" : "outline"
//                   }
//                   size="sm"
//                   onClick={() =>
//                     setFilters((prev) => ({ ...prev, dateFilter: option }))
//                   }
//                   className="text-xs"
//                 >
//                   {option}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           <Separator />

//           {/* Class Selection */}
//           <div className="space-y-3">
//             <h4 className="font-medium">Classe</h4>
//             <Select
//               value={filters.selectedClass}
//               onValueChange={handleClassChange}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Sélectionnez une classe" />
//               </SelectTrigger>
//               <SelectContent>
//                 {studentClasses.map((cls) => (
//                   <SelectItem key={cls} value={cls}>
//                     {cls}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Branch Selection */}
//           {availableBranches.length > 0 && (
//             <div className="space-y-3">
//               <h4 className="font-medium">Filière</h4>
//               <Select
//                 value={filters.selectedBranch}
//                 onValueChange={handleBranchChange}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Sélectionnez une filière" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {availableBranches.map((branch) => (
//                     <SelectItem key={branch} value={branch}>
//                       {branch}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Subjects Selection */}
//           {/* {availableSubjects.length > 0 && (
//             <div className="space-y-3">
//               <h4 className="font-medium">Matières</h4>
//               <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
//                 {availableSubjects.map((subject) => (
//                   <Button
//                     key={subject}
//                     variant={
//                       filters.selectedSubjects.includes(subject)
//                         ? "default"
//                         : "outline"
//                     }
//                     size="sm"
//                     onClick={() => handleSubjectToggle(subject)}
//                     className="text-xs"
//                   >
//                     {subject}
//                     {filters.selectedSubjects.includes(subject) && (
//                       <X className="h-3 w-3 ml-1" />
//                     )}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           )} */}

//           <Separator />

//           {/* Apply Button */}
//           <div className="flex gap-2">
//             <Button onClick={applyFilters} className="flex-1">
//               Appliquer les filtres
//             </Button>
//             <Button variant="outline" onClick={() => setOpen(false)}>
//               Annuler
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
