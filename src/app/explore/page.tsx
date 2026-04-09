
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

  useEffect(() => {
  const initExplore = async () => {
    try {
      // 1. Kategorileri çek
      const genreRes = await genreService.getAllGenres();
      if (genreRes.success) setGenres(genreRes.data);

        // 2. Önerilen filmleri çek
      const suggestedRes = await movieService.getSuggestedMovies(0, 10);
      
      if (suggestedRes.success && suggestedRes.data) {
        // PageResponse döndüğü için .content alıyoruz
        setSuggestedMovies(suggestedRes.data.content);
      }
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
    //  Eğer genreId boş string ise (ALL seçiliyse), 
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
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
            <Sparkles className="text-yellow-500" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Suggested For You</h2>
            <p className="text-gray-400 text-sm">Top rated gems from our club members</p>
          </div>
        </div>
        
        <div className="flex overflow-x-auto pb-4 no-scrollbar snap-x">
          {suggestedMovies.length > 0 ? (
            suggestedMovies.map((movie) => (
              <div key={`suggested-${movie.id}`} className="min-w-55 w-55 snap-start">
                <MovieCard movie={movie} />
              </div>
            ))
          ) : (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="min-w-55 h-82.5 bg-gray-900/50 animate-pulse rounded-2xl border border-gray-800" />
            ))
          )}
        </div>
      </section>

      {/* <div className="h-px bg-linear-to-r from-transparent via-gray-800 to-transparent" /> */}

      {/* --- SECTION 2: BROWSE & DISCOVER (GRID) --- */}
      <section className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between ">
          <div className="flex items-center gap-3">
            
            {/* <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Film className="text-blue-500" size={20} />
            </div> */}
            {/* <h2 className="text-2xl font-black text-white tracking-tight">Browse All</h2> */}
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
              <div key={i} className="aspect-2/3 bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />
            ))}
          </div>
        ) : (
          <>
            {allMovies.length > 0 ? (
              <div className="grid grid-cols-6 gap-x-6 gap-y-4">
                {allMovies.map((movie, index) => (
                  <div key={`${movie.id}-${index}`} >
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
                  <div className="h-0.5 w-24 bg-linear-to-r from-transparent via-gray-700 to-transparent" />
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