import {
  getHomePageVideos,
  getSearchResults,
} from "@/actions/home/homeVideos.action";
import { SearchResultsClient } from "@/components/SearchResults";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "lucide-react";
import Image from "next/image";
import ExplorerVideo from "./(videos)/_components/videos/ExplorerVideo";

interface SearchPageProps {
  searchParams: Promise<{ query?: string; filter?: string }>;
}

// Helper function to format duration (assuming duration is in seconds)
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Helper function to format upload date
function formatUploadDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 jour";
  if (diffDays < 7) return `${diffDays} jours`;
  if (diffDays < 30)
    return `${Math.ceil(diffDays / 7)} semaine${
      Math.ceil(diffDays / 7) > 1 ? "s" : ""
    }`;
  return `${Math.ceil(diffDays / 30)} mois`;
}

// Helper function to get teacher display name
function getTeacherName(teacher: any): string {
  if (!teacher) return "Professeur";
  return (
    `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() ||
    "Professeur"
  );
}

// Home Page Component
async function HomePage() {
  const subjects = ["All", "Math", "Science", "Physique", "Arab", "Eng", "ITA"];

  const { success, featuredVideo, explorerVideos } = await getHomePageVideos();

  if (!success) {
    return (
      <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="text-muted-foreground">
            Impossible de charger les vidéos. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

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

      {/* Featured Section */}
      {featuredVideo && (
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
                    src={featuredVideo.thumbnail_url || "/placeholder.svg"}
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
                          featuredVideo.teacher?.profile_url ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={getTeacherName(featuredVideo.teacher)}
                      />
                      <AvatarFallback>
                        {getTeacherName(featuredVideo.teacher).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {getTeacherName(featuredVideo.teacher)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @
                        {getTeacherName(featuredVideo.teacher)
                          .toLowerCase()
                          .replace(" ", "")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Explorer Section */}
      {explorerVideos.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Explorer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {explorerVideos.map((video) => (
              <ExplorerVideo
                key={video.id}
                video={video}
                user={video.teacher}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default async function Page({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const activeFilter = params.filter || "tout";

  // If no search query, show home page with all videos
  if (!query) {
    return <HomePage />;
  }

  // Get search results
  const {
    success,
    videos: searchVideos,
    teachers: searchTeachers,
  } = await getSearchResults(query);

  if (!success) {
    return (
      <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg min-h-screen">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Erreur de recherche</h3>
          <p className="text-muted-foreground">
            Impossible d&apos;effectuer la recherche. Veuillez réessayer plus
            tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SearchResultsClient
      query={query}
      activeFilter={activeFilter}
      initialVideos={searchVideos}
      searchTeachers={searchTeachers}
    />
  );
}

// import {
//   getHomePageVideos,
//   getSearchResults,
// } from "@/actions/home/homeVideos.action";
// import { FilterModal } from "@/components/modals/FilterModal";
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
// import { RelatedVideo } from "@/types/RelatedVideos.interface";
// import { Play } from "lucide-react";
// import Image from "next/image";
// import ExplorerVideo from "./(videos)/_components/videos/ExplorerVideo";

// interface SearchPageProps {
//   searchParams: Promise<{ query?: string; filter?: string }>;
// }

// // Helper function to format duration (assuming duration is in seconds)
// function formatDuration(seconds: number): string {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
// }

// // Helper function to format upload date
// function formatUploadDate(dateString: string): string {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffTime = Math.abs(now.getTime() - date.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   if (diffDays === 1) return "1 jour";
//   if (diffDays < 7) return `${diffDays} jours`;
//   if (diffDays < 30)
//     return `${Math.ceil(diffDays / 7)} semaine${
//       Math.ceil(diffDays / 7) > 1 ? "s" : ""
//     }`;
//   return `${Math.ceil(diffDays / 30)} mois`;
// }

// // Helper function to get teacher display name
// function getTeacherName(teacher: any): string {
//   if (!teacher) return "Professeur";
//   return (
//     `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() ||
//     "Professeur"
//   );
// }

// // Home Page Component
// async function HomePage() {
//   const subjects = ["All", "Math", "Science", "Physique", "Arab", "Eng", "ITA"];

//   const { success, featuredVideo, explorerVideos } = await getHomePageVideos();

//   if (!success) {
//     return (
//       <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
//         <div className="text-center py-12">
//           <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
//           <p className="text-muted-foreground">
//             Impossible de charger les vidéos. Veuillez réessayer plus tard.
//           </p>
//         </div>
//       </div>
//     );
//   }

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

//       {/* Featured Section */}
//       {featuredVideo && (
//         <section>
//           <h2 className="text-2xl font-bold mb-4">Featured</h2>
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
//                     src={featuredVideo.thumbnail_url || "/placeholder.svg"}
//                     height={300}
//                     width={500}
//                     alt="Featured video"
//                     className="object-cover w-full h-full"
//                   />
//                   {/* {featuredVideo.duration && (
//                     <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
//                       {formatDuration(featuredVideo.duration)}
//                     </div>
//                   )} */}
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
//                           featuredVideo.teacher?.profile_url ||
//                           "/placeholder.svg"
//                         }
//                         alt={getTeacherName(featuredVideo.teacher)}
//                       />
//                       <AvatarFallback>
//                         {getTeacherName(featuredVideo.teacher).charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="text-sm font-medium">
//                         {getTeacherName(featuredVideo.teacher)}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         @
//                         {getTeacherName(featuredVideo.teacher)
//                           .toLowerCase()
//                           .replace(" ", "")}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </section>
//       )}

//       {/* Explorer Section */}
//       {explorerVideos.length > 0 && (
//         <section>
//           <h2 className="text-2xl font-bold mb-4">Explorer</h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {explorerVideos.map((video) => (
//               <ExplorerVideo
//                 key={video.id}
//                 video={video}
//                 user={video.teacher}
//               />
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }

// function SearchResults({
//   query,
//   activeFilter,
//   searchVideos,
//   searchTeachers,
// }: {
//   query: string;
//   activeFilter: string;
//   searchVideos: RelatedVideo[];
//   searchTeachers: any[];
// }) {
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
//             {searchVideos.length} vidéo
//             {searchVideos.length !== 1 ? "s" : ""} trouvée
//             {searchVideos.length !== 1 ? "s" : ""}
//           </p>
//         </div>
//         <FilterModal searchVideos={searchVideos} />
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
//           {/* Videos Section */}
//           {searchVideos.length > 0 && (
//             <section>
//               <h2 className="text-2xl font-bold mb-4">Vidéos</h2>
//               <div className="grid md:grid-cols-3 gap-6">
//                 {searchVideos.map((video) => (
//                   <ExplorerVideo
//                     key={video.id}
//                     video={video}
//                     user={video.teacher}
//                   />
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Professor Suggestions */}
//           {searchTeachers.length > 0 && (
//             <section>
//               <h2 className="text-2xl font-bold mb-4">
//                 Suggestions des Professeurs
//               </h2>
//               <div className="flex flex-wrap gap-4">
//                 {searchTeachers.map((teacher) => (
//                   <div
//                     key={teacher.id}
//                     className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
//                   >
//                     <Avatar className="h-16 w-16">
//                       <AvatarImage
//                         src={teacher.profile_url || "/placeholder.svg"}
//                         alt={getTeacherName(teacher)}
//                       />
//                       <AvatarFallback>
//                         {getTeacherName(teacher)
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="text-center">
//                       <p className="text-sm font-medium">
//                         {getTeacherName(teacher)}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         Professeur
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
//               {searchTeachers.map((teacher) => (
//                 <Card
//                   key={teacher.id}
//                   className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
//                 >
//                   <Avatar className="h-20 w-20 mx-auto mb-3">
//                     <AvatarImage
//                       src={teacher.profile_url || "/placeholder.svg"}
//                       alt={getTeacherName(teacher)}
//                     />
//                     <AvatarFallback>
//                       {getTeacherName(teacher)
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <h3 className="font-medium">{getTeacherName(teacher)}</h3>
//                   <p className="text-sm text-muted-foreground">Professeur</p>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         </TabsContent>

//         <TabsContent value="vidéos" className="space-y-6 mt-6">
//           <section>
//             <h2 className="text-2xl font-bold mb-4">Toutes les vidéos</h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {searchVideos.map((video) => (
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
//                       src={video.thumbnail_url || "/placeholder.svg"}
//                       alt={video.title}
//                       className="object-cover w-full h-full"
//                     />
//                     {/* {video.duration && (
//                       <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
//                         {formatDuration(video.duration)}
//                       </div>
//                     )} */}
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
//                         src={video.teacher?.profile_url || "/placeholder.svg"}
//                         alt={getTeacherName(video.teacher)}
//                       />
//                       <AvatarFallback>
//                         {getTeacherName(video.teacher).charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-medium truncate">
//                         {getTeacherName(video.teacher)}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {formatUploadDate(video.created_at)}
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
//               {searchVideos.map((video) => (
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
//                       src={video.thumbnail_url || "/placeholder.svg"}
//                       alt={video.title}
//                       className="object-cover w-full h-full"
//                     />
//                     {/* {video.duration && (
//                       <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
//                         {formatDuration(video.duration)}
//                       </div>
//                     )} */}
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
//                         src={video.teacher?.profile_url || "/placeholder.svg"}
//                         alt={getTeacherName(video.teacher)}
//                       />
//                       <AvatarFallback>
//                         {getTeacherName(video.teacher).charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-medium truncate">
//                         {getTeacherName(video.teacher)}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         {formatUploadDate(video.created_at)}
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
//       {searchVideos.length === 0 && searchTeachers.length === 0 && (
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

//   // If no search query, show home page with all videos
//   if (!query) {
//     return <HomePage />;
//   }

//   // Get search results
//   const {
//     success,
//     videos: searchVideos,
//     teachers: searchTeachers,
//   } = await getSearchResults(query);

//   if (!success) {
//     return (
//       <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg min-h-screen">
//         <div className="text-center py-12">
//           <h3 className="text-lg font-medium mb-2">Erreur de recherche</h3>
//           <p className="text-muted-foreground">
//             Impossible d&apos;effectuer la recherche. Veuillez réessayer plus
//             tard.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <SearchResults
//       query={query}
//       activeFilter={activeFilter}
//       searchVideos={searchVideos}
//       searchTeachers={searchTeachers}
//     />
//   );
// }
