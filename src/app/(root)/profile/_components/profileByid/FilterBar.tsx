"use client";

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
  const currentClass = searchParams.get("class") || "";
  const currentBranch = searchParams.get("branch") || "";
  const currentSubject = searchParams.get("subject") || "";

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
    router.push(`${pathname}?${createQueryString("class", value)}`);
  };

  const handleBranchChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("branch", value)}`);
  };

  const handleSubjectChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("subject", value)}`);
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <h3 className="text-lg font-medium">Filter Videos</h3>
      <div className="flex flex-wrap gap-4 items-center">
        {/* Class Filter */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="class-filter"
            className="text-sm font-medium text-gray-700"
          >
            Class
          </label>
          <select
            id="class-filter"
            value={currentClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Classes</option>
            {Object.keys(studentClassesAndBranches).map((classOption) => (
              <option key={classOption} value={classOption}>
                {classOption}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter - Only show if a class is selected */}
        {currentClass && availableBranches.length > 0 && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="branch-filter"
              className="text-sm font-medium text-gray-700"
            >
              Branch
            </label>
            <select
              id="branch-filter"
              value={currentBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Branches</option>
              {availableBranches.map((branch: string) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subject Filter */}
        {subjects.length > 0 && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="subject-filter"
              className="text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <select
              id="subject-filter"
              value={currentSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reset Filters Button */}
        {(currentClass || currentBranch || currentSubject) && (
          <button
            onClick={resetFilters}
            className="mt-auto mb-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
