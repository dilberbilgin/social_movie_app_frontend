// // // src/components/layout/SearchModal.tsx
// // "use client";

// // import { X, Search as SearchIcon, History } from "lucide-react";
// // import { useState } from "react";

// // export default function SearchModal({ onClose }: { onClose: () => void }) {
// //   const [query, setQuery] = useState("");

// //   return (
// //     <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
// //       {/* Arka plan karartması (tıklayınca kapanır) */}
// //       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
// //       {/* Modal İçeriği - Sidebar'ın hemen yanından başlar */}
// //       <div className="relative ml-16 xl:ml-64 w-full max-w-md h-full bg-gray-900 border-r border-gray-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
// //         <div className="p-6 border-b border-gray-800">
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className="text-2xl font-bold">Search</h2>
// //             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
// //           </div>
          
// //           <div className="relative">
// //             <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
// //             <input 
// //               autoFocus
// //               type="text"
// //               placeholder="Search movies or users..."
// //               className="w-full bg-gray-800 border-none rounded-lg py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
// //               onChange={(e) => setQuery(e.target.value)}
// //             />
// //           </div>
// //         </div>

// //         {/* Son Aramalar / Öneriler */}
// //         <div className="flex-1 overflow-y-auto p-6">
// //           <div className="flex justify-between items-center mb-4">
// //             <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Searches</span>
// //             <button className="text-xs text-blue-500 font-bold hover:text-blue-400 transition-colors">Clear All</button>
// //           </div>
          
// //           {/* Örnek Liste */}
// //           <div className="space-y-4">
// //             <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer group">
// //               <History size={16} className="text-gray-500" />
// //               <span className="text-sm">Inception</span>
// //             </div>
// //             {/* Buraya dinamik arama sonuçları veya geçmiş gelecek */}
// //             <p className="text-xs text-gray-600 italic mt-10 text-center">
// //               Looking for someone? Try typing a movie title or username.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { X, Search as SearchIcon, User, Film, Loader2 } from "lucide-react";
// import { userService } from "@/services/userService";
// import { movieService } from "@/services/movieService";
// import { UserResponse, Movie } from "@/types";
// import { useTranslation } from "@/context/LanguageContext";
// import Link from "next/link";
// import { History } from "lucide-react";

// export default function SearchModal({ onClose }: { onClose: () => void }) {
//   const { lang, t } = useTranslation();
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<{ users: UserResponse[]; movies: Movie[] }>({
//     users: [],
//     movies: [],
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (query.length < 2) {
//       setResults({ users: [], movies: [] });
//       return;
//     }

//     const delayDebounceFn = setTimeout(async () => {
//       setIsLoading(true);
//       try {
//         // Her iki servisi aynı anda (parallel) çağırıyoruz
//         const [userRes, movieRes] = await Promise.all([
//           userService.searchUsers(query, lang, 0, 5), // Sayfa 0, limit 5
//           movieService.searchMovies({ title: query })
//         ]);

//         setResults({
//           users: userRes.success ? userRes.data.content : [],
//           movies: movieRes.success ? movieRes.data : [],
//         });
//       } catch (error) {
//         console.error("Search error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 500); // Kullanıcı yazmayı bıraktıktan 500ms sonra ara

//     return () => clearTimeout(delayDebounceFn);
//   }, [query, lang]);

//   return (
//     <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
//       <div className="relative ml-16 xl:ml-64 w-full max-w-md h-full bg-gray-900 border-r border-gray-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 text-white">
//         {/* Header & Input */}
//         <div className="p-6 border-b border-gray-800">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold">{t('nav.search') || "Search"}</h2>
//             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
//           </div>
          
//           <div className="relative">
//             {isLoading ? (
//               <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 animate-spin" size={18} />
//             ) : (
//               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
//             )}
//             <input 
//               autoFocus
//               type="text"
//               placeholder={t('nav.searchUserPlaceholder') || "Search movies or users..."}
//               className="w-full bg-gray-800 border-none rounded-lg py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-yellow-500 text-sm transition-all"
//               onChange={(e) => setQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Sonuç Listesi */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar">
//           {query.length >= 2 ? (
//             <div className="p-2">
//               {/* KULLANICI SONUÇLARI */}
//               {results.users.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Users</h3>
//                   {results.users.map((user) => (
//                     <Link 
//                       key={user.id} 
//                       href={`/profile/${user.username}`} 
//                       onClick={onClose}
//                       className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors group"
//                     >
//                       <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 group-hover:border-yellow-500 transition-colors">
//                         <User size={20} className="text-gray-400" />
//                       </div>
//                       <span className="font-medium text-sm">{user.username}</span>
//                     </Link>
//                   ))}
//                 </div>
//               )}

//               {/* FİLM SONUÇLARI */}
//               {results.movies.length > 0 && (
//                 <div>
//                   <h3 className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Movies</h3>
//                   {results.movies.map((movie) => (
//                     <Link 
//                       key={movie.id} 
//                       href={`/movies/${movie.id}`} 
//                       onClick={onClose}
//                       className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors group"
//                     >
//                       <div className="w-10 h-14 bg-gray-800 rounded-md overflow-hidden border border-gray-700 group-hover:border-yellow-500 transition-colors relative">
//                         {movie.posterUrl ? (
//                           <img src={movie.posterUrl} className="w-full h-full object-cover" alt="" />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center"><Film size={16} /></div>
//                         )}
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="font-medium text-sm group-hover:text-yellow-500 transition-colors">{movie.title}</span>
//                         <span className="text-xs text-gray-500">{movie.releaseYear}</span>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               )}

//               {results.users.length === 0 && results.movies.length === 0 && !isLoading && (
//                 <p className="text-center text-gray-500 mt-10 text-sm italic">{t('nav.noResults') || "No results found."}</p>
//               )}
//             </div>
//           ) : (
//             <div className="p-10 text-center flex flex-col items-center justify-center h-full">
//               <History size={48} className="text-gray-800 mb-4" />
//               <p className="text-gray-500 text-sm">Type at least 2 characters to start searching.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { X, Search as SearchIcon, User, Film, Loader2, History, ChevronRight } from "lucide-react";
import { searchService } from "@/services/searchService";
import { GlobalSearchResponse, SearchResultDto } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const { lang, t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await searchService.globalSearch(query, lang);
        if (res.success) {
          setResults(res.data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms ideal bir gecikmedir

    return () => clearTimeout(delayDebounceFn);
  }, [query, lang]);

  // Yardımcı Render Fonksiyonu
  // const renderItem = (item: SearchResultDto) => {
  //   if (!item) return null;
    
  //   const isMovie = item.type === "MOVIE";
  //   const href = isMovie ? `/movies/${item.id}` : `/profile/${item.title}`;

  const renderItem = (item: SearchResultDto) => {
    if (!item) return null;

    const isMovie = item.type === "MOVIE";
    const href = isMovie ? `/movies/${item.id}` : `/profile/${item.title}`;

    const TMDB_BASE_URL = "https://image.tmdb.org/t/p/w200";
    
    // Sadece geçerli bir path varsa URL oluştur, yoksa null bırak
    const displayImage = item.imageUrl && item.imageUrl !== "null"
      ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${TMDB_BASE_URL}${item.imageUrl}`)
      : null;

    return (
      // <Link 
      //   key={`${item.type}-${item.id}`} 
      //   href={href} 
      //   onClick={onClose}
      //   className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all group border border-transparent hover:border-gray-800"
      // >
      //   <div className={`overflow-hidden border border-gray-800 group-hover:border-yellow-500 transition-colors flex-shrink-0
      //     ${isMovie ? "w-10 h-14 rounded-md" : "w-12 h-12 rounded-full"}`}>
      //     {item.imageUrl ? (
      //       <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
      //     ) : (
      //       <div className="w-full h-full bg-gray-800 flex items-center justify-center">
      //         {isMovie ? <Film size={18} className="text-gray-500" /> : <User size={20} className="text-gray-500" />}
      //       </div>
      //     )}
      //   </div>
        
      //   <div className="flex-1 min-w-0">
      //     <p className="font-bold text-sm truncate group-hover:text-yellow-500 transition-colors">{item.title}</p>
      //     <p className="text-xs text-gray-500 truncate">{item.subTitle}</p>
      //   </div>
      //   <ChevronRight size={16} className="text-gray-700 group-hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-all" />
      // </Link>

      <Link 
        key={`${item.type}-${item.id}`} 
        href={href} 
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all group border border-transparent hover:border-gray-800"
      >
        <div className={`overflow-hidden border border-gray-800 group-hover:border-yellow-500 transition-colors flex-shrink-0 bg-gray-900
          ${isMovie ? "w-10 h-14 rounded-md" : "w-12 h-12 rounded-full"}`}>
          
          {displayImage ? (
            <img 
              src={displayImage} 
              className="w-full h-full object-cover" 
              alt={item.title} 
              // Resim yüklenirken hata oluşursa (404 vb.) resmi gizle ve ikonu göster
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement?.classList.add('flex', 'items-center', 'justify-center');
              }}
            />
          ) : (
            /* Resim yoksa direkt ikon göster */
            <div className="w-full h-full flex items-center justify-center">
              {isMovie ? <Film size={18} className="text-gray-600" /> : <User size={20} className="text-gray-600" />}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate group-hover:text-yellow-500 transition-colors">{item.title}</p>
          <p className="text-xs text-gray-500 truncate">{item.subTitle}</p>
        </div>
        <ChevronRight size={16} className="text-gray-700 group-hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-all" />
      </Link>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative ml-16 xl:ml-64 w-full max-w-md h-full bg-black border-r border-gray-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 text-white">
        {/* Input Bölümü */}
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tighter">SEARCH</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
          </div>
          
          <div className="relative">
            <input 
              autoFocus
              type="text"
              value={query}
              placeholder="Movies, actors, friends..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all text-sm"
              onChange={(e) => setQuery(e.target.value)}
            />
            {isLoading ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 animate-spin" size={20} />
            ) : (
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            )}
          </div>
        </div>

        {/* Sonuçlar */}
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          {!results && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <History size={40} className="mb-4" />
              <p className="text-sm font-medium">No recent searches</p>
            </div>
          ) : (
            <div className="space-y-8 pb-10">
              {/* TOP RESULTS */}
              {results?.topResults && results.topResults.length > 0 && (
                <div>
                  <h3 className="px-4 mb-2 text-xs font-black text-gray-500 uppercase tracking-widest">Top Results</h3>
                  {results.topResults.map(renderItem)}
                </div>
              )}

              {/* MOVIES */}
              {results?.movies && results.movies.length > 0 && (
                <div>
                  <h3 className="px-4 mb-2 text-xs font-black text-gray-500 uppercase tracking-widest">Movies</h3>
                  {results.movies.map(renderItem)}
                </div>
              )}

              {/* USERS */}
              {results?.users && results.users.length > 0 && (
                <div>
                  <h3 className="px-4 mb-2 text-xs font-black text-gray-500 uppercase tracking-widest">Users</h3>
                  {results.users.map(renderItem)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

