// // 

import { useTranslation } from "@/context/LanguageContext";
import { movieService } from "@/services/movieService";
import { CommentResponse, Movie, PageResponse } from "@/types";
import { useEffect, useState } from "react";

// import { useState, useEffect } from 'react';
// import { movieService } from '@/services/movieService';
// import { Movie, CommentResponse, PageResponse } from '@/types';
// import { useTranslation } from '@/context/LanguageContext';

// export const useMovieDetail = (movieId: string) => {
//   const [movie, setMovie] = useState<Movie | null>(null);
//   // const [comments, setComments] = useState<CommentResponse[]>([]);
//   const [comments, setComments] = useState<PageResponse<CommentResponse> | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const { lang, t } = useTranslation(); // Hem dili hem tercüme fonksiyonunu aldık

//   useEffect(() => {
//     if (!movieId) return;

//   //   const fetchAllData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       setError(null); // Yeni istekte hatayı sıfırla

//   //       // Backend'deki MovieController ve CommentController'ı aynı anda tetikliyoruz
//   //       const [movieRes, commentRes] = await Promise.all([
//   //         movieService.getMovieDetail(movieId),
//   //         movieService.getMovieComments(movieId)
//   //       ]);

//   //       if (movieRes.success) {
//   //         setMovie(movieRes.data);
//   //       } else {
//   //         // Backend'den gelen özel hata mesajı (res.message)
//   //         setError(movieRes.message);
//   //       }

//   //       if (commentRes.success) {
//   //         setComments(commentRes.data);
//   //       }
//   //     } catch (err: any) {
//   //       // Ağ hatası veya server kapalıysa dil dosyasından mesaj çekiyoruz
//   //       setError(t('errors.movieDetailLoad')); 
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchAllData();
//   // }, [movieId, lang]); // ID veya DİL değişirse bu labirent baştan çözülür

//   const fetchAllData = async () => {
//       try {
//         setLoading(true);
//         const [movieRes, commentRes] = await Promise.all([
//           movieService.getMovieDetail(movieId),
//           // Backend Artik Page<CommentResponse> donuyor
//           movieService.getMovieComments(movieId, 0, 10) 
//         ]);

//         if (movieRes.success) setMovie(movieRes.data);
//         if (commentRes.success) setComments(commentRes.data);
        
//       } catch (err: any) {
//         setError(t('errors.movieDetailLoad')); 
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [movieId, lang]);
//   return { movie, comments, loading, error, setComments, setMovie };
// };

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