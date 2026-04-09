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
    <section className="py-4 w-full overflow-hidden">
      <h2 className="text-xl font-bold text-white mb-4 px-4 border-l-4 border-yellow-500 ml-2">
        {title}
      </h2>
      
      {/* Kapsayıcıya 'w-full' ve 'overflow-x-auto' veriyoruz. 
         İçindeki flex yapısının 'inline-flex' olması, genişliğin 
         dışarıyı zorlamasını engellemeye yardımcı olur.
      */}
      <div className="w-full">
        <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-2 scroll-smooth">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none">
              <MovieCard movie={movie} />
            </div>
          ))}
          {/* Sona biraz boşluk ekleyerek son kartın yapışmasını önleyelim */}
          <div className="flex-none w-4" />
        </div>
      </div>
    </section>
  );
}