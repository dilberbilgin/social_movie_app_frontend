
'use client';

import { useState, useEffect } from 'react';
import { useMovies } from '@/hooks/useMovies';
import { genreService } from '@/services/genreService';
import { userService } from '@/services/userService';
import { Genre, UserResponse } from '@/types';
import { useTranslation } from '@/context/LanguageContext';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import MovieCard from '@/components/movie/MovieCard';

export default function ExplorePage() {
  const { t, lang } = useTranslation();
  const { movies, loading, fetchMovies } = useMovies();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filters, setFilters] = useState({ title: '', genreId: '' });
  
  const [suggestedUsers, setSuggestedUsers] = useState<UserResponse[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchedUsers, setSearchedUsers] = useState<UserResponse[]>([]);

  useEffect(() => {
    genreService.getAllGenres().then(res => res.success && setGenres(res.data));
    
    setUsersLoading(true);
    // LİMİT: 10 kişi yeterli. Daha fazlası hem dikkat dağıtır hem performans yer.
    userService.getSuggestedUsers(10).then(res => {
      if (res.success) setSuggestedUsers(res.data);
      setUsersLoading(false);
    });

    fetchMovies(); 
  }, [lang]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMovies(filters);
    }, 500); 
    return () => clearTimeout(delayDebounceFn);
  }, [filters]);


  return (
    <main className="p-6 max-w-7xl mx-auto">
      
      {/* --- YENİ BÖLÜM: SUGGESTED USERS (Slider Style) --- */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-yellow-500">✨</span> {t('explore.suggestedUsers') || 'Suggested for you'}
        </h2>

        
        {/* Yatay Kaydırma Alanı */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {usersLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="min-w-30 md:min-w-37.5 bg-gray-800 animate-pulse h-36 rounded-2xl" />
            ))
          ) : (
            suggestedUsers.map((user) => (
              <Link 
                href={`/profile/${user.username}`} 
                key={user.id}
                className="min-w-30 md:min-w-37.5 snap-start bg-gray-800/40 border border-gray-700/50 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-gray-800 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-linear-to-tr from-gray-700 to-gray-600 p-0.5 mb-3 group-hover:from-yellow-500 group-hover:to-orange-500 transition-all">
                   <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-xl">
                      👤
                   </div>
                </div>
                <span className="text-xs font-bold text-white truncate w-full px-1">
                  {user.username}
                </span>
                <span className="text-[9px] text-yellow-600 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   {t('common.viewProfile') || 'VIEW'}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>


      <hr className="border-gray-800/50 mb-8" />

      {/* --- FİLTRELER --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
        <div className="flex-1 w-full">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest ml-1">{t('explore.search')}</label>
          <input 
            type="text"
            placeholder={t('explore.searchPlaceholder')}
            className="w-full bg-gray-800/50 border border-gray-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none transition-all"
            onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="w-full md:w-64">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest ml-1">{t('explore.category')}</label>
          <select 
            className="w-full bg-gray-800/50 border border-gray-700 p-3 rounded-xl text-white focus:border-yellow-500 outline-none transition-all cursor-pointer"
            onChange={(e) => setFilters(prev => ({ ...prev, genreId: e.target.value }))}
          >
            <option value="">{t('explore.allGenres')}</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      </div>

      {/* --- FİLM LİSTESİ --- */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
           {[...Array(10)].map((_, i) => <div key={i} className="aspect-2/3 bg-gray-800 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
  //           <Link href={`/movies/${movie.id}`} key={movie.id} className="group">
  //             <div className="aspect-2/3 rounded-2xl overflow-hidden border border-gray-800 group-hover:border-yellow-500/50 transition-all duration-300 relative shadow-2xl">
  //               <img src={movie.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
  //               {/* Alt Bilgi Şeridi: Gradyan arka plan ile daha okunaklı */}
  // <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black via-black/60 to-transparent px-3 py-2.5 flex justify-between items-center">
    
    // {/* Sol: Rating (Yıldız) */}
    // <div className="flex items-center gap-1 bg-black/40 px-2 py-2 rounded-full backdrop-blur-sm">
    //    <span className="text-yellow-500 font-bold text-xs flex items-center gap-1">
    //      <span className="text-[10px]">⭐</span> {movie.clubRating.toFixed(1)}
    //    </span>
    // </div>
    
  //   {/* Sağ: Like Count (Kalp) */}
    // <div className="flex items-center gap-1 bg-black/40 px-2 py-2 rounded-full backdrop-blur-sm">
    //   <Heart size={12} className="text-red-500" fill="currentColor" />
    //   <span className="text-white font-bold text-xs leading-none">
    //     {movie.likeCount || 0}
    //   </span>
    // </div>
  // </div>
  //               <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
  //                  <span className="text-white text-xs font-bold">{t('common.details')}</span>
  //               </div>
  //             </div>
  //             <h3 className="text-sm font-bold mt-3 truncate text-white group-hover:text-yellow-500 transition-colors">{movie.title}</h3>
  //             <p className="text-xs text-gray-500 mt-1">{movie.releaseYear}</p>
  //           </Link>
          ))}
        </div>
      )}
    </main>
  );
}