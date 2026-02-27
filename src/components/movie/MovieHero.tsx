"use client";

import { Movie } from "@/types";
import { Heart, Skull } from "lucide-react";
import { movieService } from "@/services/movieService";

interface MovieHeroProps {
  movie: Movie;
  onMovieUpdated: () => void; // Veriyi tazelemek için ekledik
}

export default function MovieHero({ movie, onMovieUpdated }: MovieHeroProps) {
  const handleMovieReaction = async (isLike: boolean) => {
    try {
      if (isLike) await movieService.toggleLike(movie.id);
      else await movieService.toggleDislike(movie.id);
      onMovieUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full h-80 bg-gray-950 overflow-hidden">
      {/* Arka plan atmosferi */}
      <div className="absolute inset-0 z-0">
        <img 
          src={movie.posterUrl} 
          className="w-full h-full object-cover opacity-20 blur-2xl scale-110" 
          alt="" 
        />
        {/* Gradyan: Arka plan resminin üzerine biner */}
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/70 to-transparent" />
      </div>

      {/* Ön plan: İçerik katmanı */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-end pb-12 gap-8">
        {/* Dik Poster */}
        <div className="w-36 h-50 relative"> {/* w-36 = 144px, h-50 = 200px */}
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="absolute inset-0 w-full h-full object-cover" 
            />  
          {/* Resmin dışarı taşmasını engeller */}
        </div>
        
        {/* Metin Bilgileri */}
        <div className="flex-1 pb-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
            {movie.title}
          </h1>
          <div className="flex items-center gap-3 text-gray-400 font-medium">
            <span className="bg-yellow-500/20 text-yellow-500 px-4 py-1.5  rounded text-md border border-yellow-500/30">
              {movie.releaseYear}
            </span>
            <span>•</span>
            <span className="text-sm md:text-base opacity-90">
              {movie.genres?.map(g => g.name).join(', ')}
            </span>
          </div>
        </div>

        {/* Film Like/Dislike */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleMovieReaction(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all active:scale-110 ${movie.userReaction === true ? 'bg-red-500 border-red-500 text-white' : 'border-gray-700 text-gray-400 hover:border-white'}`}
            >
              <Heart size={18} fill={movie.userReaction === true ? "white" : "none"} />
              <span className="font-bold">{movie.likeCount}</span>
            </button>
            <button 
              onClick={() => handleMovieReaction(false)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all active:scale-110 ${movie.userReaction === false ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-700 text-gray-400 hover:border-white'}`}
            >
              <Skull size={18} />
              <span className="font-bold">{movie.dislikeCount}</span>
            </button>
          </div>


      </div>
    </div>
  );
}