"use client";

import ProfessorCard from "@/components/cards/ProfessorCard";
import StudyCard from "@/components/cards/StudyCard";
import StudyTabs from "@/components/cards/StudyTabs";
import SubjectTabs from "@/components/cards/SubjectTabs";
import { useState } from "react";

export default function EtudePage() {
  const [activeTab, setActiveTab] = useState<"etudes" | "professors">("etudes");
  const [selectedSubject, setSelectedSubject] = useState("All");

  return (
    <div className="p-6">
      <div>
        <StudyTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab !== "etudes" && (
          <SubjectTabs
            selected={selectedSubject}
            onChange={setSelectedSubject}
          />
        )}

        {activeTab === "etudes" ? (
          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-6">
            {dummyEtudes.map((etude, index) => (
              <StudyCard key={index} {...etude} />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
            {dummyProfessors
              .filter(
                (prof) =>
                  selectedSubject === "All" ||
                  prof.specialty.toUpperCase() === selectedSubject.toUpperCase()
              )
              .map((prof, index) => (
                <ProfessorCard key={index} {...prof} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

const dummyEtudes = [
  {
    title: "Math fondamental",
    date: "12/05/2023 12:06PM",
    message: "Travailler série 2, compléter le document vidéo.",
    tags: ["Examen", "Document", "Vidéo"],
  },
  {
    title: "Français débutant",
    date: "12/05/2023 12:06PM",
    message: "Travailler série 2...",
    tags: ["Examen", "Document", "Vidéo"],
  },
  {
    title: "Français débutant",
    date: "12/05/2023 12:06PM",
    message: "Travailler série 2...",
    tags: ["Examen", "Document", "Vidéo"],
  },
  {
    title: "Français débutant",
    date: "12/05/2023 12:06PM",
    message: "Travailler série 2...",
    tags: ["Examen", "Document", "Vidéo"],
  },
  {
    title: "Français débutant",
    date: "12/05/2023 12:06PM",
    message: "Travailler série 2...",
    tags: ["Examen", "Document", "Vidéo"],
  },
];

const dummyProfessors = [
  {
    name: "Dr. Fred",
    rating: 4.9,
    image: "/prof1.jpg",
    specialty: "math",
  },
  {
    name: "Dr. Fred",
    rating: 4.9,
    image: "/prof2.jpg",
    specialty: "Physique",
  },
  {
    name: "Dr. Fred",
    rating: 4.9,
    image: "/prof1.jpg",
    specialty: "math",
  },
  {
    name: "Dr. Fred",
    rating: 4.9,
    image: "/prof1.jpg",
    specialty: "math",
  },
  {
    name: "Dr. Fred",
    rating: 4.9,
    image: "/prof1.jpg",
    specialty: "Mathématiques",
  },
  {
    name: "Dr. Fred",
    rating: 4.9,
    image: "/prof1.jpg",
    specialty: "science",
  },
];
