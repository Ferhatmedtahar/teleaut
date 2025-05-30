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
  readonly subjects: string[];
  readonly classes: string[];
  readonly branches: string[][];
  readonly userIsTeacher?: boolean;
  readonly setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FilterBar({
  subjects,
  classes,
  branches,
  userIsTeacher = false,
  setLoading,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const flatBranches = useMemo(() => branches.flat(), [branches]); // ✅ Flatten the array

  const currentClass = searchParams.get("class") ?? "";
  const currentBranch = searchParams.get("branch") ?? "";
  const currentSubject = searchParams.get("subject") ?? "";

  const availableBranches = useMemo(() => {
    if (
      !currentClass ||
      !studentClassesAndBranches[
        currentClass as keyof typeof studentClassesAndBranches
      ]
    ) {
      return flatBranches;
    }

    const classBranches =
      studentClassesAndBranches[
        currentClass as keyof typeof studentClassesAndBranches
      ];

    return classBranches.filter((branch) => flatBranches.includes(branch));
  }, [currentClass, flatBranches]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      if (name === "class") {
        const newAvailableBranches = value
          ? studentClassesAndBranches[
              value as keyof typeof studentClassesAndBranches
            ]?.filter((branch) => flatBranches.includes(branch)) || []
          : flatBranches;

        if (currentBranch && !newAvailableBranches.includes(currentBranch)) {
          params.delete("branch");
        }
      }

      return params.toString();
    },
    [searchParams, currentBranch, flatBranches]
  );

  const handleClassChange = (value: string) => {
    setLoading(true);
    router.push(
      `${pathname}?${createQueryString("class", value === "tout" ? "" : value)}`
    );
  };

  const handleBranchChange = (value: string) => {
    setLoading(true);
    router.push(
      `${pathname}?${createQueryString(
        "branch",
        value === "tout" ? "" : value
      )}`
    );
  };

  const handleSubjectChange = (value: string) => {
    setLoading(true);
    router.push(
      `${pathname}?${createQueryString(
        "subject",
        value === "tout" ? "" : value
      )}`
    );
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <h3 className="text-md font-medium">Filter Videos </h3>
      <div className="flex flex-wrap gap-4 items-center">
        {classes.length > 2 && (
          <div className="flex flex-col gap-1">
            <Label htmlFor="class-filter">Class</Label>
            <Select value={currentClass} onValueChange={handleClassChange}>
              <SelectTrigger className="min-w-[200px] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
                <SelectValue placeholder="Toutes les classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tout">Toutes les classes</SelectItem>
                {classes.map((classOption, index) => (
                  <SelectItem
                    key={`${classOption}-${index}`}
                    value={classOption}
                  >
                    {classOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {flatBranches.length > 2 && (
          <div className="flex flex-col gap-1">
            <Label htmlFor="branch-filter">Branch</Label>
            <Select
              value={currentBranch}
              onValueChange={handleBranchChange}
              disabled={!availableBranches.length}
            >
              <SelectTrigger className="min-w-[200px] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
                <SelectValue placeholder="Toutes les filières" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tout">Toutes les filières</SelectItem>
                {availableBranches.map((branch, index) => (
                  <SelectItem key={`${branch}-${index}`} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {subjects.length > 2 && (
          <div className="flex flex-col gap-1">
            <Label htmlFor="subject-filter">Subject</Label>
            <Select value={currentSubject} onValueChange={handleSubjectChange}>
              <SelectTrigger className="min-w-[200px] border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
                <SelectValue placeholder="Toutes les matières" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tout">Toutes les matières</SelectItem>
                {subjects.map((subject, index) => (
                  <SelectItem
                    key={`${subject}-${index}`}
                    value={subject.toLowerCase()}
                  >
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
