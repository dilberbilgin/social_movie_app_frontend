// 

import { useState, useEffect } from 'react';
import { movieService } from '@/services/movieService';
import { Movie, CommentResponse } from '@/types';
import { useTranslation } from '@/context/LanguageContext';

export const useMovieDetail = (movieId: string) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { lang, t } = useTranslation(); // Hem dili hem tercüme fonksiyonunu aldık

  useEffect(() => {
    if (!movieId) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null); // Yeni istekte hatayı sıfırla

        // Backend'deki MovieController ve CommentController'ı aynı anda tetikliyoruz
        const [movieRes, commentRes] = await Promise.all([
          movieService.getMovieDetail(movieId),
          movieService.getMovieComments(movieId)
        ]);

        if (movieRes.success) {
          setMovie(movieRes.data);
        } else {
          // Backend'den gelen özel hata mesajı (res.message)
          setError(movieRes.message);
        }

        if (commentRes.success) {
          setComments(commentRes.data);
        }
      } catch (err: any) {
        // Ağ hatası veya server kapalıysa dil dosyasından mesaj çekiyoruz
        setError(t('errors.movieDetailLoad')); 
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [movieId, lang]); // ID veya DİL değişirse bu labirent baştan çözülür

  return { movie, comments, loading, error, setComments, setMovie };
};