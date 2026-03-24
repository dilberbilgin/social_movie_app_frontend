

import { ActivityResponse } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";
import { FeedActions } from "./FeedActions";
import { enUS, tr } from "date-fns/locale";

interface Props {
  activity: ActivityResponse;
  compact?: boolean;
}

// export const ActivityCard = ({ activity }: Props) => {
//   const { t } = useTranslation();
export const ActivityCard = ({ activity, compact = false }: Props) => {
  const { lang, t } = useTranslation();
  const dateLocale = lang === "tr" ? tr : enUS;

  // TMDB Resim URL'sini düzelten fonksiyon
  const getImageUrl = (path: string | null) => {
    if (!path || path === "null" || path === "") return "/no-poster.png";
    if (path.startsWith("http")) return path;
    // Baştaki slash'ı kontrol ederek TMDB URL'ini oluştur
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `https://image.tmdb.org/t/p/w500${cleanPath}`;
  };

  const getTargetLink = () => {
    if (activity.type === "FOLLOW_USER") return `/profile/${activity.targetId}`;
    return `/movies/${activity.targetId}`;
  };

  const isFollowAction = activity.type === "FOLLOW_USER";
  const isMovieAction = activity.type === "MOVIE_LIKE" || activity.type === "MOVIE_RATE";

  if (compact) {
    return (
      <Link 
        href={`/movies/${activity.targetId}`}
        className="flex items-center gap-4 p-2 bg-gray-900/60 rounded-xl border border-gray-800 hover:border-yellow-500 hover:bg-gray-800/40 transition-all group h-28"
      >
        {/* Resim Alanı: Tam olarak ana sayfa film kartı oranında (2/3) */}
        <div className="relative w-16 h-full shrink-0 overflow-hidden rounded-lg border border-gray-700">
          <img
            src={getImageUrl(activity.targetImage)}
            alt={activity.targetTitle || "Movie"} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).src = "/no-poster.png"; }}
          />
        </div>

        {/* Metin Alanı */}
        <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-white font-semibold truncate text-sm leading-tight group-hover:text-yellow-500 transition-colors">
              {activity.targetTitle || (activity.type === "MOVIE_RATE" ? t("common.movie") : "Movie")}
            </h4>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500 font-bold uppercase tracking-wider border border-yellow-500/30">
                {activity.type === "MOVIE_RATE" ? "RATE" : "COMMENT"}
             </span>
             <span className="text-[10px] text-gray-500 italic">
              {formatDistanceToNow(new Date(activity.createdDate), { addSuffix: true, locale: dateLocale })}
            </span>
          </div>

          <p className="text-gray-400 text-xs line-clamp-2 leading-snug italic">
            "{activity.content}"
          </p>
        </div>
      </Link>
    );
  }
  return (
    <div className="bg-gray-900/40 rounded-2xl border border-gray-800 mb-6 overflow-hidden hover:border-gray-700 transition-colors">
      {/* 1. ÜST KISIM: Kullanıcı Bilgisi */}
      <div className="flex items-center gap-3 p-4">
        <Link href={`/profile/${activity.userId}`} className="shrink-0">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-yellow-500 to-purple-600 p-0.5">
            <div className="w-full h-full rounded-full bg-gray-900 p-px">
              {activity.userAvatar ? (
                <img src={activity.userAvatar} alt={activity.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold">{activity.username[0]}</div>
              )}
            </div>
          </div>
        </Link>
        <div className="flex flex-col">
          <Link href={`/profile/${activity.userId}`} className="text-sm font-semibold hover:text-blue-400 transition-colors">
            {activity.username}
          </Link>
          <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
            {formatDistanceToNow(new Date(activity.createdDate), { addSuffix: true })}
          </span>
        </div>
      </div>

     {/* 2. ORTA KISIM: Kısıtlanmış Poster Alanı */}
{!isFollowAction && activity.targetImage && (
  <Link href={getTargetLink()} className="block bg-black/20 border-y border-gray-800/50">
    <div className="relative w-full flex justify-center py-4 bg-gray-950/40">
      {/* Arka Plan Bulanıklığı (Opsiyonel: Estetik bir hava katar) */}
      <div 
        className="absolute inset-0 blur-2xl opacity-20"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w200${activity.targetImage})`, backgroundSize: 'cover' }}
      />
      
      {/* Ana Poster: Maksimum yükseklik 450px ile sınırlandırıldı */}
      <div className="relative z-10 shadow-2xl shadow-black">
        <img
          src={activity.targetImage.startsWith("http") ? activity.targetImage : `https://image.tmdb.org/t/p/w500${activity.targetImage}`}
          alt="movie preview"
          className="h-87.5 sm:h-112.5 w-auto rounded-md object-contain transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>
    </div>
  </Link>
)}

{/* 3. ETKİLEŞİM BUTONLARI (Yeni Eklenen Kısım) */}
      {!isFollowAction && (
        <FeedActions 
    activityId={activity.id} 
    targetId={activity.targetId} // <-- Eksik olan buydu, eklendi
    initialLikeCount={activity.likeCount || 0}
    initialCommentCount={activity.commentCount || 0}
    initialUserReaction={activity.userReaction}
  />
      )}

      {/* 3. ALT KISIM: Aktivite Detayı ve İçerik */}
  <div className="p-4 pt-0 space-y-1.5">
  <div className="flex items-start gap-2">
    <p className="text-sm text-gray-300 leading-relaxed">
      {/* Kullanıcı adına tıklanabilir link eklendi */}
      <Link href={`/profile/${activity.userId}`} className="font-semibold text-white hover:text-blue-400 transition-colors">
        {activity.username}
      </Link>{" "}
      <span className="text-gray-400">
        {t(`activity.${activity.type.toLowerCase()}`, { title: isFollowAction ? "" : `"${activity.targetTitle}"` })}
      </span>
    </p>
  </div>

        {/* Kullanıcının yorumu varsa (Caption gibi görünecek) */}
        {activity.content && (
          <div className="border-l-2 border-gray-700 pl-3 py-0.5">
            <p className="text-sm text-gray-500 italic">"{activity.content}"</p>
          </div>
        )}
      </div>
    </div>
  );
};



