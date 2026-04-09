"use client";
import Link from "next/link";
import { RatingResponse, PageResponse } from "@/types"; 

interface Props {

  ratings: PageResponse<RatingResponse>;
  isOwnProfile: boolean;
}

export default function RatingGrid({ ratings, isOwnProfile }: Props) {

  const ratingsList = ratings?.content || [];

  if (ratingsList.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500 italic">
        Henüz bir aktivite bulunmuyor.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {ratingsList.map((rating) => (
        <Link 
          href={`/movies/${rating.movieId}`} 
          key={rating.id}
          className="relative group block rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition-all shadow-2xl"
        >
          <div className="aspect-2/3 w-full relative">
            <img 
              src={rating.posterUrl || "/no-poster.png"} 
              alt={rating.movieTitle}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md border border-gray-700">
               <span className="text-yellow-500 font-bold text-xs">⭐ {rating.score}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}