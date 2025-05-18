"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { extractSubjectFromSpecialty } from "@/lib/helpers/extractSubject";

interface TeacherProps {
  id: string;
  name: string;
  avatar_url?: string;
  specialties: string[];
  rating?: number;
  bio?: string;
}

interface TeacherCardProps {
  teacher: TeacherProps;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format the rating to 1 decimal place if needed
  const formattedRating = teacher.rating ? teacher.rating.toFixed(1) : "N/A";

  // Get subjects from specialties
  const subjects = teacher.specialties
    .map((specialty) => extractSubjectFromSpecialty(specialty))
    .filter((subject, index, self) => self.indexOf(subject) === index); // Remove duplicates

  return (
    <Link href={`/teacher/${teacher.id}`}>
      <div
        className="flex flex-col bg-card rounded-lg border p-4 hover:shadow-md transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-4 mb-3">
          {/* Teacher Avatar */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-muted">
            <Image
              src={teacher.avatar_url || "/placeholder-avatar.jpg"}
              alt={teacher.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Teacher Info */}
          <div>
            <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
              {teacher.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm">{formattedRating}</span>
            </div>
          </div>
        </div>

        {/* Teacher Bio (truncated) */}
        {teacher.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {teacher.bio}
          </p>
        )}

        {/* Teacher Specialties */}
        <div className="mt-auto">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <GraduationCap className="w-4 h-4 mr-1" />
            <span>Spécialités</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {subjects.slice(0, 4).map((subject, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {subject}
              </Badge>
            ))}
            {subjects.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{subjects.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
