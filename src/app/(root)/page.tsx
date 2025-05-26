import { FilterModal } from "@/components/modals/FilterModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "lucide-react";
import Image from "next/image";

// Mock data - replace with your actual data source
const mockVideos = [
  {
    id: 1,
    title: "WH Questions - Complete Guide",
    description: "Learn all about WH questions in English grammar",
    subject: "Eng",
    instructor: "Dr Nour",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "4:56",
    uploadedAt: "3 weeks ago",
    featured: false,
  },
  {
    id: 2,
    title: "Les fonctions f(x) - Mathématiques",
    description: "Comprendre les fonctions mathématiques de base",
    subject: "Math",
    instructor: "Dr Nora",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "12:34",
    uploadedAt: "1 week ago",
    featured: true,
  },
  {
    id: 3,
    title: "Arab cours révisions des livres",
    description: "Révision complète des cours d'arabe",
    subject: "Arab",
    instructor: "Dr Adem",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "8:22",
    uploadedAt: "2 weeks ago",
    featured: false,
  },
  {
    id: 4,
    title: "Physique Quantique Introduction",
    description: "Introduction aux concepts de base de la physique quantique",
    subject: "Physique",
    instructor: "Dr Sarah",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "15:45",
    uploadedAt: "4 days ago",
    featured: true,
  },
  {
    id: 5,
    title: "Italian Grammar Basics",
    description: "Learn the fundamentals of Italian grammar",
    subject: "ITA",
    instructor: "Dr Marco",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "9:18",
    uploadedAt: "1 week ago",
    featured: false,
  },
  {
    id: 6,
    title: "Science Experiments for Beginners",
    description: "Fun and educational science experiments",
    subject: "Science",
    instructor: "Dr Lisa",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "11:30",
    uploadedAt: "5 days ago",
    featured: false,
  },
  {
    id: 7,
    title: "Voluptas et rem quo autem fugit voluptate",
    description:
      "Voluptas et rem quo autem fugit voluptate reprehenderit, ipsum ducimus ad sint dignissimos quo et.",
    subject: "Math",
    instructor: "RAYEN",
    instructorAvatar: "/placeholder.svg?height=32&width=32",
    thumbnail: "/placeholder.svg?height=300&width=500",
    duration: "6:45",
    uploadedAt: "2 days ago",
    featured: true,
  },
];

const mockProfessors = [
  {
    name: "Dr Nour",
    subject: "English",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Dr Nora",
    subject: "Math",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Dr Adem",
    subject: "Arab",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Dr Sarah",
    subject: "Physique",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Dr Marco",
    subject: "ITA",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Dr Lisa",
    subject: "Science",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Dr Ahmed",
    subject: "Math",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Dr Marie",
    subject: "Eng",
    avatar: "/placeholder.svg?height=48&width=48",
  },
];

interface SearchPageProps {
  searchParams: Promise<{ query?: string; filter?: string }>;
}

// Home Page Component
function HomePage() {
  const subjects = ["All", "Math", "Science", "Physique", "Arab", "Eng", "ITA"];
  const featuredVideo = mockVideos.find((video) => video.id === 7); // The main featured video
  const explorerVideos = mockVideos
    .filter((video) => video.id !== 7)
    .slice(0, 3);

  return (
    <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex flex-wrap gap-2 dark:bg-background/80 bg-background/80 border border-white/90">
          {subjects.map((subject) => (
            <TabsTrigger
              key={subject}
              value={subject.toLowerCase()}
              className="px-4 py-1 cursor-pointer"
            >
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <section>
        <h2 className="text-2xl font-bold mb-4">Featured</h2>
        {featuredVideo && (
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
                    src={featuredVideo.thumbnail || "/placeholder.svg"}
                    height={300}
                    width={500}
                    alt="Featured video"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{featuredVideo.title}</h3>
                    <p className="text-muted-foreground mt-2">
                      {featuredVideo.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          featuredVideo.instructorAvatar || "/placeholder.svg"
                        }
                        alt={featuredVideo.instructor}
                      />
                      <AvatarFallback>
                        {featuredVideo.instructor.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {featuredVideo.instructor}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{featuredVideo.instructor.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Explorer</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {explorerVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
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
                  src={video.thumbnail || "/placeholder.svg"}
                  alt="Video thumbnail"
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{video.title}</CardTitle>
                <CardDescription className="text-xs">
                  {video.subject}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={video.instructorAvatar || "/placeholder.svg"}
                    alt="User"
                  />
                  <AvatarFallback>{video.instructor.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">{video.instructor}</p>
                  <p className="text-xs text-muted-foreground">
                    {video.uploadedAt}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// Search Results Component
function SearchResults({
  query,
  activeFilter,
  filteredVideos,
  filteredProfessors,
}: {
  query: string;
  activeFilter: string;
  filteredVideos: typeof mockVideos;
  filteredProfessors: typeof mockProfessors;
}) {
  const featuredVideos = filteredVideos.filter((video) => video.featured);
  const regularVideos = filteredVideos.filter((video) => !video.featured);
  const subjects = ["Tout", "Professeur", "Vidéos", "Élève"];

  return (
    <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg min-h-screen">
      {/* Search Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Résultats pour &quot;{query}&quot;
          </h1>
          <p className="text-muted-foreground">
            {filteredVideos.length} vidéo
            {filteredVideos.length !== 1 ? "s" : ""} trouvée
            {filteredVideos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <FilterModal />
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue={activeFilter} className="w-full">
        <TabsList className="flex flex-wrap gap-2 dark:bg-background/80 bg-background/80 border border-white/90">
          {subjects.map((subject) => (
            <TabsTrigger
              key={subject}
              value={subject.toLowerCase()}
              className="px-4 py-1 cursor-pointer"
            >
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="tout" className="space-y-6 mt-6">
          {/* Featured Section */}
          {featuredVideos.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">À la une</h2>
              <div className="grid gap-4">
                {featuredVideos.map((video) => (
                  <Card key={video.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2 gap-4 p-6">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm"
                            >
                              <Play className="h-8 w-8" />
                            </Button>
                          </div>
                          <Image
                            src={video.thumbnail || "/placeholder.svg"}
                            height={300}
                            width={500}
                            alt={video.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                            {video.duration}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{video.subject}</Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                              {video.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {video.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  video.instructorAvatar || "/placeholder.svg"
                                }
                                alt={video.instructor}
                              />
                              <AvatarFallback>
                                {video.instructor.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {video.instructor}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {video.uploadedAt}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Explorer Section */}
          {regularVideos.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Explorer</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {regularVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-video">
                      <div className="absolute inset-0 flex items-center justify-center z-10">
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
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          {video.subject}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base line-clamp-2">
                        {video.title}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {video.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={video.instructorAvatar || "/placeholder.svg"}
                          alt={video.instructor}
                        />
                        <AvatarFallback>
                          {video.instructor.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {video.instructor}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {video.uploadedAt}
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Professor Suggestions */}
          {filteredProfessors.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Suggestions des Professeurs
              </h2>
              <div className="flex flex-wrap gap-4">
                {filteredProfessors.map((professor, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={professor.avatar || "/placeholder.svg"}
                        alt={professor.name}
                      />
                      <AvatarFallback>
                        {professor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-sm font-medium">{professor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {professor.subject}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </TabsContent>

        <TabsContent value="professeur" className="space-y-6 mt-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Professeurs</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {filteredProfessors.map((professor, index) => (
                <Card
                  key={index}
                  className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <Avatar className="h-20 w-20 mx-auto mb-3">
                    <AvatarImage
                      src={professor.avatar || "/placeholder.svg"}
                      alt={professor.name}
                    />
                    <AvatarFallback>
                      {professor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium">{professor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {professor.subject}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="vidéos" className="space-y-6 mt-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Toutes les vidéos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
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
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.subject}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base line-clamp-2">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={video.instructorAvatar || "/placeholder.svg"}
                        alt={video.instructor}
                      />
                      <AvatarFallback>
                        {video.instructor.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {video.instructor}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {video.uploadedAt}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="élève" className="space-y-6 mt-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Contenu pour élèves</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
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
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.subject}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base line-clamp-2">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={video.instructorAvatar || "/placeholder.svg"}
                        alt={video.instructor}
                      />
                      <AvatarFallback>
                        {video.instructor.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {video.instructor}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {video.uploadedAt}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* No Results */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier votre recherche ou explorez nos catégories.
          </p>
        </div>
      )}
    </div>
  );
}

export default async function Page({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const activeFilter = params.filter || "tout";

  // If no search query, show home page
  if (!query) {
    return <HomePage />;
  }

  // Filter logic for search results
  const filterVideos = (
    videos: typeof mockVideos,
    searchQuery: string,
    filter: string
  ) => {
    let filtered = videos;

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredVideos = filterVideos(mockVideos, query, activeFilter);

  // Filter professors based on search
  const filteredProfessors = mockProfessors.filter(
    (prof) =>
      prof.name.toLowerCase().includes(query.toLowerCase()) ||
      prof.subject.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SearchResults
      query={query}
      activeFilter={activeFilter}
      filteredVideos={filteredVideos}
      filteredProfessors={filteredProfessors}
    />
  );
}

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Filter, Play } from "lucide-react";
// import Image from "next/image";

// // Mock data - replace with your actual data source
// const mockVideos = [
//   {
//     id: 1,
//     title: "WH Questions - Complete Guide",
//     description: "Learn all about WH questions in English grammar",
//     subject: "Eng",
//     instructor: "Dr Nour",
//     instructorAvatar: "/placeholder.svg?height=32&width=32",
//     thumbnail: "/placeholder.svg?height=200&width=350",
//     duration: "4:56",
//     uploadedAt: "3 weeks ago",
//     featured: false,
//   },
//   {
//     id: 2,
//     title: "Les fonctions f(x) - Mathématiques",
//     description: "Comprendre les fonctions mathématiques de base",
//     subject: "Math",
//     instructor: "Dr Nora",
//     instructorAvatar: "/placeholder.svg?height=32&width=32",
//     thumbnail: "/placeholder.svg?height=200&width=350",
//     duration: "12:34",
//     uploadedAt: "1 week ago",
//     featured: true,
//   },
//   {
//     id: 3,
//     title: "Arab cours révisions des livres",
//     description: "Révision complète des cours d'arabe",
//     subject: "Arab",
//     instructor: "Dr Adem",
//     instructorAvatar: "/placeholder.svg?height=32&width=32",
//     thumbnail: "/placeholder.svg?height=200&width=350",
//     duration: "8:22",
//     uploadedAt: "2 weeks ago",
//     featured: false,
//   },
//   {
//     id: 4,
//     title: "Physique Quantique Introduction",
//     description: "Introduction aux concepts de base de la physique quantique",
//     subject: "Physique",
//     instructor: "Dr Sarah",
//     instructorAvatar: "/placeholder.svg?height=32&width=32",
//     thumbnail: "/placeholder.svg?height=200&width=350",
//     duration: "15:45",
//     uploadedAt: "4 days ago",
//     featured: true,
//   },
//   {
//     id: 5,
//     title: "Italian Grammar Basics",
//     description: "Learn the fundamentals of Italian grammar",
//     subject: "ITA",
//     instructor: "Dr Marco",
//     instructorAvatar: "/placeholder.svg?height=32&width=32",
//     thumbnail: "/placeholder.svg?height=200&width=350",
//     duration: "9:18",
//     uploadedAt: "1 week ago",
//     featured: false,
//   },
//   {
//     id: 6,
//     title: "Science Experiments for Beginners",
//     description: "Fun and educational science experiments",
//     subject: "Science",
//     instructor: "Dr Lisa",
//     instructorAvatar: "/placeholder.svg?height=32&width=32",
//     thumbnail: "/placeholder.svg?height=200&width=350",
//     duration: "11:30",
//     uploadedAt: "5 days ago",
//     featured: false,
//   },
//   {
//     id: 7,
//     title: "Voluptas et rem quo autem fugit voluptate",
//     description:
//       "Voluptas et rem quo autem fugit voluptate reprehenderit, ipsum ducimus ad sint dignissimos quo et.",
//     subject: "Math",
//     instructor: "RAYEN",
//     instructorAvatar: "/placeholder.svg?height=32&width=32",
//     thumbnail: "/placeholder.svg?height=300&width=500",
//     duration: "6:45",
//     uploadedAt: "2 days ago",
//     featured: true,
//   },
// ];

// const mockProfessors = [
//   {
//     name: "Dr Nour",
//     subject: "English",
//     avatar: "/placeholder.svg?height=48&width=48",
//   },
//   {
//     name: "Dr Nora",
//     subject: "Math",
//     avatar: "/placeholder.svg?height=48&width=48",
//   },
//   {
//     name: "Dr Adem",
//     subject: "Arab",
//     avatar: "/placeholder.svg?height=48&width=48",
//   },
//   {
//     name: "Dr Sarah",
//     subject: "Physique",
//     avatar: "/placeholder.svg?height=48&width=48",
//   },
//   {
//     name: "Dr Marco",
//     subject: "ITA",
//     avatar: "/placeholder.svg?height=48&width=48",
//   },
//   {
//     name: "Dr Lisa",
//     subject: "Science",
//     avatar: "/placeholder.svg?height=48&width=48",
//   },
//   {
//     name: "Dr Ahmed",
//     subject: "Math",
//     avatar: "/placeholder.svg?height=48&width=48",
//   },
//   {
//     name: "Dr Marie",
//     subject: "Eng",
//     avatar: "/placeholder.svg?height=48&width=48",
//   },
// ];

// interface SearchPageProps {
//   searchParams: Promise<{ query?: string; filter?: string }>;
// }

// // Home Page Component
// function HomePage() {
//   const subjects = ["All", "Math", "Science", "Physique", "Arab", "Eng", "ITA"];
//   const featuredVideo = mockVideos.find((video) => video.id === 7); // The main featured video
//   const explorerVideos = mockVideos
//     .filter((video) => video.id !== 7)
//     .slice(0, 3);

//   return (
//     <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
//       <Tabs defaultValue="all" className="w-full">
//         <TabsList className="flex flex-wrap gap-2 dark:bg-background/80 bg-background/80 border border-white/90">
//           {subjects.map((subject) => (
//             <TabsTrigger
//               key={subject}
//               value={subject.toLowerCase()}
//               className="px-4 py-1 cursor-pointer"
//             >
//               {subject}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//       </Tabs>

//       <section>
//         <h2 className="text-2xl font-bold mb-4">Featured</h2>
//         {featuredVideo && (
//           <Card>
//             <CardContent className="p-0">
//               <div className="grid md:grid-cols-2 gap-4 p-6">
//                 <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <Button
//                       size="icon"
//                       variant="outline"
//                       className="rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm"
//                     >
//                       <Play className="h-8 w-8" />
//                     </Button>
//                   </div>
//                   <Image
//                     src={featuredVideo.thumbnail || "/placeholder.svg"}
//                     height={300}
//                     width={500}
//                     alt="Featured video"
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//                 <div className="flex flex-col justify-between">
//                   <div>
//                     <h3 className="text-xl font-bold">{featuredVideo.title}</h3>
//                     <p className="text-muted-foreground mt-2">
//                       {featuredVideo.description}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2 mt-4">
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage
//                         src={
//                           featuredVideo.instructorAvatar || "/placeholder.svg"
//                         }
//                         alt={featuredVideo.instructor}
//                       />
//                       <AvatarFallback>
//                         {featuredVideo.instructor.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="text-sm font-medium">
//                         {featuredVideo.instructor}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         @{featuredVideo.instructor.toLowerCase()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </section>

//       <section>
//         <h2 className="text-2xl font-bold mb-4">Explorer</h2>
//         <div className="grid md:grid-cols-3 gap-6">
//           {explorerVideos.map((video) => (
//             <Card key={video.id} className="overflow-hidden">
//               <div className="relative aspect-video">
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Button
//                     size="icon"
//                     variant="outline"
//                     className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm"
//                   >
//                     <Play className="h-6 w-6" />
//                   </Button>
//                 </div>
//                 <Image
//                   height={200}
//                   width={350}
//                   src={video.thumbnail || "/placeholder.svg"}
//                   alt="Video thumbnail"
//                   className="object-cover w-full h-full"
//                 />
//                 <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
//                   {video.duration}
//                 </div>
//               </div>
//               <CardHeader className="p-4 pb-2">
//                 <CardTitle className="text-base">{video.title}</CardTitle>
//                 <CardDescription className="text-xs">
//                   {video.subject}
//                 </CardDescription>
//               </CardHeader>
//               <CardFooter className="p-4 pt-0 flex items-center gap-2">
//                 <Avatar className="h-6 w-6">
//                   <AvatarImage
//                     src={video.instructorAvatar || "/placeholder.svg"}
//                     alt="User"
//                   />
//                   <AvatarFallback>{video.instructor.charAt(0)}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="text-xs font-medium">{video.instructor}</p>
//                   <p className="text-xs text-muted-foreground">
//                     {video.uploadedAt}
//                   </p>
//                 </div>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// // Search Results Component
// function SearchResults({
//   query,
//   activeFilter,
//   filteredVideos,
//   filteredProfessors,
// }: {
//   query: string;
//   activeFilter: string;
//   filteredVideos: typeof mockVideos;
//   filteredProfessors: typeof mockProfessors;
// }) {
//   const featuredVideos = filteredVideos.filter((video) => video.featured);
//   const regularVideos = filteredVideos.filter((video) => !video.featured);
//   const subjects = ["Tout", "Professeur", "Vidéos", "Élève"];

//   return (
//     <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg min-h-screen">
//       {/* Search Results Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">
//             Résultats pour &quot;{query}&quot;
//           </h1>
//           <p className="text-muted-foreground">
//             {filteredVideos.length} vidéo
//             {filteredVideos.length !== 1 ? "s" : ""} trouvée
//             {filteredVideos.length !== 1 ? "s" : ""}
//           </p>
//         </div>
//         <Button variant="outline" size="sm">
//           <Filter className="h-4 w-4 mr-2" />
//           Filtrer
//         </Button>
//       </div>

//       {/* Filter Tabs */}
//       <Tabs defaultValue={activeFilter} className="w-full">
//         <TabsList className="flex flex-wrap gap-2 dark:bg-background/80 bg-background/80 border border-white/90">
//           {subjects.map((subject) => (
//             <TabsTrigger
//               key={subject}
//               value={subject.toLowerCase()}
//               className="px-4 py-1 cursor-pointer"
//             >
//               {subject}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <TabsContent value="tout" className="space-y-6 mt-6">
//           {/* Featured Section */}
//           {featuredVideos.length > 0 && (
//             <section>
//               <h2 className="text-2xl font-bold mb-4">À la une</h2>
//               <div className="grid gap-4">
//                 {featuredVideos.map((video) => (
//                   <Card key={video.id} className="overflow-hidden">
//                     <CardContent className="p-0">
//                       <div className="grid md:grid-cols-2 gap-4 p-6">
//                         <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
//                           <div className="absolute inset-0 flex items-center justify-center z-10">
//                             <Button
//                               size="icon"
//                               variant="outline"
//                               className="rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm"
//                             >
//                               <Play className="h-8 w-8" />
//                             </Button>
//                           </div>
//                           <Image
//                             src={video.thumbnail || "/placeholder.svg"}
//                             height={300}
//                             width={500}
//                             alt={video.title}
//                             className="object-cover w-full h-full"
//                           />
//                           <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
//                             {video.duration}
//                           </div>
//                         </div>
//                         <div className="flex flex-col justify-between">
//                           <div>
//                             <div className="flex items-center gap-2 mb-2">
//                               <Badge variant="secondary">{video.subject}</Badge>
//                             </div>
//                             <h3 className="text-xl font-bold mb-2">
//                               {video.title}
//                             </h3>
//                             <p className="text-muted-foreground">
//                               {video.description}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-2 mt-4">
//                             <Avatar className="h-8 w-8">
//                               <AvatarImage
//                                 src={
//                                   video.instructorAvatar || "/placeholder.svg"
//                                 }
//                                 alt={video.instructor}
//                               />
//                               <AvatarFallback>
//                                 {video.instructor.charAt(0)}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <p className="text-sm font-medium">
//                                 {video.instructor}
//                               </p>
//                               <p className="text-xs text-muted-foreground">
//                                 {video.uploadedAt}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Explorer Section */}
//           {regularVideos.length > 0 && (
//             <section>
//               <h2 className="text-2xl font-bold mb-4">Explorer</h2>
//               <div className="grid md:grid-cols-3 gap-6">
//                 {regularVideos.map((video) => (
//                   <Card
//                     key={video.id}
//                     className="overflow-hidden hover:shadow-lg transition-shadow"
//                   >
//                     <div className="relative aspect-video">
//                       <div className="absolute inset-0 flex items-center justify-center z-10">
//                         <Button
//                           size="icon"
//                           variant="outline"
//                           className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm"
//                         >
//                           <Play className="h-6 w-6" />
//                         </Button>
//                       </div>
//                       <Image
//                         height={200}
//                         width={350}
//                         src={video.thumbnail || "/placeholder.svg"}
//                         alt={video.title}
//                         className="object-cover w-full h-full"
//                       />
//                       <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
//                         {video.duration}
//                       </div>
//                       <div className="absolute top-2 left-2">
//                         <Badge variant="secondary" className="text-xs">
//                           {video.subject}
//                         </Badge>
//                       </div>
//                     </div>
//                     <CardHeader className="p-4 pb-2">
//                       <CardTitle className="text-base line-clamp-2">
//                         {video.title}
//                       </CardTitle>
//                       <CardDescription className="text-xs line-clamp-2">
//                         {video.description}
//                       </CardDescription>
//                     </CardHeader>
//                     <CardFooter className="p-4 pt-0 flex items-center gap-2">
//                       <Avatar className="h-6 w-6">
//                         <AvatarImage
//                           src={video.instructorAvatar || "/placeholder.svg"}
//                           alt={video.instructor}
//                         />
//                         <AvatarFallback>
//                           {video.instructor.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-medium truncate">
//                           {video.instructor}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           {video.uploadedAt}
//                         </p>
//                       </div>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Professor Suggestions */}
//           {filteredProfessors.length > 0 && (
//             <section>
//               <h2 className="text-2xl font-bold mb-4">
//                 Suggestions des Professeurs
//               </h2>
//               <div className="flex flex-wrap gap-4">
//                 {filteredProfessors.map((professor, index) => (
//                   <div
//                     key={index}
//                     className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
//                   >
//                     <Avatar className="h-16 w-16">
//                       <AvatarImage
//                         src={professor.avatar || "/placeholder.svg"}
//                         alt={professor.name}
//                       />
//                       <AvatarFallback>
//                         {professor.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="text-center">
//                       <p className="text-sm font-medium">{professor.name}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {professor.subject}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}
//         </TabsContent>

//         <TabsContent value="professeur" className="space-y-6 mt-6">
//           <section>
//             <h2 className="text-2xl font-bold mb-4">Professeurs</h2>
//             <div className="grid md:grid-cols-4 gap-4">
//               {filteredProfessors.map((professor, index) => (
//                 <Card
//                   key={index}
//                   className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
//                 >
//                   <Avatar className="h-20 w-20 mx-auto mb-3">
//                     <AvatarImage
//                       src={professor.avatar || "/placeholder.svg"}
//                       alt={professor.name}
//                     />
//                     <AvatarFallback>
//                       {professor.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <h3 className="font-medium">{professor.name}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     {professor.subject}
//                   </p>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         </TabsContent>

//         <TabsContent value="vidéos" className="space-y-6 mt-6">
//           <section>
//             <h2 className="text-2xl font-bold mb-4">Toutes les vidéos</h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {filteredVideos.map((video) => (
//                 <Card
//                   key={video.id}
//                   className="overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   <div className="relative aspect-video">
//                     <div className="absolute inset-0 flex items-center justify-center z-10">
//                       <Button
//                         size="icon"
//                         variant="outline"
//                         className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm"
//                       >
//                         <Play className="h-6 w-6" />
//                       </Button>
//                     </div>
//                     <Image
//                       height={200}
//                       width={350}
//                       src={video.thumbnail || "/placeholder.svg"}
//                       alt={video.title}
//                       className="object-cover w-full h-full"
//                     />
//                     <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
//                       {video.duration}
//                     </div>
//                     <div className="absolute top-2 left-2">
//                       <Badge variant="secondary" className="text-xs">
//                         {video.subject}
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardHeader className="p-4 pb-2">
//                     <CardTitle className="text-base line-clamp-2">
//                       {video.title}
//                     </CardTitle>
//                     <CardDescription className="text-xs line-clamp-2">
//                       {video.description}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardFooter className="p-4 pt-0 flex items-center gap-2">
//                     <Avatar className="h-6 w-6">
//                       <AvatarImage
//                         src={video.instructorAvatar || "/placeholder.svg"}
//                         alt={video.instructor}
//                       />
//                       <AvatarFallback>
//                         {video.instructor.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-medium truncate">
//                         {video.instructor}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {video.uploadedAt}
//                       </p>
//                     </div>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         </TabsContent>

//         <TabsContent value="élève" className="space-y-6 mt-6">
//           <section>
//             <h2 className="text-2xl font-bold mb-4">Contenu pour élèves</h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {filteredVideos.map((video) => (
//                 <Card
//                   key={video.id}
//                   className="overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   <div className="relative aspect-video">
//                     <div className="absolute inset-0 flex items-center justify-center z-10">
//                       <Button
//                         size="icon"
//                         variant="outline"
//                         className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm"
//                       >
//                         <Play className="h-6 w-6" />
//                       </Button>
//                     </div>
//                     <Image
//                       height={200}
//                       width={350}
//                       src={video.thumbnail || "/placeholder.svg"}
//                       alt={video.title}
//                       className="object-cover w-full h-full"
//                     />
//                     <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
//                       {video.duration}
//                     </div>
//                     <div className="absolute top-2 left-2">
//                       <Badge variant="secondary" className="text-xs">
//                         {video.subject}
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardHeader className="p-4 pb-2">
//                     <CardTitle className="text-base line-clamp-2">
//                       {video.title}
//                     </CardTitle>
//                     <CardDescription className="text-xs line-clamp-2">
//                       {video.description}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardFooter className="p-4 pt-0 flex items-center gap-2">
//                     <Avatar className="h-6 w-6">
//                       <AvatarImage
//                         src={video.instructorAvatar || "/placeholder.svg"}
//                         alt={video.instructor}
//                       />
//                       <AvatarFallback>
//                         {video.instructor.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-medium truncate">
//                         {video.instructor}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {video.uploadedAt}
//                       </p>
//                     </div>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         </TabsContent>
//       </Tabs>

//       {/* No Results */}
//       {filteredVideos.length === 0 && (
//         <div className="text-center py-12">
//           <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
//           <p className="text-muted-foreground">
//             Essayez de modifier votre recherche ou explorez nos catégories.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default async function Page({ searchParams }: SearchPageProps) {
//   const params = await searchParams;
//   const query = params.query || "";
//   const activeFilter = params.filter || "tout";

//   // If no search query, show home page
//   if (!query) {
//     return <HomePage />;
//   }

//   // Filter logic for search results
//   const filterVideos = (
//     videos: typeof mockVideos,
//     searchQuery: string,
//     filter: string
//   ) => {
//     let filtered = videos;

//     // Apply search query filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (video) =>
//           video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           video.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           video.instructor.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     return filtered;
//   };

//   const filteredVideos = filterVideos(mockVideos, query, activeFilter);

//   // Filter professors based on search
//   const filteredProfessors = mockProfessors.filter(
//     (prof) =>
//       prof.name.toLowerCase().includes(query.toLowerCase()) ||
//       prof.subject.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <SearchResults
//       query={query}
//       activeFilter={activeFilter}
//       filteredVideos={filteredVideos}
//       filteredProfessors={filteredProfessors}
//     />
//   );
// }

// // import { Button } from "@/components/common/buttons/Button";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Play } from "lucide-react";
// // import Image from "next/image";

// // export default async function Home({ query }: { query: string }) {
// //   console.log("Query:", query);

// //   const subjects = ["All", "Math", "Science", "Physique", "Arab", "Eng", "ITA"];

// //   return (
// //     <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg ">
// //       <Tabs defaultValue="all" className="w-full">
// //         <TabsList className="flex flex-wrap gap-2 dark:bg-background/80 bg-background/80 border border-white/90 ">
// //           {subjects.map((subject) => (
// //             <TabsTrigger
// //               key={subject}
// //               value={subject.toLowerCase()}
// //               className=" px-4 py-1 cursor-pointer"
// //             >
// //               {subject}
// //             </TabsTrigger>
// //           ))}
// //         </TabsList>
// //       </Tabs>

// //       <section>
// //         <h2 className="text-2xl font-bold mb-4">Featured</h2>
// //         <Card>
// //           <CardContent className="p-0">
// //             <div className="grid md:grid-cols-2 gap-4 p-6">
// //               <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
// //                 <div className="absolute inset-0 flex items-center justify-center">
// //                   <Button
// //                     size="icon"
// //                     variant="outline"
// //                     className="rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm"
// //                   >
// //                     <Play className="h-8 w-8" />
// //                   </Button>
// //                 </div>
// //                 <Image
// //                   src="/placeholder.svg?height=300&width=500"
// //                   height={300}
// //                   width={500}
// //                   alt="Featured video"
// //                   className="object-cover w-full h-full"
// //                 />
// //               </div>
// //               <div className="flex flex-col justify-between">
// //                 <div>
// //                   <h3 className="text-xl font-bold">
// //                     Voluptas et rem quo autem fugit voluptate
// //                   </h3>
// //                   <p className="text-muted-foreground mt-2">
// //                     Voluptas et rem quo autem fugit voluptate reprehenderit,
// //                     ipsum ducimus ad sint dignissimos quo et.
// //                   </p>
// //                 </div>
// //                 <div className="flex items-center gap-2 mt-4">
// //                   <Avatar className="h-8 w-8">
// //                     <AvatarImage
// //                       src="/placeholder.svg?height=32&width=32"
// //                       alt="Rayen"
// //                     />
// //                     <AvatarFallback>R</AvatarFallback>
// //                   </Avatar>
// //                   <div>
// //                     <p className="text-sm font-medium">RAYEN</p>
// //                     <p className="text-xs text-muted-foreground">@rayen</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </section>

// //       <section>
// //         <h2 className="text-2xl font-bold mb-4">Explorer</h2>
// //         <div className="grid md:grid-cols-3 gap-6">
// //           {[1, 2, 3].map((item) => (
// //             <Card key={item} className="overflow-hidden">
// //               <div className="relative aspect-video">
// //                 <div className="absolute inset-0 flex items-center justify-center">
// //                   <Button
// //                     size="icon"
// //                     variant="outline"
// //                     className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm"
// //                   >
// //                     <Play className="h-6 w-6" />
// //                   </Button>
// //                 </div>
// //                 <Image
// //                   height={200}
// //                   width={350}
// //                   src="/placeholder.svg?height=200&width=350"
// //                   alt="Video thumbnail"
// //                   className="object-cover w-full h-full"
// //                 />
// //                 <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
// //                   4:56
// //                 </div>
// //               </div>
// //               <CardHeader className="p-4 pb-2">
// //                 <CardTitle className="text-base">
// //                   {item === 1
// //                     ? "WH Questions"
// //                     : item === 2
// //                     ? "Les fonctions f(x)"
// //                     : "Arab cours revisions des livres"}
// //                 </CardTitle>
// //                 <CardDescription className="text-xs">
// //                   {item === 1 ? "English" : item === 2 ? "Math" : "Arab"}
// //                 </CardDescription>
// //               </CardHeader>
// //               <CardFooter className="p-4 pt-0 flex items-center gap-2">
// //                 <Avatar className="h-6 w-6">
// //                   <AvatarImage
// //                     src="/placeholder.svg?height=24&width=24"
// //                     alt="User"
// //                   />
// //                   <AvatarFallback>
// //                     {item === 1 ? "D" : item === 2 ? "N" : "A"}
// //                   </AvatarFallback>
// //                 </Avatar>
// //                 <div>
// //                   <p className="text-xs font-medium">
// //                     {item === 1
// //                       ? "Dr Nour"
// //                       : item === 2
// //                       ? "Dr Nora"
// //                       : "Dr Adem"}
// //                   </p>
// //                   <p className="text-xs text-muted-foreground">3 weeks ago</p>
// //                 </div>
// //               </CardFooter>
// //             </Card>
// //           ))}
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }
