// 'use client';

// import { useEffect, useState } from 'react';
// import { movieService } from '@/services/movieService';
// import { Movie } from '@/types';
// import { useTranslation } from '@/context/LanguageContext';
// import Link from 'next/link';

// export default function Home() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { t, lang } = useTranslation(); // 'lang' bilgisini de aldık

//   useEffect(() => {
//     const fetchMovies = async () => {
//       setLoading(true); // Dil değiştiğinde yükleniyor ibaresini tekrar gösterir
//       try {
//         // Parametre göndermiyoruz, api.ts içindeki interceptor 
//         // localStorage'daki güncel dili otomatik ekliyor.
//         const response = await movieService.getTrendingMovies();
//         if (response.success) {
//           setMovies(response.data);
//         }
//       } catch (error) {
//         console.error("Movie Fetch Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMovies();
//   }, [lang]); // KRİTİK NOKTA: Dil değiştiğinde bu useEffect tekrar çalışır!

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
//       </div>
//     );
//   }

//   return (
//     <main className="py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center text-yellow-500">
//         {t('home.trendTitle')} {/* Metinleri JSON'dan çekiyoruz */}
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {movies.map((movie) => (
//   <Link 
//     href={`/movies/${movie.id}`} 
//     key={movie.id} 
//     className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 border border-gray-700"
//   >
//     {/* Görsel Konteyneri */}
//     <div className="relative aspect-2/3 w-full bg-gray-900"> {/* h-96 yerine aspect-[2/3] daha güvenlidir */}
//       <img 
//         src={movie.posterUrl || '/no-poster.png'} 
//         alt={movie.title} 
//         className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70"
//       />
//       {/* Detay Butonu Hover Efekti */}
//       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//         <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold shadow-xl">
//           {t('movie.details')}
//         </span>
//       </div>
//     </div>

//     {/* Alt Bilgiler */}
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-2 line-clamp-1 group-hover:text-yellow-500 transition-colors">
//         {movie.title}
//       </h2>
//       <div className="flex justify-between text-sm text-gray-400">
//         <span>{movie.releaseYear}</span>
//         <span className="text-yellow-400 font-bold">⭐ {movie.clubRating?.toFixed(1) || "0.0"}</span>
//       </div>
//       <p className="mt-2 text-gray-400 text-xs line-clamp-2 leading-relaxed h-8">
//         {movie.description}
//       </p>
//     </div>
//   </Link>
//         ))}
//       </div>
//     </main>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { movieService } from '@/services/movieService';
import { Movie } from '@/types';
import { useTranslation } from '@/context/LanguageContext';
import MovieRow from '@/components/movie/MovieRow';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useTranslation();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [trendRes, topRes] = await Promise.all([
          movieService.getTrendingMovies(),
          movieService.getTopRatedMovies()
        ]);
        
        if (trendRes.success) setTrending(trendRes.data);
        if (topRes.success) setTopRated(topRes.data);
      } catch (error) {
        console.error("Dashboard Load Error", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [lang]);

  if (loading) return <LoadingSpinner />;

  return (
    <main className="min-h-screen bg-gray-950 pb-20">
      {/* Hero Banner (Öne Çıkan Tek Bir Film) */}
      <div className="h-[50vh] relative flex items-center px-8 bg-linear-to-r from-black to-transparent">
        <div className="z-10 max-w-2xl">
          <h1 className="text-5xl font-black text-white mb-4 uppercase italic tracking-tighter">
             {t('home.welcomeTitle')}
          </h1>
          <p className="text-gray-400 text-lg mb-6">{t('home.welcomeSubtitle')}</p>
        </div>
      </div>

      <div className="space-y-8 -mt-20 relative z-20">
        <MovieRow title={t('home.trending')} movies={trending} />
        <MovieRow title={t('home.topRated')} movies={topRated} />
        
        {/* Buraya gelecekte Sosyal Akış (Social Feed) gelecek */}
        <section className="px-4">
           <div className="bg-gray-900/50 p-10 rounded-3xl border border-dashed border-gray-800 text-center">
              <h3 className="text-gray-500 font-medium">{t('home.socialFeedPlaceholder')}</h3>
              <p className="text-xs text-gray-700 mt-2 italic">Arkadaşlarının aktiviteleri yakında burada görünecek...</p>
           </div>
        </section>
      </div>
    </main>
  );
}