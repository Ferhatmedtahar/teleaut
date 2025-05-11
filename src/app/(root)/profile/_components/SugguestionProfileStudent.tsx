import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function SugguestionProfileStudent() {
  // Mock data for recommended teachers
  const recommendedTeachers = [
    {
      id: 1,
      name: `Dr.Ferhat`,
      rating: 4.9,
      specialties: ["math", "science"],
      image: "/images/placeholder.svg",
    },
    {
      id: 2,
      name: "Dr.Joe",
      rating: 4.9,
      specialties: ["islamique", "arab"],
      image: "/images/placeholder.svg",
    },
    {
      id: 3,
      name: "Dr.Fae",
      rating: 4.9,
      specialties: ["physics", "chemistry"],
      image: "/images/placeholder.svg",
    },
    {
      id: 4,
      name: "Dr.Zack",
      rating: 4.8,
      specialties: ["geography", "history"],
      image: "/images/placeholder.svg",
    },
    {
      id: 5,
      name: "Dr.Fred",
      rating: 4.9,
      specialties: ["english", "french"],
      image: "/images/placeholder.svg",
    },
    {
      id: 6,
      name: "Dr.Lia",
      rating: 4.9,
      specialties: ["math", "science"],
      image: "/images/placeholder.svg",
    },
  ];
  return (
    <div className="px-8 py-6">
      <h2 className="text-lg font-semibold mb-6">Explorer des professeur</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendedTeachers.map((teacher) => (
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
                  <AvatarFallback>
                    {teacher.name.substring(0, 2)}
                  </AvatarFallback>
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
        ))}
      </div>
    </div>
  );
}
