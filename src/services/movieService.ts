import api from './api';
import { CommentResponse, Movie, RatingRequest, RatingResponse, RestResponse } from '../types';



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
  getMovieComments: async (movieId: string): Promise<RestResponse<CommentResponse[]>> => {
    const response = await api.get<RestResponse<CommentResponse[]>>(`/comments/movie/${movieId}`);
    return response.data;
  },

  // Puan verme veya güncelleme
  rateMovie: async (request: RatingRequest): Promise<RestResponse<RatingResponse>> => {
    const response = await api.post<RestResponse<RatingResponse>>('/ratings', request);
    return response.data;
  }

  
};

