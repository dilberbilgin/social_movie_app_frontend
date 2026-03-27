// // 

import { useTranslation } from "@/context/LanguageContext";
import { movieService } from "@/services/movieService";
import { CommentResponse, Movie, PageResponse } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

export const useMovieDetail = (movieId: string) => {
  const searchParams = useSearchParams();
  const tmdbId = searchParams.get('tmdbId'); // URL'den ?tmdbId=... kısmını alır
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<PageResponse<CommentResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { lang, t } = useTranslation();

const fetchAllData = useCallback(async () => {
    if (!movieId) return;
    
    setLoading(true);
    try {
      // 1. Film detayını tmdbId ile birlikte çekiyoruz (Hibrit Mekanizma)
      const movieRes = await movieService.getMovieDetail(
        movieId, 
        tmdbId ? Number(tmdbId) : undefined
      );

      // 2. Yorumları çekiyoruz
      const commentRes = await movieService.getMovieComments(movieId, 0, 10);

      if (movieRes.success) {
        setMovie(movieRes.data);
      } else {
        setError(movieRes.message);
      }

      if (commentRes.success) {
        setComments(commentRes.data);
      }
      
    } catch (err: any) {
      console.error("Detail Load Error:", err);
      setError(t('errors.movieDetailLoad')); 
    } finally {
      setLoading(false);
    }
  }, [movieId, tmdbId, lang, t]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { movie, comments, loading, error, setComments, setMovie, fetchAllData };
};