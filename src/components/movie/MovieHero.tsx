// "use client";

// import { Movie } from "@/types";
// import { Heart, Skull, Bookmark } from "lucide-react";
// import { movieService } from "@/services/movieService";
// import LanguageSelector from "../ui/LanguageSelector";
// import { useTranslation } from "@/context/LanguageContext";
// import RegionSelector from "../ui/RegionSelector";
// import { useState } from "react";

// interface MovieHeroProps {
//   movie: Movie;
//   onMovieUpdated: (newId?: string) => void;
//   onSaveClick: () => void;
// }

// export default function MovieHero({
//   movie,
//   onMovieUpdated,
//   onSaveClick,
// }: MovieHeroProps) {
//   const { t } = useTranslation();
//   const [isNotifOpen, setIsNotifOpen] = useState(false);

//   const handleMovieReaction = async (isLike: boolean) => {
//     try {
//       const response = isLike
//         ? await movieService.toggleLike(movie.id, movie.tmdbId)
//         : await movieService.toggleDislike(movie.id, movie.tmdbId);

//       onMovieUpdated(response.data);
//     } catch (err) {
//       console.error("Reaction Error:", err);
//     }
//   };

//   return (
//     <div className="relative w-full h-80 bg-gray-950 overflow-hidden">
//       <div className="absolute inset-0 z-0">
//         {movie.posterUrl && (
//           <img
//             src={movie.posterUrl}
//             className="w-full h-full object-cover opacity-20 blur-2xl scale-110"
//             alt=""
//           />
//         )}
//         <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/70 to-transparent" />
//       </div>

//       <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-end pb-12 gap-8">
//         <div className="w-36 h-52 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
//           <img
//             src={movie.posterUrl || "/no-poster.png"}
//             alt={movie.title}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         <div className="flex-1 pb-2">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
//             {movie.title}
//           </h1>
//           <div className="flex items-center gap-3 text-gray-400 font-medium">
//             <span className="bg-yellow-500/20 text-yellow-500 px-4 py-1.5 rounded text-md border border-yellow-500/30">
//               {movie.releaseYear}
//             </span>
//             <span className="text-sm md:text-base text-gray-400 uppercase font-bold px-1.5 py-0.5 bg-white/5 rounded border border-white/10">
//               {movie.contentType === "TV" ? "TV Series" : "Movie"}
//             </span>
//             {movie.genres && movie.genres.length > 0 && (
//               <>
//                 <span>•</span>
//                 <span className="text-sm md:text-base opacity-90">
//                   {movie.genres.map((g) => g.name).join(", ")}
//                 </span>
//               </>
//             )}
//           </div>
//           <div className="flex items-center gap-3 text-gray-400 font-medium">
//             <div>
//           <h2 className="text-gray-500 font-bold italic uppercase mb-6  text-sm mt-4">
//             {t("movie.director")}  {movie.director}
//           </h2>
//         </div>
//           </div>
//         </div>

//         {/* <div className="flex items-center gap-3"> */}
//         <div className="flex flex-col md:flex-row items-center gap-3">
//           {/* <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full backdrop-blur-sm border border-white/5"> */}
//             <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl backdrop-blur-sm">
//             <button
//               onClick={() => handleMovieReaction(true)}
//               className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all active:scale-110 ${
//                 movie.userReaction === true
//                   ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               <Heart
//                 size={20}
//                 fill={movie.userReaction === true ? "white" : "none"}
//               />
//               <span className="font-bold">{movie.likeCount || 0}</span>
//             </button>

//             <button
//               onClick={() => handleMovieReaction(false)}
//               className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all active:scale-110 ${
//                 movie.userReaction === false
//                   ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               <Skull size={20} />
//               <span className="font-bold">{movie.dislikeCount || 0}</span>
//             </button>

//             {/* Kaydet Butonu */}
//             <button
//               onClick={onSaveClick}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all active:scale-110 border border-white/5"
//               title={t("movie.saveToList")}
//             >
//               <Bookmark size={20} />
//             </button>
//           </div>

// <div className="flex gap-2 w-full md:w-auto">
//           <LanguageSelector
//             dropdownPosition="top"
//             align="right"
//             isFullWidth={false}
//             showLabel={false}
//           />
//           <RegionSelector hideText={isNotifOpen} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Movie } from "@/types";
import { Heart, Skull, Bookmark } from "lucide-react";
import { movieService } from "@/services/movieService";
import LanguageSelector from "../ui/LanguageSelector";
import { useTranslation } from "@/context/LanguageContext";
import RegionSelector from "../ui/RegionSelector";
import { useState } from "react";

interface MovieHeroProps {
  movie: Movie;
  onMovieUpdated: (newId?: string) => void;
  onSaveClick: () => void;
}

export default function MovieHero({
  movie,
  onMovieUpdated,
  onSaveClick,
}: MovieHeroProps) {
  const { t } = useTranslation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const isTv = movie.contentType === "TV";

  const handleMovieReaction = async (isLike: boolean) => {
    try {
      const response = isLike
        ? await movieService.toggleLike(movie.id, movie.tmdbId)
        : await movieService.toggleDislike(movie.id, movie.tmdbId);

      onMovieUpdated(response.data);
    } catch (err) {
      console.error("Reaction Error:", err);
    }
  };

  /**
   * SOLID: Veri gösterme mantığını bileşenden ayırıyoruz.
   * Dizi ise sezon/bölüm ve yaratıcıları, film ise yönetmeni döner.
   */
  const renderMetadata = () => {
    if (isTv) {
      return (
        <div className="flex flex-col gap-3 mt-4">
          {/* Sezon ve Bölüm Sayıları */}
          {(movie.numberOfSeasons || movie.numberOfEpisodes) && (
            <div className="flex items-center gap-3 text-xs md:text-sm font-semibold">
              {movie.numberOfSeasons && (
                <span className="text-white bg-blue-500/20 px-2.5 py-1 rounded border border-blue-500/30">
                  {movie.numberOfSeasons} {t("movie.seasons")}
                </span>
              )}
              {movie.numberOfEpisodes && (
                <span className="text-gray-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  {movie.numberOfEpisodes} {t("movie.episodes")}
                </span>
              )}
            </div>
          )}

          {/* Created By (Netflix/Letterboxd Stili) */}
          {movie.createdBy && movie.createdBy.length > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-gray-500 uppercase text-[10px] tracking-widest font-black block mb-1">
                {t("movie.creator") || "Created by"}
              </span>
              <div className="flex flex-wrap gap-x-2 text-gray-200 font-medium">
                {/* ?.map kullanarak undefined durumunu güvenli hale getiriyoruz */}
                {movie.createdBy?.map((name, index) => (
                  <span key={index}>
                    {name}
                    {index < (movie.createdBy?.length ?? 0) - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Film için Yönetmen Gösterimi
    if (!movie.director || movie.director === "Unknown Director") return null;

    return (
      <div className="mt-4">
        <span className="text-gray-500 uppercase text-[10px] tracking-widest font-black block mb-1">
          {t("movie.director")}
        </span>
        <span className="text-gray-200 font-medium">{movie.director}</span>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-[450px] md:h-[500px] bg-gray-950 overflow-hidden flex items-end pb-8 md:pb-16">
      {/* Arka Plan Görseli */}
      <div className="absolute inset-0 z-0">
        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            className="w-full h-full object-cover opacity-20 blur-3xl scale-110"
            alt=""
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full h-full flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
        {/* Poster */}
        <div className="w-40 md:w-56 lg:w-64 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900 self-center md:self-auto">
          <img
            src={movie.posterUrl || "/no-poster.png"}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bilgiler */}
        <div className="flex-1 text-center md:text-left w-full">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-2xl">
            {movie.title}
          </h1>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
            <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded font-bold text-sm border border-yellow-500/30">
              {movie.releaseYear}
            </span>
            <span className="text-xs md:text-sm text-gray-400 uppercase font-black px-2 py-1 bg-white/5 rounded border border-white/10 tracking-widest">
              {isTv
                ? t("movie.tvSeries") || "TV Series"
                : t("movie.movie") || "Movie"}
            </span>
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex gap-2">
                <span className="text-gray-600">•</span>
                <span className="text-sm md:text-base text-gray-400 font-medium">
                  {movie.genres.map((g) => g.name).join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Sezon/Bölüm/Yönetmen Metodunu Çağırıyoruz */}
          {renderMetadata()}

          {/* Aksiyon Butonları Grubu */}
          <div className="flex flex-col md:flex-row items-center gap-6 mt-8 w-full">
  {/* Sol Taraf: Reaksiyon Butonları */}
  <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded-full backdrop-blur-xl border border-white/10 shadow-2xl">
    <button
      onClick={() => handleMovieReaction(true)}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all active:scale-95 ${
        movie.userReaction === true
          ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
          : "text-gray-400 hover:bg-white/5"
      }`}
    >
      <Heart size={20} fill={movie.userReaction === true ? "white" : "none"} />
      <span className="font-black text-sm">{movie.likeCount || 0}</span>
    </button>

    <button
      onClick={() => handleMovieReaction(false)}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all active:scale-95 ${
        movie.userReaction === false
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
          : "text-gray-400 hover:bg-white/5"
      }`}
    >
      <Skull size={20} />
      <span className="font-black text-sm">{movie.dislikeCount || 0}</span>
    </button>

    <div className="w-[1px] h-6 bg-white/10 mx-1" /> {/* Ayırıcı çizgi */}

    <button
      onClick={onSaveClick}
      className="p-3 rounded-full text-gray-400 hover:bg-white/5 hover:text-white transition-all active:scale-95"
      title={t("movie.saveToList")}
    >
      <Bookmark size={22} />
    </button>
  </div>

  {/* Sağ Taraf: Dil ve Bölge Seçiciler (Etiketli) */}
  <div className="flex flex-wrap justify-center md:justify-start gap-4">
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
        {t("hero.contentLanguage") || "Content Language"}
      </label>
      <LanguageSelector dropdownPosition="top" align="left" />
    </div>

    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">
        {t("hero.watchRegion") || "Watch Region"}
      </label>
      <RegionSelector hideText={false} />
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}
