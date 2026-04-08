import api from './api';
import { 
  CommentResponse, 
  Movie, 
  PageResponse, 
  RatingRequest, 
  RatingResponse, 
  RestResponse, 
  TrendingReview
} from '../types';

export const movieService = {

  // Tüm filmleri sayfalamalı getirir
  getAllMovies: async (page: number = 0, size: number = 20): Promise<RestResponse<PageResponse<Movie>>> => {
    const response = await api.get<RestResponse<PageResponse<Movie>>>('/movies', {
      params: { page, size }
    });
    return response.data;
  },

  // Trend filmleri getirir (Dil api.ts interceptor'dan gelir)
  getTrendingMovies: async (): Promise<RestResponse<Movie[]>> => {
    const response = await api.get<RestResponse<Movie[]>>('/movies/trending');
    return response.data;
  },

  // Film detayını çeker (Veritabanında yoksa tmdbId ile backend'e haber verir)
  getMovieDetail: async (id: string, tmdbId?: number): Promise<RestResponse<Movie>> => {
    const response = await api.get<RestResponse<Movie>>(`/movies/${id}`, {
      params: { tmdbId }
    });
    return response.data;
  },

  // Filme ait yorumları sayfalamalı getirir
  getMovieComments: async (
    movieId: string, 
    page: number = 0, 
    size: number = 10
  ): Promise<RestResponse<PageResponse<CommentResponse>>> => {
    const response = await api.get<RestResponse<PageResponse<CommentResponse>>>(
      `/comments/movie/${movieId}`, 
      { params: { page, size } }
    );
    return response.data;
  },

  // Puan verme işlemi
  rateMovie: async (request: RatingRequest): Promise<RestResponse<RatingResponse>> => {
    const response = await api.post<RestResponse<RatingResponse>>('/ratings', request);
    return response.data;
  },

  // Arama ve Filtreleme (Keşfet sayfası ve genel arama için)
  searchMovies: async (filters?: { genreId?: string; title?: string }, page: number = 0, size: number = 20): Promise<RestResponse<PageResponse<Movie>>> => {
    const params: any = { page, size };
    if (filters?.title) params.title = filters.title;
    if (filters?.genreId) params.genreId = filters.genreId;

    const response = await api.get<RestResponse<PageResponse<Movie>>>('/movies/search', { params });
    return response.data;
  },

  getTopRatedMovies: async (): Promise<RestResponse<Movie[]>> => {
    const response = await api.get<RestResponse<Movie[]>>('/movies/top-rated');
    return response.data;
  },

  // Beğenme (Film DB'de yoksa tmdbId sayesinde anında kaydedilir)
  toggleLike: async (id: string | null, tmdbId?: number): Promise<RestResponse<string>> => {
    const response = await api.post<RestResponse<string>>(`/movies/${id}/like`, null, {
      params: { tmdbId }
    });
    return response.data;
  },

  // Beğenmeme
  toggleDislike: async (id: string | null, tmdbId?: number): Promise<RestResponse<string>> => {
    const response = await api.post<RestResponse<string>>(`/movies/${id}/dislike`, null, {
      params: { tmdbId }
    });
    return response.data;
  },

  // Hibrit Keşfet (Hem filtreleme hem sayfalama)
  discoverMovies: async (filters?: { genreId?: string }, page: number = 0, size: number = 20): Promise<RestResponse<PageResponse<Movie>>> => {
    const params: any = { page, size };
    if (filters?.genreId) params.genreId = filters.genreId;

    const response = await api.get<RestResponse<PageResponse<Movie>>>('/movies/discover', { params });
    return response.data;
  },

  // Önerilen filmleri getirir
  getSuggestedMovies: async (page: number = 0, size: number = 10): Promise<RestResponse<PageResponse<Movie>>> => {
    const response = await api.get<RestResponse<PageResponse<Movie>>>('/movies/suggestions', {
      params: { page, size }
    });
    return response.data;
  },

  // Manuel import (opsiyonel kullanım için)
  importTmdbMovie: async (tmdbId: number): Promise<RestResponse<Movie>> => {
    const response = await api.post<RestResponse<Movie>>(`/tmdb/import/${tmdbId}`);
    return response.data;
  },

  // Popüler yorumları (trending) getirir
  getTrendingReviews: async (limit: number = 4): Promise<RestResponse<TrendingReview[]>> => {
    const response = await api.get<RestResponse<TrendingReview[]>>('/v1/weekly-winners/trending', {
      params: { limit }
    });
    return response.data;
  }
};

