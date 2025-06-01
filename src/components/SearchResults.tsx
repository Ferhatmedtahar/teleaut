"use client";

import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
import TeacherCard from "@/app/(root)/profile/_components/stduentSugguestion/TeacherCard";
import { FilterModal } from "@/components/modals/FilterModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RelatedVideo } from "@/types/RelatedVideos.interface";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./common/buttons/Button";

function getUserName(user: any): string {
  if (!user) return "Utilisateur";
  return (
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Utilisateur"
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

  useEffect(() => {
    console.log(
      "initialVideos changed, updating filteredVideos:",
      initialVideos.length
    );
    setFilteredVideos(initialVideos);
  }, [initialVideos]);

  const subjects = ["Tout", "Professeur", "Vidéos", "Élève"];

  const handleFiltersChange = (videos: RelatedVideo[]) => {
    console.log("Filter applied, new filtered count:", videos.length);
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
      <div>
        <Button
          variant="outline"
          className="mt-2 dark:hover:text-white dark:hover:bg-primary-900/50 hover:bg-primary-50/50 hover:cursor-pointer"
        >
          <Link className="text-sm flex items-center" href="/">
            <ArrowLeft className="mr-2 size-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
      {/* Search Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Résultats pour &quot;{query}&quot;
          </h1>
          <p className=" text-primary-900  dark:text-primary-100">
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
        <div className="w-full overflow-x-auto">
          <TabsList className="flex w-max min-w-full md:w-full md:flex-wrap md:gap-2 dark:bg-background/80 bg-background/80 border border-border/20 dark:border-border/70">
            {subjects.map((subject) => (
              <TabsTrigger
                key={subject}
                value={subject.toLowerCase()}
                className="flex-shrink-0 px-3 py-2 text-sm md:px-4 md:py-1 cursor-pointer whitespace-nowrap"
              >
                <span
                  className={`hidden md:inline     font-medium ${
                    currentTab === subject.toLowerCase()
                      ? "text-white/95 dark:text-primary-50"
                      : "text-primary-900 dark:text-primary-200"
                  }`}
                >
                  {subject}
                  {subject === "Tout" && ` (${totalResults})`}
                  {subject === "Professeur" && ` (${searchTeachers.length})`}
                  {subject === "Vidéos" && ` (${filteredVideos.length})`}
                  {subject === "Élève" && ` (${searchStudents.length})`}
                </span>
                <span className="md:hidden text-primary-900  dark:text-primary-100 ">
                  {subject === "Tout" && "Tout"}
                  {subject === "Professeur" && "Prof"}
                  {subject === "Vidéos" && "Vidéos"}
                  {subject === "Élève" && "Élève"}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {/* </TabsList> */}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {searchTeachers?.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
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
                        src={
                          student.profile_url ??
                          "/images/placeholder-profile.png"
                        }
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
                    <p className="text-sm text-primary-900  dark:text-primary-100 ">
                      Élève
                    </p>
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
                        src={
                          teacher.profile_url ??
                          "/images/placeholder-profile.png"
                        }
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
                    <p className="text-sm text-primary-900  dark:text-primary-100 ">
                      Professeur
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">
                  Aucun professeur trouvé
                </h3>
                <p className=" text-primary-900  dark:text-primary-100">
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
              {/* FIXED: Pass initialVideos (current search results) instead of filtered */}

              {filteredVideos.length > 0 && (
                <FilterModal
                  searchVideos={initialVideos}
                  onFiltersChange={handleFiltersChange}
                />
              )}
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
                <p className=" text-primary-900  dark:text-primary-100">
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
              <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-5 gap-4">
                {searchStudents.map((student) => (
                  <Card
                    key={student.id}
                    className=" text-center border-border/20 dark:border-border/70 hover:shadow-lg transition-shadow hover:shadow-border/15 cursor-pointer gap-2 "
                  >
                    <Link href={`/profile/${student.id}`}>
                      <Avatar className="h-20 w-20 mx-auto mb-3">
                        <AvatarImage
                          src={
                            student.profile_url ??
                            "/images/placeholder-profile.png"
                          }
                          alt={getUserName(student)}
                        />
                        <AvatarFallback>
                          {getUserName(student)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <h3 className="font-medium">{getUserName(student)}</h3>
                    <p className="text-sm  text-primary-900  dark:text-primary-100">
                      Élève
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Aucun élève trouvé</h3>
                <p className=" text-primary-900  dark:text-primary-100">
                  Aucun élève ne correspond à votre recherche &quot;{query}
                  &quot;.
                </p>
              </div>
            )}
          </section>
        </TabsContent>
      </Tabs>

      {/* No Results - Only show when all categories are empty */}
      {/* {filteredVideos.length === 0 &&
        searchTeachers.length === 0 &&
        searchStudents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier votre recherche &quot;{query}&quot; ou
              explorez nos catégories.
            </p>
          </div>
        )} */}

      {filteredVideos.length === 0 && activeFilter === "tout" && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
          <p className=" text-primary-900  dark:text-primary-100">
            Essayez de modifier votre recherche &quot;{query}&quot; ou explorez
            nos catégories.
          </p>
        </div>
      )}
    </div>
  );
}
