import { useTranslation } from "@/context/LanguageContext";
import { movieService } from "@/services/movieService";
import { Movie } from "@/types";
import { useState, useEffect } from "react";

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const { lang } = useTranslation();

  const fetchMovies = async (filters?: {
    genreId?: string;
    title?: string;
  }) => {
    setLoading(true);
    try {
      const res = await movieService.searchMovies(filters);
      if (res.success) setMovies(res.data.content);
    } finally {
      setLoading(false);
    }
  };

  return { movies, loading, fetchMovies };
};
