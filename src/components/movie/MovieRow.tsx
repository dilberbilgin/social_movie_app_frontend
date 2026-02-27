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
    <section className="py-6">
      <h2 className="text-xl font-bold text-white mb-4 px-4 border-l-4 border-yellow-500 ml-2">
        {title}
      </h2>
      <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
//           <Link 
//             href={`/movies/${movie.id}`} 
//             key={movie.id}
//             className="min-w-40 md:min-w-50 group transition-transform hover:scale-105"
//           >
//             {/* <div className="aspect-2/3 relative rounded-lg overflow-hidden border border-gray-800">
//               <img 
//                 src={movie.posterUrl || '/no-poster.png'} 
//                 alt={movie.title}
//                 className="object-cover w-full h-full"
//               />
//               <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black p-2">
//                 <span className="text-yellow-500 font-bold text-xs">⭐ {movie.clubRating.toFixed(1)}</span>
//               </div>
//             </div> */}
//             <div className="aspect-2/3 relative rounded-xl overflow-hidden border border-gray-800 shadow-lg">
//   <img 
//     src={movie.posterUrl || '/no-poster.png'} 
//     alt={movie.title}
//     className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
//   />
  
//   {/* Alt Bilgi Şeridi: Gradyan arka plan ile daha okunaklı */}
//   <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black via-black/60 to-transparent px-3 py-2.5 flex justify-between items-center">
    
//     {/* Sol: Rating (Yıldız) */}
//     <div className="flex items-center gap-1 bg-black/40 px-2 py-2 rounded-full backdrop-blur-sm">
//        <span className="text-yellow-500 font-bold text-sm flex items-center gap-1">
//          <span className="text-[10px]">⭐</span> {movie.clubRating.toFixed(1)}
//        </span>
//     </div>
    
//     {/* Sağ: Like Count (Kalp) */}
//     <div className="flex items-center gap-1 bg-black/40 px-2 py-2 rounded-full backdrop-blur-sm">
//       <Heart size={12} className="text-red-500" fill="currentColor" />
//       <span className="text-white font-bold text-sm leading-none">
//         {movie.likeCount || 0}
//       </span>
//     </div>
//   </div>
// </div>
//             <h3 className="text-sm font-medium mt-2 text-gray-300 truncate">{movie.title}</h3>
//           </Link>
        ))}
      </div>
    </section>
  );
}