import api from './api';
import { CommentResponse, Movie, PageResponse, RatingRequest, RatingResponse, RestResponse } from '../types';



export const movieService = {

getAllMovies: async (): Promise<RestResponse<Movie[]>> => {
  const response = await api.get<RestResponse<Movie[]>>('/movies');
  return response.data;
},

  // Trend filmleri getiren servis fonksiyonu
  // Artık dışarıdan 'lang' beklemiyoruz, api.ts bunu hallediyor.
  getTrendingMovies: async (): Promise<RestResponse<Movie[]>> => {
    const response = await api.get<RestResponse<Movie[]>>('/movies/trending');
    return response.data;
  },

  // Film detayını getiren servis fonksiyonu
  getMovieDetail: async (id: string): Promise<RestResponse<Movie>> => {
    const response = await api.get<RestResponse<Movie>>(`/movies/${id}`);
    return response.data;
  },

  // Filme ait yorumları çeker
  // getMovieComments: async (movieId: string): Promise<RestResponse<CommentResponse[]>> => {
  //   const response = await api.get<RestResponse<CommentResponse[]>>(`/comments/movie/${movieId}`);
  //   return response.data;
  // },
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

  // Puan verme veya güncelleme
  rateMovie: async (request: RatingRequest): Promise<RestResponse<RatingResponse>> => {
    const response = await api.post<RestResponse<RatingResponse>>('/ratings', request);
    return response.data;
  },

  searchMovies: async (filters?: { genreId?: string; title?: string }): Promise<RestResponse<Movie[]>> => {
    // Query string oluşturma (Örn: /movies/search?title=Inception&genreId=...)
    const params = new URLSearchParams();
    if (filters?.title) params.append('title', filters.title);
    if (filters?.genreId) params.append('genreId', filters.genreId);

    const response = await api.get<RestResponse<Movie[]>>(`/movies/search?${params.toString()}`);
    return response.data;
},     

// En yüksek puanlıları getiren servis
  getTopRatedMovies: async (): Promise<RestResponse<Movie[]>> => {
    const response = await api.get<RestResponse<Movie[]>>('/movies/top-rated');
    return response.data;
  },

  toggleLike: async (id: string): Promise<RestResponse<void>> => {
    const response = await api.post<RestResponse<void>>(`/movies/${id}/like`);
    return response.data;
  },
  toggleDislike: async (id: string): Promise<RestResponse<void>> => {
    const response = await api.post<RestResponse<void>>(`/movies/${id}/dislike`);
    return response.data;
  }

  
};

