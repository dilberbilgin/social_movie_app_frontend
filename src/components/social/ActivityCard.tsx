
// import { ActivityResponse } from "@/types";
// import { formatDistanceToNow } from "date-fns";
// import Link from "next/link";
// import { useTranslation } from "@/context/LanguageContext";

// interface Props {
//   activity: ActivityResponse;
// }

// export const ActivityCard = ({ activity }: Props) => {
//   const { t } = useTranslation();
  
//   const getActivityMessage = () => {
//     switch (activity.type) {
//       case "MOVIE_LIKE":
//         return t("activity.movie_like", { title: activity.targetTitle });
//       case "MOVIE_RATE":
//         return t("activity.movie_rate", { title: activity.targetTitle });
//       case "COMMENT_LIKE":
//         return t("activity.comment_like", { title: activity.targetTitle });
//       case "COMMENT_CREATE":
//         return t("activity.comment_create", { title: activity.targetTitle });
//       case "FOLLOW_USER":
//         return t("activity.follow_user", { title: activity.targetTitle });
//       default:
//         return t("activity.default");
//     }
//   };

//   const getTargetLink = () => {
//     if (activity.type === "FOLLOW_USER") return `/profile/${activity.targetId}`;
//     return `/movies/${activity.targetId}`;
//   };

//   // Yorum içeriği gösterilmeli mi?
//   const isCommentActivity = activity.type === "COMMENT_CREATE" || activity.type === "COMMENT_LIKE";

//   return (
//     <Link href={getTargetLink()} className="block">
//       <div className="flex items-center justify-between p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
//         <div className="flex items-center gap-3">
//           {/* Kullanıcı Avatarı */}
//           <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden ring-2 ring-gray-800">
//             {activity.userAvatar ? (
//               <img
//                 src={activity.userAvatar}
//                 alt={activity.username}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
//                 {activity.username[0].toUpperCase()}
//               </div>
//             )}
//           </div>

//           {/* Mesaj Kısmı */}
//           <div className="flex flex-col gap-1">
//             <p className="text-sm text-gray-300">
//               <span className="font-bold text-blue-400">
//                 {activity.username}{" "}
//               </span>
//               <span>{getActivityMessage()}</span>
//             </p>

//             {/* Yorum Önizlemesi (Yeni Eklenen Kısım) */}
//             {isCommentActivity && activity.content && (
//               <p className="text-xs text-gray-500 italic line-clamp-1 border-l-2 border-gray-700 pl-2 py-0.5">
//                 "{activity.content}"
//               </p>
//             )}

//             <span className="text-[10px] text-gray-500 uppercase tracking-widest">
//               {formatDistanceToNow(new Date(activity.createdDate), {
//                 addSuffix: true,
//               })}
//             </span>
//           </div>
//         </div>

//         {/* Sağdaki Resim */}
//         {activity.targetImage && (
//           <div className="w-10 h-14 rounded shadow-lg border border-gray-700 overflow-hidden shrink-0">
//             <img
//               src={
//                 activity.targetImage.startsWith("http")
//                   ? activity.targetImage
//                   : `https://image.tmdb.org/t/p/w200${activity.targetImage}`
//               }
//               alt="preview"
//               className="w-full h-full object-cover"
//               onError={(e) => (e.currentTarget.src = "/fallback-movie.png")}
//             />
//           </div>
//         )}
//       </div>
//     </Link>
//   );
// };

import { ActivityResponse } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

interface Props {
  activity: ActivityResponse;
}

export const ActivityCard = ({ activity }: Props) => {
  const { t } = useTranslation();

  const getTargetLink = () => {
    if (activity.type === "FOLLOW_USER") return `/profile/${activity.targetId}`;
    return `/movies/${activity.targetId}`;
  };

  const isFollowAction = activity.type === "FOLLOW_USER";

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

      {/* 3. ALT KISIM: Aktivite Detayı ve İçerik */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          {/* İkonlar veya küçük rozetler eklenebilir */}
          <p className="text-sm text-gray-300">
             <span className="font-medium text-white">{activity.username}</span>{" "}
             {t(`activity.${activity.type.toLowerCase()}`, { title: isFollowAction ? activity.targetTitle : "" })}
          </p>
        </div>

        {/* Kullanıcının yorumu varsa */}
        {activity.content && (
          <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-400 italic">"{activity.content}"</p>
          </div>
        )}
      </div>
    </div>
  );
};