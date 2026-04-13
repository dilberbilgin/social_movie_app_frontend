"use client";
import { useMovieDetail } from "@/hooks/useMovieDetail";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import MovieHero from "@/components/movie/MovieHero";
import MovieStats from "@/components/movie/MovieStats";
import CommentSection from "@/components/movie/CommentSection";
import RatingAction from "@/components/movie/RatingAction";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { CollectionsModal } from "@/components/movie/CollectionsModal";
import { useState } from "react";

export default function MovieDetailContent({ id }: { id: string }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { movie, comments, loading, error, setMovie, fetchAllData } =
    useMovieDetail(id);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);

  const updateLocalMovieStats = (newAvg: number, newCount: number) => {
    if (movie) {
      setMovie({ ...movie, clubRating: newAvg, clubVoteCount: newCount });
    }
  };

  if (loading)
    return <div className="p-20 text-center text-yellow-500">Loading...</div>;
  if (error || !movie)
    return <div className="p-20 text-center text-red-500">Not Found</div>;

  return (
    <div className="w-full relative">
      <MovieHero
        movie={movie}
        onMovieUpdated={fetchAllData}
        onSaveClick={() => setIsCollectionsModalOpen(true)}
      />
      <div className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10">
        <div className="lg:col-span-2 space-y-10 order-1">
          <section className="bg-gray-800/20 p-6 rounded-2xl border border-gray-800/50">
            <h2 className="text-yellow-500 font-bold mb-4 uppercase text-sm">
              {t("movie.description")}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.description}
            </p>
          </section>
          {comments && (
            <CommentSection
              movieId={movie.id}
              initialData={comments}
              totalCount={movie.commentCount || 0}
            />
          )}
        </div>
        <aside className="lg:col-span-1 space-y-6 order-2 lg:order-2 ">
          <div className="lg:sticky lg:top-24 space-y-6">
      <MovieStats movie={movie} />
      {user ? (
        <RatingAction
          movieId={movie.id}
          initialScore={movie.userScore}
          onRatingSuccess={updateLocalMovieStats}
        />
      ) : (
        <div className="text-sm text-gray-500 italic p-6 bg-gray-800/30 rounded-xl border border-dashed border-gray-700 text-center">
          {t("auth.loginToRate")}
        </div>
      )}
    </div>
          {/* <MovieStats movie={movie} />
          {user ? (
            <RatingAction
              movieId={movie.id}
              initialScore={movie.userScore}
              onRatingSuccess={updateLocalMovieStats}
            />
          ) : (
            <div className="text-sm text-gray-500 italic p-6 bg-gray-800/30 rounded-xl border border-dashed border-gray-700 text-center">
              {t("auth.loginToRate")}
            </div>
          )} */}
        </aside>
      </div>

      {isCollectionsModalOpen && (
        <CollectionsModal
          tmdbId={movie.tmdbId}
          onClose={() => setIsCollectionsModalOpen(false)}
        />
      )}
    </div>
  );
}
