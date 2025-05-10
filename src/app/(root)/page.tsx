import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const subjects = ["All", "Math", "Science", "Physique", "Arab", "Eng", "ITA"];

  return (
    <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg ">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex flex-wrap gap-2 dark:bg-background/80 bg-background/80 border border-white/90 ">
          {subjects.map((subject) => (
            <TabsTrigger
              key={subject}
              value={subject.toLowerCase()}
              className=" px-4 py-1 cursor-pointer"
            >
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <section>
        <h2 className="text-2xl font-bold mb-4">Featured</h2>
        <Card>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-4 p-6">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm"
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Featured video"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    Voluptas et rem quo autem fugit voluptate
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Voluptas et rem quo autem fugit voluptate reprehenderit,
                    ipsum ducimus ad sint dignissimos quo et.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Rayen"
                    />
                    <AvatarFallback>R</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">RAYEN</p>
                    <p className="text-xs text-muted-foreground">@rayen</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Explorer</h2>
        <div className="grid md:grid-cols-3 gap-6">
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
                    {item === 1
                      ? "Dr Nour"
                      : item === 2
                      ? "Dr Nora"
                      : "Dr Adem"}
                  </p>
                  <p className="text-xs text-muted-foreground">3 weeks ago</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
