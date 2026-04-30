// //

import { useTranslation } from "@/context/LanguageContext";
import { movieService } from "@/services/movieService";
import { CommentResponse, Movie, PageResponse } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRegion } from "@/context/RegionContext";

export const useMovieDetail = (movieId: string) => {
  const searchParams = useSearchParams();
  const tmdbId = searchParams.get("tmdbId"); // URL'den ?tmdbId=... kısmını alır
const contentType = searchParams.get("contentType") || "MOVIE"; // URL'den tipi al

  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] =
    useState<PageResponse<CommentResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { lang, t } = useTranslation();
  const { region } = useRegion();

  const fetchAllData = useCallback(async () => {
    if (!movieId) return;

    setLoading(true);
    try {
      // 1. Önce film detayını çek
      const movieRes = await movieService.getMovieDetail(
        movieId,
        tmdbId ? Number(tmdbId) : undefined,
        contentType
      );

      if (movieRes.success) {
        setMovie(movieRes.data);

        // 2. YORUM İSTEĞİNİ KONTROL ET:
        // Eğer movieId "0" ise (yani film henüz DB'de yoksa),
        // backend'den gelen gerçek UUID'yi kullanmayı dene.
        const targetIdForComments =
          movieId === "0" && movieRes.data.id ? movieRes.data.id : movieId;

        // movieId "0" ise ve movieRes'ten de ID gelmediyse yorum çekme
        if (targetIdForComments !== "0") {
          const commentRes = await movieService.getMovieComments(
            targetIdForComments,
            0,
            10,
          );
          if (commentRes.success) {
            setComments(commentRes.data);
          }
        }
      } else {
        setError(movieRes.message);
      }
    } catch (err: any) {
      console.error("Detail Load Error:", err);
      setError(t("errors.movieDetailLoad"));
    } finally {
      setLoading(false);
    }
  }, [movieId, tmdbId, lang, region, t]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    movie,
    comments,
    loading,
    error,
    setComments,
    setMovie,
    fetchAllData,
  };
};
