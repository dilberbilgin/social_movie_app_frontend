// "use client";

// import { useState, useEffect } from "react";
// import { X, Search as SearchIcon, History, Film, User, Loader2, ChevronRight } from "lucide-react";
// import { searchService } from "@/services/searchService";
// import { GlobalSearchResponse, SearchResultDto } from "@/types";
// import { useTranslation } from "@/context/LanguageContext";
// import Link from "next/link";

// export default function SearchModal({ onClose }: { onClose: () => void }) {
//   const { lang, t } = useTranslation();
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<GlobalSearchResponse | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Debounce Mekanizması: Kullanıcı yazmayı bıraktıktan 400ms sonra arama yapar
//   useEffect(() => {
//     if (query.trim().length < 2) {
//       setResults(null);
//       setIsLoading(false);
//       return;
//     }

//     const delayDebounceFn = setTimeout(async () => {
//       setIsLoading(true);
//       try {
//         const res = await searchService.globalSearch(query, lang);
//         if (res.success) {
//           setResults(res.data);
//         }
//       } catch (error) {
//         console.error("Search error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 400);

//     return () => clearTimeout(delayDebounceFn);
//   }, [query, lang]);

//   const renderItem = (item: SearchResultDto) => {
//     const isMovie = item.type === "MOVIE";
    
//     // Hibrit Link Yapısı
//     const isLocalId = typeof item.id === 'string' && item.id.includes('-');
//     const href = isMovie 
//       ? (isLocalId ? `/movies/${item.id}` : `/movies/0?tmdbId=${item.id}`)
//       : `/profile/${item.title}`;

//     // Görsel URL Mantığı
//     // const getImageUrl = () => {
//     //   if (!item.imageUrl || item.imageUrl === "null") return null;
//     //   if (item.imageUrl.startsWith('http')) return item.imageUrl;
//     //   return `https://image.tmdb.org/t/p/w200${item.imageUrl}`;
//     // };
//     const getImageUrl = () => {
//             if (!item.imageUrl || item.imageUrl === "null" || item.imageUrl === "") return null;
//             if (item.imageUrl.startsWith('http')) return item.imageUrl;
//             return `https://image.tmdb.org/t/p/w200${item.imageUrl}`;
//         };

//     const displayImage = getImageUrl();

//     return (
//       <Link 
//         key={`${item.type}-${item.id}`} 
//         href={href} 
//         onClick={onClose}
//         className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 rounded-xl transition-all group"
//       >
//         {/* Görsel Alanı */}
//         <div className={`relative shrink-0 bg-gray-800 overflow-hidden shadow-lg ${isMovie ? "w-10 h-14 rounded-md" : "w-12 h-12 rounded-full border border-gray-700"}`}>
//           {displayImage ? (
//             <img 
//               src={displayImage} 
//               className="w-full h-full object-cover" 
//               alt={item.title}
//               // Hata durumunda (404 veya DNS hatası) görseli gizle, ikona düşmesini sağla
//               // onError={(e) => {
//               //   (e.target as HTMLImageElement).style.display = 'none';
//               //   (e.target as HTMLImageElement).parentElement!.classList.add('flex-center-all'); // Yardımcı class
//               // }}
//               onError={(e) => {
//                                 const target = e.currentTarget;
//                                 // Hata olduğunda görseli tamamen kaldır ve döngüyü kır
//                                 target.style.display = 'none';
//                                 // Şeffaf bir 1x1 görsel atayarak tarayıcının tekrar denemesini engelle
//                                 target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
//                             }}
//             />
//           ) : null}
          
//           {/* Fallback İkon (Görsel yoksa veya hata verdiyse gözükür) */}
//           {/* <div className="absolute inset-0 flex items-center justify-center -z-10 bg-gray-800">
//             {isMovie ? <Film size={18} className="text-gray-600" /> : <User size={20} className="text-gray-600" />}
//           </div> */}

//           {/* Fallback İkon: Görsel yoksa veya hata verip gizlendiyse arkadaki bu ikon görünür */}
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
//                         {isMovie ? <Film size={18} className="text-gray-600" /> : <User size={20} className="text-gray-600" />}
//                     </div>
                    
//         </div>
        
//         {/* Metin Alanı */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2">
//             <p className="font-bold text-sm text-gray-100 truncate group-hover:text-yellow-500 transition-colors">
//               {item.title}
//             </p>
//             {/* Küçük bir tag ekleyerek kullanıcıyı bilgilendirebiliriz */}
//             {!isLocalId && isMovie && (
//               <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1 rounded uppercase">
//                 {t('search.exploreTag')}
//                 </span>
//             )}
//           </div>
//           <p className="text-xs text-gray-500 truncate">{item.subTitle || (isMovie ? 'Movie' : 'User')}</p>
//         {/* AÇIKLAMA (Description) - Burayı ekledik */}
//   {item.description && (
//     <p className="text-[11px] text-gray-400 leading-tight line-clamp-2 italic opacity-80 group-hover:opacity-100 transition-opacity">
//       {item.description}
//     </p>
//   )}
//         </div>
        
//         <ChevronRight size={14} className="text-gray-700 group-hover:text-yellow-500 transform group-hover:translate-x-1 transition-all" />
//       </Link>
//     );
//   };

//   return (
//     <div className="fixed inset-0 z-100 flex animate-in fade-in duration-300">
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
//       <div className="relative ml-16 xl:ml-64 w-full max-w-md h-full bg-background border-r border-gray-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 text-white">
        
//         {/* Search Header */}
//         <div className="p-6 border-b border-gray-800">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-black tracking-tighter">{t('search.title')}</h2>
//             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
//               <X size={20} />
//             </button>
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
//               value={query}
//               placeholder={t('search.placeholder')}
//               className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm transition-all"
//               onChange={(e) => setQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Results / Suggestions Section */}
//         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//           {!results && !isLoading && (
//             <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
//               <History size={40} className="mb-3" />
//               <p className="text-xs font-bold uppercase tracking-widest">{t('search.typeToExplore')}</p>
//             </div>
//           )}

//           {results && (
//             <div className="space-y-6">
//               {/* Movies Group */}
//               {results.movies.length > 0 && (
//                 <section>
//                   <h3 className="px-4 mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('search.movies')}</h3>
//                   {results.movies.map(renderItem)}
//                 </section>
//               )}

//               {/* Users Group */}
//               {results.users.length > 0 && (
//                 <section>
//                   <h3 className="px-4 mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('search.users')}</h3>
//                   {results.users.map(renderItem)}
//                 </section>
//               )}

//               {results.movies.length === 0 && results.users.length === 0 && (
//                 <div className="text-center py-20 text-gray-600 italic text-sm">{t('search.noResults')}</div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { X, Search as SearchIcon, History, Film, User, Loader2, ChevronRight } from "lucide-react";
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
      setIsLoading(false);
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
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, lang]);

  const renderItem = (item: SearchResultDto) => {
    const isMovie = item.type === "MOVIE";
    const isLocalId = typeof item.id === 'string' && item.id.includes('-');
    const href = isMovie 
      ? (isLocalId ? `/movies/${item.id}` : `/movies/0?tmdbId=${item.id}`)
      : `/profile/${item.title}`;

    const getImageUrl = () => {
      // Hatalı via.placeholder linklerini ayıkla
      if (!item.imageUrl || item.imageUrl.includes("via.placeholder.com") || item.imageUrl === "null" || item.imageUrl === "") return null;
      if (item.imageUrl.startsWith('http')) return item.imageUrl;
      return `https://image.tmdb.org/t/p/w200${item.imageUrl}`;
    };

    const displayImage = getImageUrl();

    return (
      <Link 
        key={`${item.type}-${item.id}`} 
        href={href} 
        onClick={onClose}
        className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 rounded-xl transition-all group"
      >
        <div className={`relative shrink-0 bg-gray-900 overflow-hidden shadow-lg flex items-center justify-center ${isMovie ? "w-10 h-14 rounded-md" : "w-12 h-12 rounded-full border border-gray-800"}`}>
          {displayImage ? (
            <img 
              src={displayImage} 
              className="w-full h-full object-cover z-10" 
              alt={item.title}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                // Döngüyü kırmak için boş bir data-uri ata
                target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
              }}
            />
          ) : null}
          
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            {isMovie ? <Film size={18} className="text-gray-600" /> : <User size={20} className="text-gray-600" />}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-gray-100 truncate group-hover:text-yellow-500 transition-colors">
              {item.title}
            </p>
            {!isLocalId && isMovie && (
              <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1 rounded uppercase">
                {t('search.exploreTag')}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{item.subTitle || (isMovie ? 'Movie' : 'User')}</p>
          {item.description && (
            <p className="text-[11px] text-gray-400 leading-tight line-clamp-2 italic opacity-80 group-hover:opacity-100 transition-opacity">
              {item.description}
            </p>
          )}
        </div>
        <ChevronRight size={14} className="text-gray-700 group-hover:text-yellow-500 transform group-hover:translate-x-1 transition-all" />
      </Link>
    );
  };

  return (
    <div className="fixed inset-0 z-100 flex animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-16 xl:ml-64 w-full max-w-md h-full bg-background border-r border-gray-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 text-white">
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black tracking-tighter">{t('search.title')}</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="relative">
            {isLoading ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 animate-spin" size={18} />
            ) : (
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            )}
            <input 
              autoFocus
              type="text"
              value={query}
              placeholder={t('search.placeholder')}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm transition-all text-white"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {!results && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
              <History size={40} className="mb-3" />
              <p className="text-xs font-bold uppercase tracking-widest">{t('search.typeToExplore')}</p>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              {results.movies.length > 0 && (
                <section>
                  <h3 className="px-4 mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('search.movies')}</h3>
                  {results.movies.map(renderItem)}
                </section>
              )}
              {results.users.length > 0 && (
                <section>
                  <h3 className="px-4 mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('search.users')}</h3>
                  {results.users.map(renderItem)}
                </section>
              )}
              {results.movies.length === 0 && results.users.length === 0 && (
                <div className="text-center py-20 text-gray-600 italic text-sm">{t('search.noResults')}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
