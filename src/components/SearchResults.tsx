"use client";

import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
import { FilterModal } from "@/components/modals/FilterModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RelatedVideo } from "@/types/RelatedVideos.interface";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

// Helper function to get user display name
function getUserName(user: any): string {
  if (!user) return "Utilisateur";
  return (
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Utilisateur"
  );
}

interface SearchResultsClientProps {
  readonly query: string;
  readonly activeFilter: string;
  readonly initialVideos: RelatedVideo[];
  readonly searchTeachers: any[];
  readonly searchStudents: any[];
}

export function SearchResultsClient({
  query,
  activeFilter,
  initialVideos,
  searchTeachers,
  searchStudents,
}: SearchResultsClientProps) {
  const [filteredVideos, setFilteredVideos] =
    useState<RelatedVideo[]>(initialVideos);
  const [currentTab, setCurrentTab] = useState(activeFilter);
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjects = ["Tout", "Professeur", "Vidéos", "Élève"];

  const handleFiltersChange = (videos: RelatedVideo[]) => {
    setFilteredVideos(videos);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    // Update URL with new filter
    const params = new URLSearchParams(searchParams);
    params.set("filter", value);
    router.push(`?${params.toString()}`);
  };

  // Get total results count based on current tab
  const getTotalResults = () => {
    switch (currentTab) {
      case "tout":
        return (
          filteredVideos.length + searchTeachers.length + searchStudents.length
        );
      case "professeur":
        return searchTeachers.length;
      case "vidéos":
        return filteredVideos.length;
      case "élève":
        return searchStudents.length;
      default:
        return (
          filteredVideos.length + searchTeachers.length + searchStudents.length
        );
    }
  };

  const totalResults = getTotalResults();

  return (
    <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg min-h-screen">
      {/* Search Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Résultats pour &quot;{query}&quot;
          </h1>
          <p className="text-muted-foreground">
            {totalResults} résultat{totalResults !== 1 ? "s" : ""} trouvé
            {totalResults !== 1 ? "s" : ""}
          </p>
        </div>
        <FilterModal
          searchVideos={initialVideos}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex flex-wrap gap-2 dark:bg-background/80 bg-background/80 border border-white/90">
          {subjects.map((subject) => (
            <TabsTrigger
              key={subject}
              value={subject.toLowerCase()}
              className="px-4 py-1 cursor-pointer"
            >
              {subject}
              {subject === "Tout" && ` (${totalResults})`}
              {subject === "Professeur" && ` (${searchTeachers.length})`}
              {subject === "Vidéos" && ` (${filteredVideos.length})`}
              {subject === "Élève" && ` (${searchStudents.length})`}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Results Tab */}
        <TabsContent value="tout" className="space-y-6 mt-6">
          {/* Videos Section */}
          {filteredVideos.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Vidéos ({filteredVideos.length})
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <ExplorerVideo
                    key={video.id}
                    video={video}
                    user={video.teacher}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Teachers Section */}
          {searchTeachers.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Professeurs ({searchTeachers.length})
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                {searchTeachers.map((teacher) => (
                  <Card
                    key={teacher.id}
                    className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarImage
                        src={teacher.profile_url || "/placeholder.svg"}
                        alt={getUserName(teacher)}
                      />
                      <AvatarFallback>
                        {getUserName(teacher)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{getUserName(teacher)}</h3>
                    <p className="text-sm text-muted-foreground">Professeur</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Students Section */}
          {searchStudents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Élèves ({searchStudents.length})
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                {searchStudents.map((student) => (
                  <Card
                    key={student.id}
                    className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarImage
                        src={student.profile_url || "/placeholder.svg"}
                        alt={getUserName(student)}
                      />
                      <AvatarFallback>
                        {getUserName(student)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{getUserName(student)}</h3>
                    <p className="text-sm text-muted-foreground">Élève</p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </TabsContent>

        {/* Teachers Only Tab */}
        <TabsContent value="professeur" className="space-y-6 mt-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Professeurs ({searchTeachers.length})
            </h2>
            {searchTeachers.length > 0 ? (
              <div className="grid md:grid-cols-4 gap-4">
                {searchTeachers.map((teacher) => (
                  <Card
                    key={teacher.id}
                    className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarImage
                        src={teacher.profile_url || "/placeholder.svg"}
                        alt={getUserName(teacher)}
                      />
                      <AvatarFallback>
                        {getUserName(teacher)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{getUserName(teacher)}</h3>
                    <p className="text-sm text-muted-foreground">Professeur</p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">
                  Aucun professeur trouvé
                </h3>
                <p className="text-muted-foreground">
                  Aucun professeur ne correspond à votre recherche &quot;{query}
                  &quot;.
                </p>
              </div>
            )}
          </section>
        </TabsContent>

        {/* Videos Only Tab */}
        <TabsContent value="vidéos" className="space-y-6 mt-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Toutes les vidéos ({filteredVideos.length})
            </h2>
            {filteredVideos.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <ExplorerVideo
                    key={video.id}
                    video={video}
                    user={video.teacher}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">
                  Aucune vidéo trouvée
                </h3>
                <p className="text-muted-foreground">
                  Aucune vidéo ne correspond à votre recherche &quot;{query}
                  &quot;.
                </p>
              </div>
            )}
          </section>
        </TabsContent>

        {/* Students Only Tab */}
        <TabsContent value="élève" className="space-y-6 mt-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Élèves ({searchStudents.length})
            </h2>
            {searchStudents.length > 0 ? (
              <div className="grid md:grid-cols-4 gap-4">
                {searchStudents.map((student) => (
                  <Card
                    key={student.id}
                    className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarImage
                        src={student.profile_url || "/placeholder.svg"}
                        alt={getUserName(student)}
                      />
                      <AvatarFallback>
                        {getUserName(student)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{getUserName(student)}</h3>
                    <p className="text-sm text-muted-foreground">Élève</p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Aucun élève trouvé</h3>
                <p className="text-muted-foreground">
                  Aucun élève ne correspond à votre recherche &quot;{query}
                  &quot;.
                </p>
              </div>
            )}
          </section>
        </TabsContent>
      </Tabs>

      {/* No Results - Only show when all categories are empty */}
      {filteredVideos.length === 0 &&
        searchTeachers.length === 0 &&
        searchStudents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier votre recherche &quot;{query}&quot; ou
              explorez nos catégories.
            </p>
          </div>
        )}
    </div>
  );
}
// "use client";

// import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
// import { FilterModal } from "@/components/modals/FilterModal";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import type { RelatedVideo } from "@/types/RelatedVideos.interface";
// import { Play } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";

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

// interface SearchResultsClientProps {
//   readonly query: string;
//   readonly activeFilter: string;
//   readonly initialVideos: RelatedVideo[];
//   readonly searchTeachers: any[];
//   readonly searchStudents: any[];
// }

// export function SearchResultsClient({
//   query,
//   activeFilter,
//   initialVideos,
//   searchTeachers,
//   searchStudents,
// }: SearchResultsClientProps) {
//   const [filteredVideos, setFilteredVideos] =
//     useState<RelatedVideo[]>(initialVideos);
//   const subjects = ["Tout", "Professeur", "Vidéos", "Élève"];

//   const handleFiltersChange = (videos: RelatedVideo[]) => {
//     setFilteredVideos(videos);
//   };

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
//         <FilterModal
//           searchVideos={initialVideos}
//           onFiltersChange={handleFiltersChange}
//         />
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
//           {filteredVideos.length > 0 && (
//             <section>
//               <h2 className="text-2xl font-bold mb-4">Vidéos</h2>
//               <div className="grid md:grid-cols-3 gap-6">
//                 {filteredVideos.map((video) => (
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
//                       src={video.thumbnail_url || "/placeholder.svg"}
//                       alt={video.title}
//                       className="object-cover w-full h-full"
//                     />
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
//                       src={video.thumbnail_url || "/placeholder.svg"}
//                       alt={video.title}
//                       className="object-cover w-full h-full"
//                     />
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
//       {filteredVideos.length === 0 && searchTeachers.length === 0 && (
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
