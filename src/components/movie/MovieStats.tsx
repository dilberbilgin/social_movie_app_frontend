"use client";

import { Movie } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import { StarIcon, UsersIcon } from "lucide-react"; // Ikonlar için lucide-react öneririm

interface MovieStatsProps {
  movie: Movie;
}

export default function MovieStats({ movie }: MovieStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 sticky top-24">
      <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
        {t('movie.ratings')}
      </h3>

      <div className="space-y-6">
        {/* IMDB Puanı */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold text-xs">IMDb</span>
            <span className="text-gray-400 text-sm">{t('movie.tmdbScore')}</span>
          </div>
          <span className="text-xl font-semibold text-white">{movie.tmdbRating}/10</span>
        </div>

        {/* Club Puanı (Bizim Backend'den gelen) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-500">
            <StarIcon size={20} fill="currentColor" />
            <span className="text-gray-400 text-sm">{t('movie.clubScore')}</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-yellow-500">{movie.clubRating.toFixed(1)}/10</div>
            <div className="flex items-center gap-1 text-gray-500 text-xs justify-end">
              <UsersIcon size={12} />
              {movie.clubVoteCount} {t('movie.votes')}
            </div>
          </div>
        </div>

        <button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-yellow-900/20">
          {t('movie.rateNow')}
        </button>
      </div>
    </div>
  );
}