"use client";

import {
  deleteVideoRating,
  getUserRating,
  getVideoRatingStats,
  setVideoRating,
} from "@/actions/videos/likes";
import { Button } from "@/components/common/buttons/Button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { toast } from "sonner";
import RenderStars from "./RenderStars";
import ShareLink from "./ShareLink";

interface VideoInfoProps {
  readonly video: {
    readonly id: string;
    readonly title: string;
    readonly created_at: string;
    readonly views: number;
    readonly class: string;
    readonly branch: string[];
    readonly teacher: {
      id: string;
      first_name: string;
      last_name?: string;
      profile_url: string | null;
    };
  };
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalRatings: 0,
  });
  const [userRating, setUserRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchRatingData = async () => {
      const [{ data: statsData }, { data: userRatingData }] = await Promise.all(
        [getVideoRatingStats(video.id), getUserRating(video.id)]
      );

      setRatingStats(statsData);
      setUserRating(userRatingData);
      setSelectedRating(userRatingData);
      setShowDeleteButton(userRatingData !== null);
    };

    fetchRatingData();
  }, [video.id]);

  // Show submit button when selection differs from current rating
  useEffect(() => {
    if (selectedRating !== null && selectedRating !== userRating) {
      setShowSubmitButton(true);
    } else {
      setShowSubmitButton(false);
    }
  }, [selectedRating, userRating]);

  const handleRatingSelection = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmitRating = async () => {
    if (selectedRating === null) return;

    setIsLoading(true);

    const result = await setVideoRating(video.id, selectedRating);
    console.log("Rating result:", result);
    if (!result.success) {
      toast.error("Échec de la soumission de l'évaluation", {
        description: result.message,
      });
    } else {
      toast.success("Évaluation soumise avec succès !");
      setUserRating(selectedRating);
      setRatingStats(result.data);
      setShowSubmitButton(false);
      setShowDeleteButton(true);
    }

    setIsLoading(false);
  };

  const handleDeleteRating = async () => {
    if (!userRating) return;

    setIsLoading(true);

    const result = await deleteVideoRating(video.id);
    console.log("Delete rating result:", result);

    if (!result.success) {
      toast.error("Échec de la suppression de l'évaluation", {
        description: result.message,
      });
    } else {
      toast.success("Évaluation supprimée avec succès !");
      setUserRating(null);
      setSelectedRating(null);
      setRatingStats(result.data);
      setShowSubmitButton(false);
      setShowDeleteButton(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 my-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      {/* Title and Class Level */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-gray-900 dark:text-white flex-1">
            {video.title}
          </h1>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 text-sm font-semibold">
              Niveau : {video.class}
            </span>
          </div>
        </div>

        {/* Branches */}
        {video.branch && video.branch.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Destiné aux élèves des branches suivantes :
            </p>
            <div className="flex flex-wrap gap-2">
              {video.branch.map((branch, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 text-xs font-medium"
                >
                  {branch}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 py-3 border-y border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <Image
              src="/icons/views-dark.svg"
              alt="Vues"
              width={16}
              height={16}
              className="opacity-80"
            />
          ) : (
            <Image
              src="/icons/views.svg"
              alt="Vues"
              width={16}
              height={16}
              className="opacity-80"
            />
          )}
          <span className="font-medium">
            {video.views.toLocaleString("fr-FR")} vue
            {video.views > 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <FaClockRotateLeft size={16} className="opacity-80" />
          ) : (
            <Image
              src="/icons/Clock.svg"
              alt="Temps"
              width={16}
              height={16}
              className="opacity-70"
            />
          )}
          <span className="font-medium">
            {formatDistanceToNow(new Date(video.created_at), {
              addSuffix: true,
              locale: fr,
            })}
          </span>
        </div>
      </div>

      {/* Teacher Info and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Teacher Info */}
        <Link
          href={`/profile/${video.teacher.id}`}
          target="_blank"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 -m-3"
        >
          {video.teacher.profile_url ? (
            <Image
              src={video.teacher.profile_url}
              alt={`${video.teacher.first_name} ${
                video.teacher.last_name ?? ""
              }`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
              <span className="text-white font-semibold text-sm">
                {video.teacher.first_name.charAt(0)}
                {video.teacher.last_name?.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {video.teacher.first_name} {video.teacher.last_name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enseignant
            </p>
          </div>
        </Link>

        <div className="flex-shrink-0">
          <ShareLink isLoading={isLoading} />
        </div>
      </div>

      {/* Rating Section */}
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Évaluations des étudiants
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Star Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <RenderStars
                handleRatingSelection={handleRatingSelection}
                selectedRating={selectedRating}
                isLoading={isLoading}
                hoveredRating={hoveredRating}
                key={video.id}
                setHoveredRating={setHoveredRating}
              />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {ratingStats.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({ratingStats.totalRatings} évaluation
                  {ratingStats.totalRatings > 1 ? "s" : ""})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Selection Display */}
        {selectedRating !== null && (
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700">
            {userRating !== null && selectedRating === userRating ? (
              <>
                ✅ Votre évaluation : {selectedRating} étoile
                {selectedRating !== 1 ? "s" : ""}
              </>
            ) : (
              <>
                ⭐ Sélectionné : {selectedRating} étoile
                {selectedRating !== 1 ? "s" : ""}
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Submit Button */}
          {showSubmitButton && (
            <Button
              onClick={handleSubmitRating}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Soumission en cours...
                </>
              ) : (
                "Soumettre mon évaluation"
              )}
            </Button>
          )}

          {/* Delete Button */}
          {showDeleteButton && !showSubmitButton && (
            <Button
              onClick={handleDeleteRating}
              disabled={isLoading}
              variant="destructive"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Suppression...
                </>
              ) : (
                "Supprimer mon évaluation"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
