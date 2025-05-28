"use client";

import { Input } from "@/components/ui/input";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { Search } from "lucide-react";
import { useState } from "react";
import VideoHistory from "./VideoHistory";

export default function WatchHistory({
  watchedVideos,
}: {
  readonly watchedVideos: RelatedVideo[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = watchedVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // video.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.branch?.some((branch) =>
        branch.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      `${video.teacher.first_name} ${video.teacher.last_name ?? ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-semibold">Historique des vidéos</h1>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="search"
            className="block w-full pl-10 pr-3 py-2"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Recently watched section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Récemment regardé</h2>
          <div className="space-y-4">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <VideoHistory key={video.id} video={video} />
              ))
            ) : (
              <p className="text-primary-900   dark:text-primary-100">
                Aucun résultat trouvé pour &quot;{searchQuery}&quot;. Essayez
                d&apos;autres mots-clés ou vérifiez l&apos;orthographe.
              </p>
            )}
          </div>
        </div>

        {/* Last 7 days section */}
        <div>
          {filteredVideos.length > 0 && (
            <h2 className="text-lg font-medium mb-4">Dernier 7 jrs</h2>
          )}

          {/* This would typically be filtered by date, but for demo purposes we'll reuse the same videos */}
          <div className="space-y-4">
            {filteredVideos.length > 0
              ? filteredVideos
                  .slice(0, 3)
                  .map((video) => <VideoHistory key={video.id} video={video} />)
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
