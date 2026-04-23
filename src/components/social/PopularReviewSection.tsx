"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { movieService } from "@/services/movieService";
import { HeartIcon } from "@heroicons/react/24/solid";
import { TrendingReview, Movie } from "@/types";
import MovieCard from "../movie/MovieCard";
import { CollectionsModal } from "../movie/CollectionsModal";

export const PopularReviewSection = () => {
  const [reviews, setReviews] = useState<TrendingReview[]>([]);
  const [selectedTmdbId, setSelectedTmdbId] = useState<number | null>(null);

  useEffect(() => {
    movieService.getTrendingReviews(4).then((res) => {
      if (res.success) setReviews(res.data);
    });
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b border-gray-900 pb-2 mb-6">
        <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase">
          Popular Reviews This Week
        </h2>
        <Link
          href="/reviews"
          className="text-xs text-gray-500 hover:text-white cursor-pointer transition uppercase"
        >
          More
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {reviews.map((review) => {
          /**
           * TypeScript Hatası Çözümü:
           * 'as Movie' kullanarak eksik alanlar için hata almayı engelliyoruz.
           * MovieCard sadece görsel ve temel ID'leri kullanir
           */
          const movieData = {
            id: review.movieId,
            tmdbId: review.tmdbId,
            title: review.movieTitle,
            posterUrl: review.moviePosterUrl,
            releaseYear: 2026, // Sayı olarak güncellendi
            clubRating: review.clubRating || 0, // Backend'den gelen puan
            clubVoteCount: review.clubVoteCount || 0, // Backend'den gelen oy sayısı
            likeCount: review.movieLikeCount || 0,
            dislikeCount: review.movieDislikeCount || 0,
            userReaction: review.userReaction,
            // Eksik alanları 'as Movie' ile bypass ediyoruz veya buraya ekleyebilirsin
          } as Movie;

          return (
            <div key={review.commentId} className="flex gap-6 group">
              {/* SOL TARAF: Gerçek MovieCard */}
              <div className="shrink-0 origin-top-right ">
                <MovieCard movie={movieData} />
              </div>

              {/* SAĞ TARAF: Yorum Bilgileri */}
              <div className="flex flex-col min-w-0 flex-1 pt-1">
                {/* Kullanıcı Satırı */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gray-800 rounded-full overflow-hidden relative border border-white/5">
                    {review.profilePictureUrl ? (
                      <Image
                        src={review.profilePictureUrl}
                        alt={review.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-[8px] text-white">
                        {review.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-500 hover:text-gray-300 cursor-pointer transition">
                    {review.username}
                  </span>
                </div>

                {/* Film Başlığı */}
                <Link
                  href={`/movies/${review.movieId}?tmdbId=${review.tmdbId}`}
                >
                  <h3 className="text-white font-black text-lg truncate leading-tight group-hover:text-yellow-500 transition-colors">
                    {review.movieTitle}
                  </h3>
                </Link>

                {/* Yorum Metni */}
                <Link
                  href={`/movies/${review.movieId}?tmdbId=${review.tmdbId}`}
                >
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3 italic leading-relaxed hover:text-gray-300 transition-colors">
                    "{review.commentContent}"
                  </p>
                </Link>

                {/* Like Butonu/Sayısı */}
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-md hover:bg-orange-500/20 cursor-pointer transition-colors">
                    <HeartIcon className="w-3.5 h-3.5" />
                    <span>{review.finalLikeCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTmdbId && (
        <CollectionsModal
          tmdbId={selectedTmdbId}
          onClose={() => setSelectedTmdbId(null)}
        />
      )}

      <div className="flex justify-between items-center border-b border-gray-900 pb-6 mb-6"></div>
    </section>
  );
};
