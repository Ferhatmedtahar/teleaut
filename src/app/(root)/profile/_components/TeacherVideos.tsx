import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play } from "lucide-react";
import Image from "next/image";

export default function TeacherVideos() {
  //get videos of this teacher and display them

  return (
    <div className="p-8 flex flex-col gap-4 ">
      <h2 className="text-2xl font-semibold">Your Videos</h2>
      <div className="grid md:grid-cols-3 gap-6  w-full ">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="overflow-hidden">
            <div className="relative aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm"
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              <Image
                height={200}
                width={350}
                src="/placeholder.svg?height=200&width=350"
                alt="Video thumbnail"
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                4:56
              </div>
            </div>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">
                {item === 1
                  ? "WH Questions"
                  : item === 2
                  ? "Les fonctions f(x)"
                  : "Arab cours revisions des livres"}
              </CardTitle>
              <CardDescription className="text-xs">
                {item === 1 ? "English" : item === 2 ? "Math" : "Arab"}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src="/placeholder.svg?height=24&width=24"
                  alt="User"
                />
                <AvatarFallback>
                  {item === 1 ? "D" : item === 2 ? "N" : "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">
                  {item === 1 ? "Dr Nour" : item === 2 ? "Dr Nora" : "Dr Adem"}
                </p>
                <p className="text-xs text-muted-foreground">3 weeks ago</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
