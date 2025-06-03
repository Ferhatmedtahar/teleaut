"use client";
import { Star } from "lucide-react";
import React from "react";

export default function RenderStars({
  hoveredRating,
  setHoveredRating,
  selectedRating,
  handleRatingSelection,
  isLoading,
}: {
  hoveredRating: number | null;
  setHoveredRating: React.Dispatch<React.SetStateAction<number | null>>;
  selectedRating: number | null;
  handleRatingSelection: (rating: number) => void;
  isLoading: boolean;
}) {
  const stars = [];
  const displayRating =
    hoveredRating !== null ? hoveredRating : selectedRating || 0;

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <div key={i} className="relative">
        {/* Full star button */}
        <button
          className="relative focus:outline-none disabled:cursor-not-allowed transition-all duration-150"
          disabled={isLoading}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(null)}
          onClick={() => handleRatingSelection(i)}
        >
          <Star
            size={20}
            className={`transition-colors duration-150 ${
              displayRating >= i
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300 hover:text-yellow-400"
            }`}
          />
        </button>

        {/* Half star overlay button */}
        <button
          className="absolute left-0 top-0 w-[80%] h-full focus:outline-none disabled:cursor-not-allowed z-10"
          disabled={isLoading}
          onMouseEnter={() => setHoveredRating(i - 0.5)}
          onMouseLeave={() => setHoveredRating(null)}
          onClick={() => handleRatingSelection(i - 0.5)}
        >
          <div className="w-[60%] h-full overflow-hidden">
            <Star
              size={20}
              className={`transition-colors duration-150 ${
                displayRating >= i - 0.6 && displayRating < i
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-transparent"
              }`}
            />
          </div>
        </button>
      </div>
    );
  }

  return stars;
}
