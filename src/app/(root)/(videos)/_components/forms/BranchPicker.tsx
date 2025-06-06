"use client";
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
import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BranchPickerProps {
  className: string;
  onChange?: (branches: string[]) => void;
  defaultValue?: string[];
  error?: string;
}

export default function BranchPicker({
  className,
  onChange,
  defaultValue = [],
  error,
}: BranchPickerProps) {
  const [branchesOpen, setBranchesOpen] = useState(false);
  const [selectedBranches, setSelectedBranches] =
    useState<string[]>(defaultValue);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);

  useEffect(() => {
    if (!className) {
      setAvailableBranches([]);
      setSelectedBranches([]);
      onChange?.([]);
      return;
    }

    const branches =
      studentClassesAndBranches[
        className as keyof typeof studentClassesAndBranches
      ] || [];
    setAvailableBranches(branches);

    const validSelectedBranches = selectedBranches.filter((branch) =>
      branches.includes(branch)
    );

    if (validSelectedBranches.length !== selectedBranches.length) {
      setSelectedBranches(validSelectedBranches);
      onChange?.(validSelectedBranches);
    }
  }, [className]);

  const removeBranch = (branchToRemove: string) => {
    const updated = selectedBranches.filter((b) => b !== branchToRemove);
    setSelectedBranches(updated);
    onChange?.(updated);
  };

  const handleSelect = (value: string) => {
    const isSelected = selectedBranches.includes(value);
    const updated = isSelected
      ? selectedBranches.filter((b) => b !== value)
      : [...selectedBranches, value];

    setSelectedBranches(updated);
    onChange?.(updated);
  };

  const isDisabled = !className || availableBranches.length <= 1;

  return (
    <div>
      <Label className="block mb-2 font-medium">Filières</Label>
      <div className="relative mt-1">
        <Popover open={branchesOpen} onOpenChange={setBranchesOpen}>
          <PopoverTrigger
            asChild
            className=" border-primary-400 focus-visible:border-primary-400 focus-visible:ring-primary/60 focus-visible:ring-[3px]"
          >
            <Button
              aria-label="Sélectionner des filières"
              variant="outline"
              className={`w-full justify-between ${
                error ? "border-red-500" : ""
              }`}
              disabled={isDisabled}
            >
              {isDisabled ? (
                <span className="text-muted-foreground ">
                  {!className
                    ? "Sélectionnez d'abord une classe"
                    : availableBranches[0] || "Aucune filière"}
                </span>
              ) : selectedBranches.length > 0 ? (
                <span>
                  {selectedBranches.length} filière
                  {selectedBranches.length > 1 ? "s" : ""} sélectionnée
                </span>
              ) : (
                <span className="text-muted-foreground dark:text-white/80">
                  Sélectionner des filières
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70 text-primary-900 dark:text-white " />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className=" w-[300px] p-0  border-primary-400  "
            align="start"
          >
            <Command className="dark:bg-primary-950">
              <CommandInput
                className="text-primary-900 dark:text-white placeholder:text-primary-700/70 dark:placeholder:text-primary-100"
                placeholder="Rechercher des filières..."
              />
              <CommandEmpty className="p-2 text-sm text-primary-900 dark:text-white">
                Aucune filière trouvée.
              </CommandEmpty>
              <CommandList className="max-h-[250px]  ">
                <CommandGroup>
                  {availableBranches.map((branchName) => {
                    const isSelected = selectedBranches.includes(branchName);
                    return (
                      <CommandItem
                        key={branchName}
                        value={branchName}
                        className="cursor-pointer"
                        onSelect={() => handleSelect(branchName)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {branchName}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedBranches.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedBranches.map((branchName) => (
            <div
              key={branchName}
              className="px-3 py-1 flex items-center gap-1 bg-primary rounded-md text-white text-sm"
            >
              {branchName}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeBranch(branchName)}
              />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
