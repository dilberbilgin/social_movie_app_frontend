

"use client";

import { useParams } from "next/navigation";
import { useMovieDetail } from "@/hooks/useMovieDetail";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import MovieHero from "@/components/movie/MovieHero";
import MovieStats from "@/components/movie/MovieStats";
import CommentSection from "@/components/movie/CommentSection";
import RatingAction from "@/components/movie/RatingAction";

export default function MovieDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  // fetchAllData'yı hook'tan çekiyoruz (Yenileme yapmak için)
  const { movie, comments, loading, error, setMovie, fetchAllData } = useMovieDetail(id as string);

  // Puanlama yapıldığında local state'i güncellemek için
  const updateLocalMovieStats = (newAvg: number, newCount: number) => {
    if (movie) {
      setMovie({
        ...movie,
        clubRating: newAvg,
        clubVoteCount: newCount,
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-yellow-500 font-bold">
      {t("common.loading") || "Loading Movie Details..."}
    </div>
  );

  if (error || !movie) return (
    <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center font-bold">
      {error || "Movie not found"}
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-900 text-white overflow-y-auto">
      {/* 1. HERO ALANI: Like/Dislike butonları burada olacak */}
      <MovieHero 
        movie={movie} 
        onMovieUpdated={fetchAllData} // Beğeni sonrası veriyi tazele
      />

      <div className="max-w-6xl mx-auto px-4 mt-24 grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
        
        {/* SOL KOLON: Özet ve Yorumlar */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-gray-800/20 p-6 rounded-2xl border border-gray-800/50">
            <h2 className="text-yellow-500 font-bold mb-4 uppercase tracking-wider text-sm">
              {t("movie.description")}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.description}
            </p>
          </section>

          {/* 2. YORUMLAR BÖLÜMÜ */}
          {comments ? (
            <CommentSection 
              movieId={movie.id} 
              initialData={comments} 
              totalCount={movie.commentCount || 0}
            />
          ) : (
            <div className="animate-pulse bg-gray-800 h-40 rounded-xl" />
          )}
        </div>

        {/* SAĞ KOLON: İstatistikler ve Puanlama */}
        <aside className="space-y-6">
          <MovieStats movie={movie} />
          
          {user ? (
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <RatingAction
                movieId={movie.id}
                initialScore={movie.userScore}
                onRatingSuccess={(resAvg, resCount) => {
                  updateLocalMovieStats(resAvg, resCount);
                }}
              />
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic p-6 bg-gray-800/30 rounded-xl border border-dashed border-gray-700 text-center">
              {t("auth.loginToRate") || "Puan vermek için giriş yapmalısınız."}
            </div>
          )}
        </aside>

      </div>
    </main>
  );
}