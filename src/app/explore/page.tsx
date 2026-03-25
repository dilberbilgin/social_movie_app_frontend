
// 'use client';

// import { useState, useEffect } from 'react';
// import { useMovies } from '@/hooks/useMovies';
// import { genreService } from '@/services/genreService';
// import { userService } from '@/services/userService';
// import { Genre, UserResponse } from '@/types';
// import { useTranslation } from '@/context/LanguageContext';
// import Link from 'next/link';
// import { Heart } from 'lucide-react';
// import MovieCard from '@/components/movie/MovieCard';

// export default function ExplorePage() {
//   const { t, lang } = useTranslation();
//   const { movies, loading, fetchMovies } = useMovies();
//   const [genres, setGenres] = useState<Genre[]>([]);
//   const [filters, setFilters] = useState({ title: '', genreId: '' });
  
//   const [suggestedUsers, setSuggestedUsers] = useState<UserResponse[]>([]);
//   const [usersLoading, setUsersLoading] = useState(true);
//   const [searchedUsers, setSearchedUsers] = useState<UserResponse[]>([]);

//   useEffect(() => {
//     genreService.getAllGenres().then(res => res.success && setGenres(res.data));
    
//     setUsersLoading(true);
//     // LİMİT: 10 kişi yeterli. Daha fazlası hem dikkat dağıtır hem performans yer.
//     userService.getSuggestedUsers(10).then(res => {
//       if (res.success) setSuggestedUsers(res.data);
//       setUsersLoading(false);
//     });

//     fetchMovies(); 
//   }, [lang]);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchMovies(filters);
//     }, 500); 
//     return () => clearTimeout(delayDebounceFn);
//   }, [filters]);


//   return (
//     <main className="p-6 max-w-7xl mx-auto">
      
//       {/* --- YENİ BÖLÜM: SUGGESTED USERS (Slider Style) --- */}
//       <section className="mb-8">
//         <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//           <span className="text-yellow-500">✨</span> {t('explore.suggestedUsers') || 'Suggested for you'}
//         </h2>

        
//         {/* Yatay Kaydırma Alanı */}
//         <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
//           {usersLoading ? (
//             [...Array(6)].map((_, i) => (
//               <div key={i} className="min-w-30 md:min-w-37.5 bg-gray-800 animate-pulse h-36 rounded-2xl" />
//             ))
//           ) : (
//             suggestedUsers.map((user) => (
//               <Link 
//                 href={`/profile/${user.username}`} 
//                 key={user.id}
//                 className="min-w-30 md:min-w-37.5 snap-start bg-gray-800/40 border border-gray-700/50 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-gray-800 transition-all group"
//               >
//                 <div className="w-14 h-14 rounded-full bg-linear-to-tr from-gray-700 to-gray-600 p-0.5 mb-3 group-hover:from-yellow-500 group-hover:to-orange-500 transition-all">
//                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-xl">
//                       👤
//                    </div>
//                 </div>
//                 <span className="text-xs font-bold text-white truncate w-full px-1">
//                   {user.username}
//                 </span>
//                 <span className="text-[9px] text-yellow-600 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                    {t('common.viewProfile') || 'VIEW'}
//                 </span>
//               </Link>
//             ))
//           )}
//         </div>
//       </section>


//       <hr className="border-gray-800/50 mb-8" />

//       {/* --- FİLTRELER --- */}
//       <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
//         <div className="flex-1 w-full">
//           <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest ml-1">{t('explore.search')}</label>
//           <input 
//             type="text"
//             placeholder={t('explore.searchPlaceholder')}
//             className="w-full bg-gray-800/50 border border-gray-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
//             onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
//           />
//         </div>
//         <div className="w-full md:w-64">
//           <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest ml-1">{t('explore.category')}</label>
//           <select 
//             className="w-full bg-gray-800/50 border border-gray-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none transition-all cursor-pointer"
//             onChange={(e) => setFilters(prev => ({ ...prev, genreId: e.target.value }))}
//           >
//             <option value="">{t('explore.allGenres')}</option>
//             {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
//           </select>
//         </div>
//       </div>

//       {/* --- FİLM LİSTESİ --- */}
//       {loading ? (
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//            {[...Array(10)].map((_, i) => <div key={i} className="aspect-2/3 bg-gray-800 animate-pulse rounded-2xl" />)}
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//           {movies.map(movie => (
//             <MovieCard key={movie.id} movie={movie} />
//   //           <Link href={`/movies/${movie.id}`} key={movie.id} className="group">
//   //             <div className="aspect-2/3 rounded-2xl overflow-hidden border border-gray-800 group-hover:border-yellow-500/50 transition-all duration-300 relative shadow-2xl">
//   //               <img src={movie.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
//   //               {/* Alt Bilgi Şeridi: Gradyan arka plan ile daha okunaklı */}
//   // <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black via-black/60 to-transparent px-3 py-2.5 flex justify-between items-center">
    
//     // {/* Sol: Rating (Yıldız) */}
//     // <div className="flex items-center gap-1 bg-black/40 px-2 py-2 rounded-full backdrop-blur-sm">
//     //    <span className="text-yellow-500 font-bold text-xs flex items-center gap-1">
//     //      <span className="text-[10px]">⭐</span> {movie.clubRating.toFixed(1)}
//     //    </span> 
//     // </div>
    
//   //   {/* Sağ: Like Count (Kalp) */}
//     // <div className="flex items-center gap-1 bg-black/40 px-2 py-2 rounded-full backdrop-blur-sm">
//     //   <Heart size={12} className="text-red-500" fill="currentColor" />
//     //   <span className="text-white font-bold text-xs leading-none">
//     //     {movie.likeCount || 0}
//     //   </span>
//     // </div>
//   // </div>
//   //               <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
//   //                  <span className="text-white text-xs font-bold">{t('common.details')}</span>
//   //               </div>
//   //             </div>
//   //             <h3 className="text-sm font-bold mt-3 truncate text-white group-hover:text-yellow-500 transition-colors">{movie.title}</h3>
//   //             <p className="text-xs text-gray-500 mt-1">{movie.releaseYear}</p>
//   //           </Link>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }







"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import GenreBar from "@/app/explore/GenreBar";
import MovieCard from "@/components/movie/MovieCard";
import { movieService } from "@/services/movieService";
import { genreService } from "@/services/genreService";
import { Movie, Genre } from "@/types";
import { Loader2, Sparkles, Film, AlertCircle } from "lucide-react";
import { useTranslation } from '@/context/LanguageContext';

export default function ExplorePage() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState(""); // "" = ALL
  
  const { lang } = useTranslation();

  // Pagination & Loading States
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  // 1. İlk Yükleme: Kategoriler ve Öne Çıkanlar (Sadece 1 kez çalışır)
  useEffect(() => {
    const initExplore = async () => {
      try {
        const [genreRes, suggestedRes] = await Promise.all([
          genreService.getAllGenres(),
          movieService.getTopRatedMovies()
        ]);
        if (genreRes.success) setGenres(genreRes.data);
        if (suggestedRes.success) setSuggestedMovies(suggestedRes.data);
      } catch (err) {
        console.error("Explore init error:", err);
      }
    };
    initExplore();
  }, [lang]);

  // 2. Hibrit Film Yükleme Fonksiyonu
  const fetchDiscoverMovies = useCallback(async (page: number, genreId: string, isInitial: boolean = false) => {
  if (isInitial) {
    setIsLoading(true);
    setAllMovies([]); 
  } else {
    setIsFetchingMore(true);
  }

  try {
    // KRİTİK DÜZELTME: Eğer genreId boş string ise (ALL seçiliyse), 
    // backend'e genreId parametresini hiç göndermiyoruz veya null gönderiyoruz.
    const filters = genreId && genreId !== "" ? { genreId } : undefined;
    
    // movieService.discoverMovies artık filters içindeki genreId'yi 
    // sadece varsa query param olarak eklemeli.
    const res = await movieService.discoverMovies(filters, page, 20);
    
    if (res.success && res.data) {
      const { content, last } = res.data;
      setAllMovies(prev => isInitial ? content : [...prev, ...content]);
      setHasMore(!last && content.length > 0);
    }
  } catch (error) {
    console.error("Discovery error:", error);
    setHasMore(false);
  } finally {
    setIsLoading(false);
    setIsFetchingMore(false);
  }
}, [lang]);

  // 3. Kategori (Genre) veya DİL Değişimi Takibi
  useEffect(() => {
    setCurrentPage(0);
    setHasMore(true);
    fetchDiscoverMovies(0, selectedGenreId, true);
  }, [selectedGenreId, fetchDiscoverMovies, lang]);

  // 4. Infinite Scroll Mekanizması
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !isLoading) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchDiscoverMovies(nextPage, selectedGenreId);
        }
      },
      { threshold: 0.1, rootMargin: "400px" } // Kullanıcı yaklaşınca daha erken yükle
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, isFetchingMore, isLoading, currentPage, selectedGenreId, fetchDiscoverMovies]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-16 animate-in fade-in duration-700">
      
      {/* --- SECTION 1: SUGGESTED (HORIZONTAL SLIDER) --- */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
            <Sparkles className="text-yellow-500" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Suggested For You</h2>
            <p className="text-gray-400 text-sm">Top rated gems from our club members</p>
          </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
          {suggestedMovies.length > 0 ? (
            suggestedMovies.map((movie) => (
              <div key={`suggested-${movie.id}`} className="min-w-[220px] w-[220px] snap-start hover:scale-105 transition-transform duration-300">
                <MovieCard movie={movie} />
              </div>
            ))
          ) : (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="min-w-[220px] h-[330px] bg-gray-900/50 animate-pulse rounded-2xl border border-gray-800" />
            ))
          )}
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* --- SECTION 2: BROWSE & DISCOVER (GRID) --- */}
      <section className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Film className="text-blue-500" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Browse All</h2>
          </div>
          
          {/* Netflix Style Genre Bar */}
          <div className="w-full lg:w-auto overflow-hidden">
            <GenreBar 
              genres={genres} 
              selectedGenreId={selectedGenreId} 
              onSelect={setSelectedGenreId} 
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
            ))}
          </div>
        ) : (
          <>
            {allMovies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                {allMovies.map((movie, index) => (
                  <div key={`${movie.id}-${index}`} className="animate-in zoom-in-95 duration-500">
                     <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-gray-900/20 border-2 border-dashed border-gray-800 rounded-[3rem] space-y-4">
                <AlertCircle className="text-gray-600" size={48} />
                <p className="text-gray-400 text-lg font-medium italic text-center">
                  No movies found in this corner of the universe.
                </p>
              </div>
            )}

            {/* INFINITE SCROLL TARGET */}
            <div ref={observerTarget} className="py-20 flex flex-col items-center justify-center gap-6">
              {isFetchingMore ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-yellow-500" size={40} />
                  <span className="text-yellow-500/60 text-xs font-bold tracking-[0.2em] uppercase">Scanning global databases...</span>
                </div>
              ) : !hasMore && allMovies.length > 0 ? (
                <div className="group flex flex-col items-center gap-4">
                  <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                  <p className="text-gray-500 text-sm font-medium tracking-wide">THE END. YOU'VE SEEN IT ALL.</p>
                </div>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}