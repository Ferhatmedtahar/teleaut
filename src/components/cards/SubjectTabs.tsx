"use client";

import { useEffect } from "react";

const subjects = ["All", "Math", "Science", "Physique", "Arab", "Eng", "ITA"];

type SubjectTabsProps = {
  selected: string;
  onChange: (subject: string) => void;
};

export default function SubjectTabs({ selected, onChange }: SubjectTabsProps) {
  useEffect(() => {
    if (!subjects.includes(selected)) {
      onChange("All");
    }
  }, [selected, onChange]);

  return (
    <div className="flex flex-wrap gap-2 mt-6 overflow-x-auto pb-2">
      {subjects.map((subject) => (
        <button
          key={subject}
          onClick={() => onChange(subject)}
          className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap ${
            selected === subject
              ? "gradient-bg-light text-white border-none"
              : "bg-muted text-muted-foreground border-border hover:bg-accent"
          }`}
        >
          {subject}
        </button>
      ))}
    </div>
  );
}
