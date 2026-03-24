
/** * GENEL CEVAP ZARFI (RestResponse)
 * Backend'deki RestResponse<T> yapısının aynısı.
 */
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

// export interface PageResponse<T> {
//   content: T[];
//   totalPages: number;
//   totalElements: number;
//   last: boolean;
//   size: number;
//   number: number;
// }
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  last: boolean;
  
  // Hibrit Alanlar: Backend'den hangisi gelirse onu kullanacağız
  pageNumber?: number; // Senin yeni CustomPageResponse'un
  number?: number;     // Spring'in orijinal Page nesnesi
  
  pageSize?: number;   // Senin yeni CustomPageResponse'un
  size?: number;       // Spring'in orijinal Page nesnesi
  
  totalPages?: number; // Orijinal Page'de var
}

/** * MOVIE MODÜLÜ
 */
// 1. Ekranda gösterilecek Film (MovieResponse karşılığı)
export interface Movie {
  commentCount: number;
  id: string;            // UUID
  tmdbId: number;
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
  title: string;        // Çevrilmiş (Local) başlık
  description: string;  // Çevrilmiş (Local) açıklama
  genres: Genre[];
  likeCount: number;
  dislikeCount: number;
  userReaction: boolean | null;
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
  movieId: string;
  score: number; // 1-10 arası
}

export interface RatingResponse {
  id: string;
  score: number;
  username: string;
  movieId: string;

  movieTitle?: string;    // Çevrilmiş film adı
  posterUrl?: string;     
  releaseYear?: number;

  newClubRating?: number;   // Opsiyonel olarak ekledik
  newClubVoteCount?: number;
}

/** * 5. DIŞ KAYNAK (TMDB Search/Import)
 */


export interface TmdbGenreDto {
  id: number;
  name: string;
}

// Film import etmek için (TMDB Search sonuçları için)
// TMDB'den gelen ham arama sonuçları için
export interface TmdbMovieDto {
  id: number;
  // DİKKAT: Java'daki JsonProperty isimlerini kullanıyoruz çünkü 
  // TMDB'den gelen veri hala ham (alt tireli).
  original_title: string; 
  imdb_id?: string;
  overview: string;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: TmdbGenreDto[];
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbMovieDto[];
  total_results: number; // Java'daki totalResults yerine total_results
  total_pages: number;   // Java'daki totalPages yerine total_pages
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
  // recentRatings: RatingResponse[];
  recentRatings: PageResponse<RatingResponse>; 
  isFollowing: boolean;
  recentActivities: PageResponse<ActivityResponse>;
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
  // Sosyal Alanlar 
  likeCount: number;
  commentCount: number;
  userReaction: boolean | null;
}

export enum NotificationType {
  COMMENT_LIKE = "COMMENT_LIKE",
  COMMENT_CREATE = "COMMENT_CREATE",
  COMMENT_REPLY = "COMMENT_REPLY", // Yeni tipimiz
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







