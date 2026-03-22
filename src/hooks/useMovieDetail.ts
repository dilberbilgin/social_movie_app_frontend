// // 

import { useTranslation } from "@/context/LanguageContext";
import { movieService } from "@/services/movieService";
import { CommentResponse, Movie, PageResponse } from "@/types";
import { useEffect, useState } from "react";

export const useMovieDetail = (movieId: string) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<PageResponse<CommentResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { lang, t } = useTranslation();

  // Fonksiyonu dışarıda tanımlıyoruz ki return edebilelim
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [movieRes, commentRes] = await Promise.all([
        movieService.getMovieDetail(movieId),
        movieService.getMovieComments(movieId, 0, 10) 
      ]);

      if (movieRes.success) setMovie(movieRes.data);
      if (commentRes.success) setComments(commentRes.data);
      
    } catch (err: any) {
      setError(t('errors.movieDetailLoad')); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!movieId) return;
    fetchAllData();
  }, [movieId, lang]);

  // fetchAllData'yı buraya ekledik!
  return { movie, comments, loading, error, setComments, setMovie, fetchAllData };
};