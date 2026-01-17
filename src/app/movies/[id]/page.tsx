"use client";

import { useParams } from "next/navigation";
import { useMovieDetail } from "@/hooks/useMovieDetail";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
// Bileşenleri (Component) birazdan parçalayacağız
import MovieHero from "@/components/movie/MovieHero";
import MovieStats from "@/components/movie/MovieStats";
import CommentSection from "@/components/movie/CommentSection";
import RatingAction from "@/components/movie/RatingAction";

export default function MovieDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  // Hook sayesinde sayfa çok temiz! Sadece veriyi alıp bileşenlere dağıtıyor.
  const { movie, comments, loading, error, setComments, setMovie } =
    useMovieDetail(id as string);
  const { user } = useAuth();

  const updateLocalMovieStats = (newAvg: number, newCount: number) => {
    if (movie) {
      setMovie({
        ...movie,
        clubRating: newAvg,
        clubVoteCount: newCount,
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Yükleniyor...
      </div>
    );
  if (error || !movie)
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">
        {error}
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-900 text-white overflow-y-auto">
      <MovieHero movie={movie} />

      {/* İçerik başlar - Hero'dan sonra normal akışta gelmeli */}
      <div className="max-w-6xl mx-auto px-4 mt-24 grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
        <div className="lg:col-span-2 space-y-10">
          {/* Özet kısmı */}
          <section>
            <h2 className="text-yellow-500 font-bold mb-4 uppercase tracking-wider">
              {t("movie.description")}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.description}
            </p>
          </section>

          {/* Yorumlar */}
          <CommentSection movieId={movie.id} initialComments={comments} />
        </div>

        {/* Yan Panel */}
        <aside className="space-y-6">
          {/* Film istatistiklerini gösteren sabit alan */}
          <MovieStats movie={movie} />

          {/* Puanlama alanı: Kullanıcı login ise mutlaka görünmeli */}
          {user ? (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <RatingAction
                movieId={movie.id}
                initialScore={movie.userScore}
                onRatingSuccess={(resAvg, resCount) => {
                  updateLocalMovieStats(resAvg, resCount);
                }}
              />
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic p-4 text-center">
              {t("auth.loginToRate") || "Puan vermek için giriş yapmalısınız."}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
