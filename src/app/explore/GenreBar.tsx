"use client";

import { Genre } from "@/types";

interface GenreBarProps {
  genres: Genre[];
  selectedGenreId: string;
  onSelect: (id: string) => void;
}

export default function GenreBar({ genres, selectedGenreId, onSelect }: GenreBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
      <button
        onClick={() => onSelect("")}
        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2 whitespace-nowrap ${
          selectedGenreId === "" 
          ? "bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
          : "bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
        }`}
      >
        All Movies
      </button>
      
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelect(genre.id)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2 whitespace-nowrap ${
            selectedGenreId === genre.id 
            ? "bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
            : "bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}