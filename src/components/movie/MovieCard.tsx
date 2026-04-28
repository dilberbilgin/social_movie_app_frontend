"use client";

import Link from "next/link";
import { Heart, Film } from "lucide-react";
import { Movie } from "@/types";
import { movieService } from "@/services/movieService";
import { useEffect, useState } from "react";
import { MovieActionMenu } from "../social/MovieActionMenu";
import { CollectionsModal } from "./CollectionsModal";

export default function MovieCard({ movie: initialMovie }: { movie: Movie }) {
  const [movie, setMovie] = useState(initialMovie);
  const [isLiking, setIsLiking] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);

  // useEffect(() => {
  //   setMovie(initialMovie);
  //   setImgError(false);
  // }, [initialMovie]);

  useEffect(() => {
  const handleGlobalUpdate = (event: any) => {
    if (event.detail.movieId === movie.id) {
      setMovie(prev => ({
        ...prev,
        clubRating: event.detail.newRating,
        clubVoteCount: event.detail.newCount
      }));
    }
  };

  window.addEventListener('movie-stats-updated', handleGlobalUpdate);
  return () => window.removeEventListener('movie-stats-updated', handleGlobalUpdate);
}, [movie.id]);

  const getSafePosterUrl = () => {
    const url = movie.posterUrl;
    if (
      !url ||
      url.includes("via.placeholder.com") ||
      url === "null" ||
      url === ""
    )
      return null;
    if (!url.startsWith("http")) {
      const cleanPath = url.startsWith("/") ? url : `/${url}`;
      return `https://image.tmdb.org/t/p/w500${cleanPath}`;
    }
    return url;
  };

  const safePoster = getSafePosterUrl();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiking) return;
    try {
      setIsLiking(true);
      const response = await movieService.toggleLike(movie.id, movie.tmdbId);
      setMovie((prev) => ({
        ...prev,
        id: response.data || prev.id,
        likeCount:
          prev.userReaction === true ? prev.likeCount - 1 : prev.likeCount + 1,
        userReaction: prev.userReaction === true ? null : true,
        
      }));
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <>
      <Link
        href={`/movies/${movie.id}?tmdbId=${movie.tmdbId}`}
        className={`group block w-32 md:w-40 shrink-0 relative transition-all 
        ${isCollectionsModalOpen ? "z-0" : "hover:z-50 focus-within:z-50"}`}
      >
        <div className="aspect-2/3 relative rounded-2xl border-2 border-gray-800 group-hover:border-yellow-500 transition-all duration-300 shadow-xl bg-gray-900 flex items-center justify-center">
          {!imgError && safePoster ? (
            <img
              src={safePoster}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover z-10 rounded-[14px]" // İçerideki resim kenarlığa uyum sağlasın
              onError={(e) => {
                setImgError(true);
                const target = e.currentTarget;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-40">
              <Film size={40} className="text-gray-600" />
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                No Poster
              </span>
            </div>
          )}

          {/* ALT BİLGİ ŞERİDİ */}
          <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black via-black/90 to-transparent px-3 py-3 flex justify-between items-center z-20 rounded-b-[14px]">
            <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md border border-white/5">
              <span className="text-yellow-500 font-bold text-[11px] flex items-center gap-1 leading-none">
                ⭐ {(movie.clubRating ?? 0).toFixed(1)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {" "}
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`
                  flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md 
                  transition-all active:scale-125 border border-white/5 hover:bg-black/60 
                  ${movie.userReaction === true ? "text-red-500 " : "text-white"}
                `}
              >
                <Heart
                  size={12}
                  fill={movie.userReaction === true ? "currentColor" : "none"}
                  className={isLiking ? "animate-pulse" : ""}
                />
                <span className="font-bold text-[11px] leading-none">
                  {movie.likeCount || 0}
                </span>
              </button>
              <MovieActionMenu
                movieId={movie.id}
                tmdbId={movie.tmdbId}
                movieTitle={movie.title}
                onOpenCollections={() => setIsCollectionsModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 px-1">
          <h3 className="text-sm font-bold text-white truncate group-hover:text-yellow-500 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2">
  <span className="text-[10px] text-gray-400 uppercase font-bold px-1.5 py-0.5 bg-white/5 rounded border border-white/10">
    {movie.contentType === "TV" ? "TV Series" : "Movie"}
  </span>
  <p className="text-[11px] text-gray-500 mt-0.5">
    {movie.releaseYear}
  </p>
</div>
          {/* <p className="text-[11px] text-gray-500 mt-0.5">
            {movie.releaseYear}
          </p> */}
        </div>
      </Link>

      {isCollectionsModalOpen && (
        <CollectionsModal
          tmdbId={movie.tmdbId}
          onClose={() => setIsCollectionsModalOpen(false)}
        />
      )}
    </>
  );
}
