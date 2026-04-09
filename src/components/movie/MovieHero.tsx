"use client";

import { Movie } from "@/types";
import { Heart, Skull, Bookmark } from "lucide-react";
import { movieService } from "@/services/movieService";
import LanguageSelector from "../ui/LanguageSelector";
import { useTranslation } from "@/context/LanguageContext";

interface MovieHeroProps {
  movie: Movie;
  onMovieUpdated: (newId?: string) => void;
  onSaveClick: () => void;
}

export default function MovieHero({
  movie,
  onMovieUpdated,
  onSaveClick,
}: MovieHeroProps) {
  const { t } = useTranslation();

  const handleMovieReaction = async (isLike: boolean) => {
    try {
      const response = isLike
        ? await movieService.toggleLike(movie.id, movie.tmdbId)
        : await movieService.toggleDislike(movie.id, movie.tmdbId);

      onMovieUpdated(response.data);
    } catch (err) {
      console.error("Reaction Error:", err);
    }
  };

  return (
    <div className="relative w-full h-80 bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            className="w-full h-full object-cover opacity-20 blur-2xl scale-110"
            alt=""
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-end pb-12 gap-8">
        <div className="w-36 h-52 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
          <img
            src={movie.posterUrl || "/no-poster.png"}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 pb-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
            {movie.title}
          </h1>
          <div className="flex items-center gap-3 text-gray-400 font-medium">
            <span className="bg-yellow-500/20 text-yellow-500 px-4 py-1.5 rounded text-md border border-yellow-500/30">
              {movie.releaseYear}
            </span>
            {movie.genres && movie.genres.length > 0 && (
              <>
                <span>•</span>
                <span className="text-sm md:text-base opacity-90">
                  {movie.genres.map((g) => g.name).join(", ")}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full backdrop-blur-sm border border-white/5">
            <button
              onClick={() => handleMovieReaction(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all active:scale-110 ${
                movie.userReaction === true
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Heart
                size={20}
                fill={movie.userReaction === true ? "white" : "none"}
              />
              <span className="font-bold">{movie.likeCount || 0}</span>
            </button>

            <button
              onClick={() => handleMovieReaction(false)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all active:scale-110 ${
                movie.userReaction === false
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Skull size={20} />
              <span className="font-bold">{movie.dislikeCount || 0}</span>
            </button>

            {/* Kaydet Butonu */}
            <button
              onClick={onSaveClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all active:scale-110 border border-white/5"
              title={t("movie.saveToList")}
            >
              <Bookmark size={20} />
            </button>
          </div>

          <LanguageSelector
            dropdownPosition="top"
            align="right"
            isFullWidth={false}
            showLabel={false}
          />
        </div>
      </div>
    </div>
  );
}
