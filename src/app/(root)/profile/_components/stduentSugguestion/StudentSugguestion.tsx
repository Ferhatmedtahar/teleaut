import React from "react";
import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function StudentSugguestionList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* {recommendedTeachers.map((teacher) => (
        <Card
          key={teacher.id}
          className="overflow-hidden border-none shadow-sm"
        >
          <CardContent className="p-0">
            <div className="flex flex-col items-center p-4">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage
                  src={teacher.image || "/placeholder.svg"}
                  alt={teacher.name}
                />
                <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
              </Avatar>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <h3 className="font-medium">{teacher.name}</h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="fill-yellow-500 stroke-yellow-500 h-3 w-3" />
                    <span className="text-xs ml-0.5">{teacher.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {teacher.specialties?.join(", ")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8"
                >
                  apprendre
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))} */}
    </div>
  );
}
