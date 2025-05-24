"use client";
import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/common/buttons/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define the specialty options grouped by school level
const specialtyOptions = [
  // Collège specialties
  { value: "arabe-college", label: "Professeur d'Arabe", category: "Collège" },
  {
    value: "francais-college",
    label: "Professeur de Français",
    category: "Collège",
  },
  {
    value: "anglais-college",
    label: "Professeur d'Anglais",
    category: "Collège",
  },
  {
    value: "mathematiques-college",
    label: "Professeur de Mathématiques",
    category: "Collège",
  },
  {
    value: "sciences-physiques-college",
    label: "Professeur de Sciences Physiques",
    category: "Collège",
  },
  {
    value: "svt-college",
    label: "Professeur de Sciences de la Vie et de la Terre",
    category: "Collège",
  },
  {
    value: "histoire-geo-college",
    label: "Professeur d'Histoire-Géographie",
    category: "Collège",
  },
  {
    value: "education-civique-college",
    label: "Professeur d'Éducation Civique",
    category: "Collège",
  },
  {
    value: "education-islamique-college",
    label: "Professeur d'Éducation Islamique",
    category: "Collège",
  },
  {
    value: "education-artistique-college",
    label: "Professeur d'Éducation Artistique",
    category: "Collège",
  },
  {
    value: "education-physique-college",
    label: "Professeur d'Éducation Physique",
    category: "Collège",
  },
  {
    value: "technologie-college",
    label: "Professeur de Technologie",
    category: "Collège",
  },

  // Lycée specialties
  { value: "arabe-lycee", label: "Professeur d'Arabe", category: "Lycée" },
  {
    value: "francais-lycee",
    label: "Professeur de Français",
    category: "Lycée",
  },
  { value: "anglais-lycee", label: "Professeur d'Anglais", category: "Lycée" },
  {
    value: "espagnol-lycee",
    label: "Professeur d'Espagnol",
    category: "Lycée",
  },
  {
    value: "allemand-lycee",
    label: "Professeur d'Allemand",
    category: "Lycée",
  },
  { value: "italien-lycee", label: "Professeur d'Italien", category: "Lycée" },
  { value: "chinois-lycee", label: "Professeur de Chinois", category: "Lycée" },
  { value: "russe-lycee", label: "Professeur de Russe", category: "Lycée" },
  { value: "turc-lycee", label: "Professeur de Turc", category: "Lycée" },
  {
    value: "japonais-lycee",
    label: "Professeur de Japonais",
    category: "Lycée",
  },
  {
    value: "mathematiques-lycee",
    label: "Professeur de Mathématiques",
    category: "Lycée",
  },
  {
    value: "sciences-physiques-lycee",
    label: "Professeur de Sciences Physiques",
    category: "Lycée",
  },
  {
    value: "svt-lycee",
    label: "Professeur de Sciences de la Vie et de la Terre",
    category: "Lycée",
  },
  {
    value: "informatique-lycee",
    label: "Professeur d'Informatique",
    category: "Lycée",
  },
  {
    value: "technologie-lycee",
    label: "Professeur de Technologie",
    category: "Lycée",
  },
  {
    value: "philosophie-lycee",
    label: "Professeur de Philosophie",
    category: "Lycée",
  },
  {
    value: "economie-lycee",
    label: "Professeur d'Économie",
    category: "Lycée",
  },
  { value: "gestion-lycee", label: "Professeur de Gestion", category: "Lycée" },
  {
    value: "comptabilite-lycee",
    label: "Professeur de Comptabilité",
    category: "Lycée",
  },
  {
    value: "histoire-geo-lycee",
    label: "Professeur d'Histoire-Géographie",
    category: "Lycée",
  },
  {
    value: "education-civique-lycee",
    label: "Professeur d'Éducation Civique",
    category: "Lycée",
  },
  {
    value: "education-islamique-lycee",
    label: "Professeur d'Éducation Islamique",
    category: "Lycée",
  },
  {
    value: "education-artistique-lycee",
    label: "Professeur d'Éducation Artistique",
    category: "Lycée",
  },
  {
    value: "education-physique-lycee",
    label: "Professeur d'Éducation Physique",
    category: "Lycée",
  },
];

interface SpecialtiesPickerProps {
  onChange?: (specialties: string[]) => void;
  defaultValue?: string[];
  error?: string;
}

export default function SpecialtiesPicker({
  onChange,
  defaultValue = [],
  error,
}: SpecialtiesPickerProps) {
  const [specialtiesOpen, setSpecialtiesOpen] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] =
    useState<string[]>(defaultValue);

  // Group specialties by category (Collège or Lycée)
  const groupedSpecialties = specialtyOptions.reduce((acc, specialty) => {
    if (!acc[specialty.category]) {
      acc[specialty.category] = [];
    }
    acc[specialty.category].push(specialty);
    return acc;
  }, {} as Record<string, typeof specialtyOptions>);

  const removeSpecialty = (specialty: string) => {
    const updated = selectedSpecialties.filter((s) => s !== specialty);
    setSelectedSpecialties(updated);
    onChange?.(updated);
  };

  const handleSelect = (value: string, label: string) => {
    const isSelected = selectedSpecialties.includes(label);
    let updated: string[];

    if (isSelected) {
      updated = selectedSpecialties.filter((s) => s !== label);
    } else {
      updated = [...selectedSpecialties, label];
    }

    setSelectedSpecialties(updated);
    onChange?.(updated);
  };

  return (
    <div>
      <Label className="block mb-2 font-medium">Spécialités</Label>
      <div className="relative mt-1">
        <Popover open={specialtiesOpen} onOpenChange={setSpecialtiesOpen}>
          <PopoverTrigger asChild>
            <Button
              aria-label="Sélectionner des spécialités"
              variant="outline"
              className="w-full justify-between"
            >
              {selectedSpecialties.length > 0 ? (
                <span>
                  {selectedSpecialties.length} sélectionné
                  {selectedSpecialties.length > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Sélectionner des spécialités
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Rechercher des spécialités..." />
              <CommandEmpty className="p-2 text-sm">
                Aucune spécialité trouvée.
              </CommandEmpty>
              <CommandList className="max-h-[300px]">
                {Object.entries(groupedSpecialties).map(
                  ([category, specialties]) => (
                    <CommandGroup key={category} heading={category}>
                      {specialties.map((specialty) => {
                        const isSelected = selectedSpecialties.includes(
                          specialty.label
                        );
                        return (
                          <CommandItem
                            key={specialty.value}
                            value={specialty.value}
                            className="cursor-pointer"
                            onSelect={() =>
                              handleSelect(specialty.value, specialty.label)
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {specialty.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedSpecialties.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedSpecialties.map((specialty) => (
            <div
              key={specialty}
              className="px-3 py-1 flex items-center gap-1 bg-primary rounded-md text-white text-sm"
            >
              {specialty}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeSpecialty(specialty)}
              />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
