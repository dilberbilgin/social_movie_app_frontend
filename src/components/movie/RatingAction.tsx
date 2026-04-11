"use client";

import { useEffect, useState } from "react";
import { ratingService } from "@/services/ratingService";
import { useTranslation } from "@/context/LanguageContext";

interface RatingActionProps {
  movieId: string;
  initialScore?: number; // Eğer daha önce puan vermişse
  onRatingSuccess: (newAverage: number, newCount: number) => void;
}

export default function RatingAction({
  movieId,
  initialScore,
  onRatingSuccess,
}: RatingActionProps) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(initialScore || 0);
  const [hoverScore, setHoverScore] = useState(0);

  useEffect(() => {
    if (initialScore !== undefined) {
      setCurrentScore(initialScore);
    }
  }, [initialScore]);

  // RatingAction.tsx içinde (tahmini yapı)
  const handleRate = async (selectedScore: number) => {
    if (loading) return;
    setLoading(true);

    try {
      // URL'den tmdbId'yi alıyoruz (Eğer sayfa yenilenirse veya direkt linkle gelinirse diye)
      const searchParams = new URLSearchParams(window.location.search);
      const tmdbIdParam = searchParams.get("tmdbId");
      const contentTypeParam = searchParams.get("contentType") || "MOVIE";

      const res = await ratingService.rateMovie({
        movieId: movieId, // Prop'tan gelen ID
        tmdbId: tmdbIdParam ? Number(tmdbIdParam) : undefined,
        contentType: contentTypeParam,
        score: selectedScore,
      });

      if (res.success) {
        setCurrentScore(selectedScore);

        if (movieId === "0" && res.data.movieId) {
          const currentUrl = new URL(window.location.href);
          // Pathname: /movies/0 -> /movies/abc-123-uuid
          const newPathname = window.location.pathname.replace("/movies/0", `/movies/${res.data.movieId}`);
          
          // Sayfayı yenilemeden URL'i değiştir
          window.history.replaceState({}, "", newPathname + currentUrl.search);
        }

        // Başarı durumunda Parent (MovieDetailContent) bileşenindeki istatistikleri güncelle
        if (
          res.data.newClubRating !== undefined &&
          res.data.newClubVoteCount !== undefined
        ) {
          onRatingSuccess(res.data.newClubRating, res.data.newClubVoteCount);
        }

        console.log("Rating success:", res.message);
      }
    } catch (err) {
      console.error("Rating error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-800/80 backdrop-blur-md rounded-3xl border border-gray-700 shadow-2xl">
      <h3 className="text-gray-400 font-semibold mb-4 text-xs uppercase tracking-[0.2em]">
        {currentScore > 0 ? t("movie.yourRating") : t("movie.rateThis")}
      </h3>

      {/* Yıldız Konteyner */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const isActive = (hoverScore || currentScore) >= num;
          const isCurrent = currentScore >= num;

          return (
            <button
              key={num}
              onMouseEnter={() => setHoverScore(num)}
              onMouseLeave={() => setHoverScore(0)}
              onClick={() => handleRate(num)}
              disabled={loading}
              className="relative transition-all duration-200 transform hover:scale-120 focus:outline-none"
            >
              <span
                className={`text-2xl md:text-3xl ${
                  isActive
                    ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                    : "text-gray-600"
                } ${loading ? "animate-pulse" : ""}`}
              >
                ★
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col items-center gap-1">
        <span className="text-2xl font-black text-white">
          {hoverScore || currentScore || "?"}
          <span className="text-gray-500 text-sm">/10</span>
        </span>

        {currentScore > 0 && !loading && (
          <button
            onClick={() => handleRate(0)}
            className="text-[10px] text-gray-500 hover:text-red-400 underline underline-offset-4 transition-colors"
          >
            {t("movie.removeRating") || "Remove"}
          </button>
        )}
      </div>
    </div>
  );
}
