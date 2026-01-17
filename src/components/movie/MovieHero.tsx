"use client";

import { Movie } from "@/types";

interface MovieHeroProps {
  movie: Movie;
}

export default function MovieHero({ movie }: { movie: Movie }) {
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
      </div>
    </div>
  );
}