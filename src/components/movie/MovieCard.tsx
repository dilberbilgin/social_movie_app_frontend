"use client";

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Movie } from '@/types';
import { movieService } from '@/services/movieService';
import { useEffect, useState } from 'react';

export default function MovieCard({ movie: initialMovie }: { movie: Movie }) {
  const [movie, setMovie] = useState(initialMovie);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    setMovie(initialMovie);
  }, [initialMovie]);

  const handleLike = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (isLiking) return;
  try {
    setIsLiking(true);
    
    // Hem id hem de tmdbId gönderiyoruz
    const response = await movieService.toggleLike(movie.id, movie.tmdbId); 
    
    setMovie(prev => ({
      ...prev,
      // Eğer backend'den yeni id gelmişse onu set et, yoksa mevcut kalsın
  id: response.data || prev.id,
      likeCount: prev.userReaction === true ? prev.likeCount - 1 : prev.likeCount + 1,
      userReaction: prev.userReaction === true ? null : true
    }));
  } catch (err) {
    console.error("Like error:", err);
  } finally {
    setIsLiking(false);
  }
};

  return (
    <Link href={`/movies/${movie.id}?tmdbId=${movie.tmdbId}`} className="group block w-full">
      <div className="aspect-2/3 relative rounded-2xl overflow-hidden border border-gray-800 group-hover:border-yellow-500/50 transition-all shadow-xl">
        
        {/* Poster Resmi */}
        <img 
          src={movie.posterUrl || '/no-poster.png'} 
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* ALT BİLGİ ŞERİDİ: Gradyan ve İkonlar bir arada */}
        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black via-black/60 to-transparent px-3 py-3 flex justify-between items-center z-20">
          
          {/* Puan (Sol) */}
          <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1.5 rounded-full backdrop-blur-md border border-white/5">
            <span className="text-yellow-500 font-bold text-sm flex items-center gap-1 leading-none">
              <span className="text-[10px]">⭐</span> {(movie.clubRating ?? 0).toFixed(1)}
            </span>
          </div>

          {/* Beğeni Butonu (Sağ) */}
          <button 
            onClick={handleLike}
            disabled={isLiking}
            className={`
              flex items-center gap-1 bg-black/40 px-2.5 py-1.5 rounded-full backdrop-blur-md 
              transition-all active:scale-125 border border-white/5 hover:bg-black/60 
              ${movie.userReaction === true ? 'text-red-500 ' : 'text-white'}
            `}
          >
            <Heart 
              size={13} 
              fill={movie.userReaction === true ? "currentColor" : "none"} 
              className={isLiking ? "animate-pulse" : ""}
            />
            <span className="font-bold text-sm leading-none">
              {movie.likeCount || 0}
            </span>
          </button>
        </div>
      </div>

      {/* Yazılar (Poster Dışında) */}
      <div className="mt-3 px-1">
        <h3 className="text-sm font-bold text-white truncate group-hover:text-yellow-500 transition-colors">
          {movie.title}
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5">{movie.releaseYear}</p>
      </div>
    </Link>
  );
}