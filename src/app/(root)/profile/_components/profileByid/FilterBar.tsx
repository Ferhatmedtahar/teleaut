"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface FilterBarProps {
  subjects: string[];
  userIsTeacher?: boolean;
}

export default function FilterBar({
  subjects,
  userIsTeacher = false,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentClass = searchParams.get("class") ?? "";
  const currentBranch = searchParams.get("branch") ?? "";
  const currentSubject = searchParams.get("subject") ?? "";

  // Determine available branches based on selected class
  const availableBranches = useMemo(() => {
    if (
      !currentClass ||
      !studentClassesAndBranches[
        currentClass as keyof typeof studentClassesAndBranches
      ]
    ) {
      return [];
    }
    return studentClassesAndBranches[
      currentClass as keyof typeof studentClassesAndBranches
    ];
  }, [currentClass]);

  // Create a new URLSearchParams instance when filters change
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      // If changing class, reset branch if it's not available for the new class
      if (name === "class") {
        const newAvailableBranches = value
          ? studentClassesAndBranches[
              value as keyof typeof studentClassesAndBranches
            ]
          : [];

        if (currentBranch && !newAvailableBranches.includes(currentBranch)) {
          params.delete("branch");
        }
      }

      return params.toString();
    },
    [searchParams, currentBranch]
  );

  // Handle filter changes
  const handleClassChange = (value: string) => {
    let urlvalue = value;
    if (value == "tout") {
      urlvalue = "";
    }
    router.push(`${pathname}?${createQueryString("class", urlvalue)}`);
  };

  const handleBranchChange = (value: string) => {
    let urlvalue = value;
    if (value == "tout") {
      urlvalue = "";
    }
    router.push(`${pathname}?${createQueryString("branch", urlvalue)}`);
  };

  const handleSubjectChange = (value: string) => {
    let urlvalue = value;
    if (value == "tout") {
      urlvalue = "";
    }
    router.push(`${pathname}?${createQueryString("subject", urlvalue)}`);
  };

  const resetFilters = () => {
    router.push(pathname);
  };
  console.log(availableBranches);

  return (
    <div className="flex flex-col gap-4 mb-6">
      <h3 className="text-lg font-medium">Filter Videos</h3>
      <div className="flex flex-wrap gap-4 items-center">
        {/* Class Filter */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="class-filter">Class</Label>
          <Select
            value={currentClass}
            onValueChange={(value) => handleClassChange(value)}
          >
            <SelectTrigger className="min-w-[200px] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
              <SelectValue placeholder="Toutes les classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tout">Toutes les classes</SelectItem>
              {Object.keys(studentClassesAndBranches).map((classOption) => (
                <SelectItem key={classOption} value={classOption}>
                  {classOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Branch Filter - Only show if a class is selected */}
        {currentClass &&
          availableBranches.length > 0 &&
          availableBranches[0] !== "Aucune filière" && (
            <div className="flex flex-col gap-1">
              <Label htmlFor="branch-filter">Branch</Label>
              <Select
                value={currentBranch}
                onValueChange={(value) => handleBranchChange(value)}
              >
                <SelectTrigger className="min-w-[200px] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
                  <SelectValue placeholder="Toutes les filières" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tout">Toutes les filières</SelectItem>
                  {availableBranches.map((branch: string) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        {/* Subject Filter */}
        {subjects.length > 0 && (
          <div className="flex flex-col gap-1">
            <Label htmlFor="subject-filter">Subject</Label>
            <Select
              value={currentSubject}
              onValueChange={(value) => handleSubjectChange(value)}
            >
              <SelectTrigger className="min-w-[200px] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
                <SelectValue placeholder="Toutes les matières" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tout">Toutes les matières</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject.toLowerCase()}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reset Filters Button */}
        {(currentClass || currentBranch || currentSubject) && (
          <button
            onClick={resetFilters}
            className="mt-auto mb-1 text-sm text-primary-600 hover:text-primary-800 transition-colors hover:underline hover:underline-offset-2 hover:cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
