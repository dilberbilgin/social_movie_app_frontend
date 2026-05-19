export interface RestResponse<T> {
  data: T;
  // Java'daki Map<String, String> yapısının TS karşılığı bir objedir (Record)
  validationErrors?: Record<string, string>;
  message: string;
  success: boolean;
  status: number;
  // LocalDateTime TS tarafında string (ISO formatında) olarak karşılanır
  responseDate: string;
}

/** * YARDIMCI TİPLER
 */
export interface Genre {
  id: string;
  name: string;
}

export interface TranslationRequest {
  languageCode: string; // 'tr', 'en'
  title: string;
  description: string;
}

/** * AUTH MODÜLÜ
 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string; // Opsiyonel alanlar
  lastName?: string;
}

export interface JwtResponse {
  token: string;
  username: string;
  roles: string[];
}

// Auth Cevapları (Response)
export interface UserResponse {
  isFollowing?: boolean;
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  last: boolean;

  pageNumber?: number;
  number?: number;

  pageSize?: number;
  size?: number;

  totalPages?: number;
}

export interface WatchProvider {
  provider_name: string;
  logo_path: string;
  display_priority: number;
  provider_id: string;
}

export interface MovieWatchProviders {
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
}

export interface Movie {
  overview: string;
  commentCount: number;
  id: string; // UUID
  tmdbId: number;
  director?: string;
  originalTitle: string;
  releaseYear: number;
  tmdbRating: number;
  imdbId: string;
  imdbUrl: string;
  clubRating: number;
  clubVoteCount: number;
  clubScore: number;
  userScore: number;
  posterUrl: string;
  title: string; // Çevrilmiş (Local) başlık
  description: string; // Çevrilmiş (Local) açıklama
  genres: Genre[];
  likeCount: number;
  dislikeCount: number;
  userReaction: boolean | null;
  contentType: "MOVIE" | "TV";
  numberOfSeasons?: number;   
  numberOfEpisodes?: number;  
  createdBy?: string[];       
  status?: string;          
  watchProviders?: MovieWatchProviders;
}

// 2. Film Oluşturma İsteği (MovieCreateRequest karşılığı)
export interface MovieCreateRequest {
  originalTitle: string;
  releaseYear: number;
  director?: string;
  posterUrl?: string;
  translations: TranslationRequest[];
  genreIds: string[];
}

/** * 4. ETKİLEŞİM MODÜLÜ (Puan ve Yorum)
 */

// Yorum sistemi için (Self-referencing yapı)
export interface CommentRequest {
  content: string;
  movieId: string;
  parentId?: string; // Alt yorum değilse null gider
}

export interface CommentResponse {
  id: string;
  content: string;
  username: string;
  createdDate: string; // LocalDateTime -> string
  replies: CommentResponse[]; // Kendi tipinden liste (Recursive)
  likeCount: number;
  dislikeCount: number;
  userReaction: boolean | null;
}

export interface RatingRequest {
  movieId: string; // Bizim ürettiğimiz UUID (sanal veya gerçek)
  tmdbId?: number; // EĞER film TMDB'den geliyorsa bu dolu olmalı
  score: number; // 1-10 arası
  contentType: "MOVIE" | "TV";
}

export interface RatingResponse {
  id: string;
  score: number;
  username: string;
  movieId: string;

  movieTitle?: string; // Çevrilmiş film adı
  posterUrl?: string;
  releaseYear?: number;

  newClubRating?: number; // Opsiyonel olarak ekledik
  newClubVoteCount?: number;
}

/** * 5. DIŞ KAYNAK (TMDB Search/Import)
 */

export interface TmdbGenreDto {
  id: number;
  name: string;
}

export interface TmdbCreatorDto {
  name: string;
}

// Film import etmek için (TMDB Search sonuçları için)
// TMDB'den gelen ham arama sonuçları için
export interface TmdbMovieDto {
  id: number;
  // Java'daki JsonProperty isimlerini kullanıyoruz çünkü
  // TMDB'den gelen veri hala ham (alt tireli).
  original_title: string;
  original_name?: string;     // Diziler için eklendi
  name?: string;              // Diziler için eklendi
  imdb_id?: string;
  overview: string;
  title: string;
  release_date: string;
  first_air_date?: string;    // Diziler için eklendi
  poster_path: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: TmdbGenreDto[];

  // Dizi detayları için (Import sırasında lazım olabilir)
  number_of_seasons?: number;
  number_of_episodes?: number;
  created_by?: TmdbCreatorDto[]; 
  media_type?: "movie" | "tv"; // Arama sonuçlarında tipini belirlemek için
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbMovieDto[];
  total_results: number; // Java'daki totalResults yerine total_results
  total_pages: number; // Java'daki totalPages yerine total_pages
}

export interface ProfileResponse {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePictureUrl?: string;
  movieCount: number;
  followerCount: number;
  followingCount: number;
  recentRatings: PageResponse<RatingResponse>;
  isFollowing: boolean;
  recentActivities: PageResponse<ActivityResponse>;
  collections: MovieCollectionResponse[];
}

export interface UserProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePictureUrl?: string;
}

export enum ActivityType {
  MOVIE_LIKE = "MOVIE_LIKE",
  MOVIE_RATE = "MOVIE_RATE",
  COMMENT_CREATE = "COMMENT_CREATE",
  COMMENT_LIKE = "COMMENT_LIKE",
  FOLLOW_USER = "FOLLOW_USER",
}

export interface ActivityResponse {
  id: string;
  userId: string;
  username: string;
  userAvatar: string | null;
  type: ActivityType;
  targetId: string;
  targetTitle: string;
  targetImage: string | null;
  content: string;
  createdDate: string;
  likeCount: number;
  commentCount: number;
  userReaction: boolean | null;
  targetType?: "MOVIE" | "USER" | "COMMENT";
}

export enum NotificationType {
  COMMENT_LIKE = "COMMENT_LIKE",
  COMMENT_CREATE = "COMMENT_CREATE",
  COMMENT_REPLY = "COMMENT_REPLY",
  FOLLOW = "FOLLOW",
}

export interface NotificationResponse {
  id: string;
  actorUsername: string;
  actorAvatar: string | null;
  message: string;
  type: NotificationType;
  targetId: string;
  subTargetId?: string;
  isRead: boolean;
  createdDate: string;
}

export interface SearchResultDto {
  description: any;
  id: string;
  title: string;
  subTitle: string;
  imageUrl: string | null;
  type: "MOVIE" | "USER" | "GROUP" | "HASHTAG";
  metadata?: Record<string, any>;
}

export interface GlobalSearchResponse {
  movies: SearchResultDto[];
  users: SearchResultDto[];
  topResults: SearchResultDto[];
}

export interface MovieCollectionRequest {
  name: string;
  description?: string;
  isPublic: boolean;
}

export interface MovieCollectionResponse {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  movieCount: number;
  ownerUsername: string;
  coverImageUrl?: string;
  movies: Movie[];
  createdDate?: string; // Koleksiyonun ne zaman oluşturulduğu bilgisi
}

export interface TrendingReview {
  commentId: string;
  commentContent: string;
  username: string;
  profilePictureUrl: string | null;
  movieTitle: string;
  moviePosterUrl: string;
  finalLikeCount: number;
  weekEndDate: string;
  movieId: string;
  tmdbId: number;
  clubRating: number;
  clubVoteCount: number;
  movieLikeCount: number;    
  movieDislikeCount: number;   
  userReaction: boolean | null; 
}
