import Link from 'next/link';
import { Movie } from '@/types';
import { Heart } from 'lucide-react';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  return (
    <section className="py-4">
      <h2 className="text-xl font-bold text-white mb- px-4 border-l-4 border-yellow-500 ml-2">
        {title}
      </h2>
      <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-2">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}