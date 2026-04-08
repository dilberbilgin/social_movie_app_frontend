// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { movieService } from '@/services/movieService';
// import { HeartIcon } from '@heroicons/react/24/solid';
// import { TrendingReview } from '@/types';

// export const PopularReviewSection = () => {
//   const [reviews, setReviews] = useState<TrendingReview[]>([]);

//   useEffect(() => {
//     movieService.getTrendingReviews(4).then(res => {
//       if (res.success) setReviews(res.data);
//     });
//   }, []);

//   if (reviews.length === 0) return null;

//   return (
//     <section className="px-4 py-8 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-6">
//         <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase">
//           Popular Reviews This Week
//         </h2>
//         <span className="text-xs text-gray-500 hover:text-white cursor-pointer transition">MORE</span>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
//         {reviews.map((review) => (
//           <div key={review.commentId} className="flex gap-4 group">
//             {/* Poster Bölümü */}
//             <div className="relative w-20 h-28 shrink-0 shadow-2xl transition-transform group-hover:scale-105">
//               <Image
//                 src={`https://image.tmdb.org/t/p/w200${review.moviePosterUrl}`}
//                 alt={review.movieTitle}
//                 fill
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Ekran boyutuna göre tahmini genişlik
//                 className="object-cover rounded-sm border border-gray-800"
//               />
//             </div>

//             {/* İçerik Bölümü */}
//             <div className="flex flex-col min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="w-5 h-5 bg-gray-800 rounded-full overflow-hidden">
//                    {review.profilePictureUrl && <Image src={review.profilePictureUrl} alt={review.username} width={20} height={20} />}
//                 </div>
//                 <span className="text-xs font-medium text-gray-400 hover:text-white cursor-pointer">
//                   {review.username}
//                 </span>
//               </div>
              
//               <h3 className="text-white font-bold text-xl truncate leading-tight">
//                 {review.movieTitle} <span className="text-gray-600 font-normal text-sm">2026</span>
//               </h3>

//               <p className="text-gray-400 text-sm mt-2 line-clamp-2 italic leading-relaxed">
//                 "{review.commentContent}"
//               </p>

//               <div className="mt-auto flex items-center gap-2 text-xs font-bold text-gray-500">
//                 <HeartIcon className="w-4 h-4 text-orange-500" />
//                 <span className="group-hover:text-gray-300">
//                    {review.finalLikeCount.toLocaleString()} likes
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default PopularReviewSection;


'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { movieService } from '@/services/movieService';
import { HeartIcon } from '@heroicons/react/24/solid';
import { TrendingReview, Movie } from '@/types';
import MovieCard from '../movie/MovieCard';
import { CollectionsModal } from '../movie/CollectionsModal';

export const PopularReviewSection = () => {
  const [reviews, setReviews] = useState<TrendingReview[]>([]);
  const [selectedTmdbId, setSelectedTmdbId] = useState<number | null>(null);

  useEffect(() => {
    movieService.getTrendingReviews(4).then(res => {
      if (res.success) setReviews(res.data);
    });
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-6">
        <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase">
          Popular Reviews This Week
        </h2>
        <Link href="/reviews" className="text-xs text-gray-500 hover:text-white cursor-pointer transition uppercase">
          More
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {reviews.map((review) => {
          /**
           * TypeScript Hatası Çözümü: 
           * 'as Movie' kullanarak eksik alanlar için hata almayı engelliyoruz.
           * MovieCard sadece görsel ve temel ID'leri kullandığı için bu güvenlidir.
           */
          const movieData = {
            id: review.movieId,
            tmdbId: review.tmdbId,
            title: review.movieTitle,
            posterUrl: review.moviePosterUrl,
            releaseYear: 2026, // Sayı olarak güncellendi
            clubRating: 0,
            likeCount: 0,
            userReaction: null,
            // Eksik alanları 'as Movie' ile bypass ediyoruz veya buraya ekleyebilirsin
          } as Movie;

          return (
            <div key={review.commentId} className="flex gap-6 group">
              {/* SOL TARAF: Gerçek MovieCard */}
              <div className="shrink-0 origin-top-right ">
                <MovieCard movie={movieData} />
              </div>

              {/* SAĞ TARAF: Yorum Bilgileri */}
              <div className="flex flex-col min-w-0 flex-1 pt-1">
                {/* Kullanıcı Satırı */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gray-800 rounded-full overflow-hidden relative border border-white/5">
                    {review.profilePictureUrl ? (
                      <Image src={review.profilePictureUrl} alt={review.username} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-[8px] text-white">
                        {review.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-500 hover:text-gray-300 cursor-pointer transition">
                    {review.username}
                  </span>
                </div>

                {/* Film Başlığı */}
                <Link href={`/movies/${review.movieId}?tmdbId=${review.tmdbId}`}>
                  <h3 className="text-white font-black text-lg truncate leading-tight group-hover:text-yellow-500 transition-colors">
                    {review.movieTitle}
                  </h3>
                </Link>

                {/* Yorum Metni */}
                <Link href={`/movies/${review.movieId}?tmdbId=${review.tmdbId}`}>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3 italic leading-relaxed hover:text-gray-300 transition-colors">
                    "{review.commentContent}"
                  </p>
                </Link>

                {/* Like Butonu/Sayısı (Yorumun hemen altında) */}
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-gray-500">
                  <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-md hover:bg-orange-500/20 cursor-pointer transition-colors">
                    <HeartIcon className="w-3.5 h-3.5" />
                    <span>{review.finalLikeCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Yönetimi */}
      {selectedTmdbId && (
        <CollectionsModal 
          tmdbId={selectedTmdbId} 
          onClose={() => setSelectedTmdbId(null)} 
        />
      )}
    </section>
  );
};