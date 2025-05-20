"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Teacher {
  id: string;
  first_name: string;
  last_name?: string;
  profile_url: string | null;
}

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  created_at: string;
  views: number;
  branch?: string;
  class?: string;
  subject?: string;
  teacher: Teacher;
}

export default function WatchHistory({
  watchedVideos,
}: {
  readonly watchedVideos: RelatedVideo[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data based on the interface
  // const watchedVideos: RelatedVideo[] = watchedVideos;

  // Filter videos based on search query
  const filteredVideos = watchedVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Recently watched section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Récemment regardé</h2>
          <div className="space-y-4">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="flex border-b border-gray-200 pb-4"
              >
                <div className="relative h-[90px] w-[160px] flex-shrink-0">
                  <Image
                    src={
                      video.thumbnail_url ?? "/images/placeholder-thumbnail.jpg"
                    }
                    alt={video.title}
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 5V19L19 12L8 5Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-medium text-base">{video.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {video.branch && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {video.branch}
                        </span>
                      )}
                      {video.class && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {video.class}
                        </span>
                      )}
                      {video.subject && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {video.subject}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>
                      Date du post : {formatDate(video.created_at)} ·{" "}
                      {video.views} vues
                    </p>
                    <p>
                      Professeur: {video.teacher.first_name}{" "}
                      {video.teacher.last_name || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last 7 days section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Dernier 7 jrs</h2>
          {/* This would typically be filtered by date, but for demo purposes we'll reuse the same videos */}
          <div className="space-y-4">
            {filteredVideos.slice(0, 3).map((video) => (
              <div
                key={`recent-${video.id}`}
                className="flex border-b border-gray-200 pb-4"
              >
                <div className="relative h-[90px] w-[160px] flex-shrink-0">
                  <Image
                    src={
                      video.thumbnail_url ||
                      "/placeholder.svg?height=90&width=160"
                    }
                    alt={video.title}
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 5V19L19 12L8 5Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-medium text-base">{video.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {video.branch && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {video.branch}
                        </span>
                      )}
                      {video.class && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {video.class}
                        </span>
                      )}
                      {video.subject && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {video.subject}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>
                      Date du post : {formatDate(video.created_at)} ·{" "}
                      {video.views} vues
                    </p>
                    <p>
                      Professeur: {video.teacher.first_name}{" "}
                      {video.teacher.last_name || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
