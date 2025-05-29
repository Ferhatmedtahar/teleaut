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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                Toutes les vidéos ({filteredVideos.length})
              </h2>
              {/* Secondary FilterModal button for the videos tab */}
              <FilterModal
                searchVideos={initialVideos}
                onFiltersChange={handleFiltersChange}
              />
            </div>
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
