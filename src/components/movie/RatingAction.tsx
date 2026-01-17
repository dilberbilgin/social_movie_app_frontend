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
//   const [score, setScore] = useState<number>(initialScore || 0);
  const [loading, setLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(initialScore || 0);

  useEffect(() => {
  if (initialScore !== undefined) {
    setCurrentScore(initialScore);
  }
}, [initialScore]);

  const handleRate = async (selectedScore: number) => {
    setLoading(true);
    try {
      const res = await ratingService.rateMovie({
        movieId: movieId,
        score: selectedScore,
      });

      if (res.success) {
        setCurrentScore(selectedScore);

        // Backend'den gelen yeni ortalamayı sayfaya (parent) gönderiyoruz
        if (
          res.data.newClubRating !== undefined &&
          res.data.newClubVoteCount !== undefined
        ) {
          onRatingSuccess(res.data.newClubRating, res.data.newClubVoteCount);
        }
        // Burada backend'den dönen veriye göre üst bileşendeki (Page)
        // film ortalamasını güncellemek için bir callback tetikleyebiliriz.
        // Şimdilik sadece başarılı mesajı veriyoruz.
        alert(res.message);
        console.log("İşlem Başarılı:", res.message);
      }
    } catch (err) {
      console.error("Rating error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-yellow-600 rounded-lg bg-black/50">
      <h3 className="text-yellow-500 font-bold mb-2 text-sm uppercase">
        {t("movie.giveRating")}
        DEBUG: Puanlama Test Paneli
      </h3>

      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => handleRate(num)}
            disabled={loading}
            className={`w-10 h-10 rounded border font-bold transition-all ${
              currentScore === num
                ? "bg-yellow-500 text-black border-white"
                : "bg-gray-800 text-2xl text-white border-gray-600 hover:bg-yellow-500"
            } ${loading ? "opacity-50 cursor-not-allowed"  : ""}`}
          >
            {num}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {loading
          ? "İşleniyor..."
          : `Senin Puanın: ${currentScore > 0 ? currentScore : "Yok"}`}
      </p>
    </div>
  );
}


