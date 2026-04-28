"use client";

import { Movie } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import { StarIcon, UsersIcon } from "lucide-react";
import WatchProviderList from "../WatchProviderList";

interface MovieStatsProps {
  movie: Movie;
}

export default function MovieStats({ movie }: MovieStatsProps) {
  const { t } = useTranslation();

  return (
    <div className=" bg-gray-800/80 p-6 rounded-xl border border-gray-700 ">
      {/* <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 sticky top-24"> */}
      {/* <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
        {t("movie.ratings")}
      </h3> */}
      <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
  {movie.contentType === "TV" ? t("movie.tvRatings") : t("movie.movieRatings")}
</h3>

      <div className="space-y-6">
        {/* IMDB Puanı */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-500 text-black px-2 py-2 rounded font-bold text-xs">
              {/* IMDb */}
            </span>
            <span className="text-gray-400 text-sm">
              {t("movie.tmdbScore")}
            </span>
          </div>
          <span className="text-xl font-semibold text-white">
            {movie.tmdbRating}/10
          </span>
        </div>

        {/* Club Puanı (Backend'den gelen) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-500">
            <StarIcon size={20} fill="currentColor" />
            <span className="text-gray-400 text-sm">
              {t("movie.clubScore")}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-yellow-500">
              {movie.clubRating.toFixed(1)}/10
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs justify-end">
              <UsersIcon size={12} />
              {movie.clubVoteCount} {t("movie.votes")}
            </div>
          </div>
        </div>
        {/* İZLEME PLATFORMLARI - BURAYA EKLEDİK */}
      {movie.watchProviders && (
        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
            {t("movie.watchNow") || "Nereden İzlenir?"}
          </h4>
          <WatchProviderList providers={movie.watchProviders} />
        </div>
      )}
      </div>
    </div>
  );
}
