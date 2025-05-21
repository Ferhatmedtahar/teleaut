"use client";

import { Button } from "@/components/common/buttons/Button";
import { Badge } from "@/components/ui/badge";
import { extractSubjectFromSpecialty } from "@/lib/helpers/extractSubject";
import { GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TeacherProps {
  id: string;
  first_name: string;
  last_name?: string;
  profile_url?: string;
  specialties: string[];
}

interface TeacherCardProps {
  teacher: TeacherProps;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const subjects = teacher.specialties
    .map((specialty) => extractSubjectFromSpecialty(specialty))
    .filter((subject, index, self) => self.indexOf(subject) === index);

  return (
    <div className="flex flex-col   border border-border/5 dark:border-border/10 rounded-xl p-2 hover:shadow-sm hover:shadow-border/15 transition-all duration-200">
      <div className="flex items-center  gap-4 mb-4">
        <div className="relative w-full aspect-square  rounded-xl overflow-hidden ">
          {teacher.profile_url ? (
            <Image
              src={teacher.profile_url}
              alt={teacher.first_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-border/20 dark:bg-border/50 flex items-center justify-center h-full">
              <Image
                src={"/images/placeholder-profile.png"}
                alt={teacher.first_name}
                fill
                className="object-cover"
              />
              {/* {teacher.first_name} */}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg text-foreground">
          {teacher.first_name} {teacher.last_name}
        </h3>
      </div>
      {/* Specialties */}
      <div className="mt-auto">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <GraduationCap className="w-4 h-4 mr-1" />
          <span>Spécialités</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Approcher button */}
        <Link href={`/profile/${teacher.id}`} className="text-sm w-full">
          <Button className="w-full opacity-95">Approcher</Button>
        </Link>
      </div>
    </div>
  );
}
