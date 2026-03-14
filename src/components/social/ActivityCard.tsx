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

//   // Tıklanınca nereye gidecek?
//   const getTargetLink = () => {
//     if (activity.type === "FOLLOW_USER") return `/profile/${activity.targetId}`;
//     return `/movies/${activity.targetId}`; // Like, Rate, Comment durumunda filme git
//   };

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
//           <div>
//             <p className="text-sm text-gray-300">
//               <span className="font-bold text-blue-400">
//                 {activity.username}{" "}
//               </span>
//               <span>{getActivityMessage()}</span>
//             </p>
//             <span className="text-[10px] text-gray-500 uppercase tracking-widest">
//               {formatDistanceToNow(new Date(activity.createdDate), {
//                 addSuffix: true,
//               })}
//             </span>
//           </div>
//         </div>

//         {/* Sağdaki Resim (Film Posteri veya Takip Edilen Kişi) */}
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
//               onError={(e) => (e.currentTarget.src = "/fallback-movie.png")} // Resim yüklenemezse varsayılan resim
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
  
  const getActivityMessage = () => {
    switch (activity.type) {
      case "MOVIE_LIKE":
        return t("activity.movie_like", { title: activity.targetTitle });
      case "MOVIE_RATE":
        return t("activity.movie_rate", { title: activity.targetTitle });
      case "COMMENT_LIKE":
        return t("activity.comment_like", { title: activity.targetTitle });
      case "COMMENT_CREATE":
        return t("activity.comment_create", { title: activity.targetTitle });
      case "FOLLOW_USER":
        return t("activity.follow_user", { title: activity.targetTitle });
      default:
        return t("activity.default");
    }
  };

  const getTargetLink = () => {
    if (activity.type === "FOLLOW_USER") return `/profile/${activity.targetId}`;
    return `/movies/${activity.targetId}`;
  };

  // Yorum içeriği gösterilmeli mi?
  const isCommentActivity = activity.type === "COMMENT_CREATE" || activity.type === "COMMENT_LIKE";

  return (
    <Link href={getTargetLink()} className="block">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* Kullanıcı Avatarı */}
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden ring-2 ring-gray-800">
            {activity.userAvatar ? (
              <img
                src={activity.userAvatar}
                alt={activity.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                {activity.username[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Mesaj Kısmı */}
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-300">
              <span className="font-bold text-blue-400">
                {activity.username}{" "}
              </span>
              <span>{getActivityMessage()}</span>
            </p>

            {/* Yorum Önizlemesi (Yeni Eklenen Kısım) */}
            {isCommentActivity && activity.content && (
              <p className="text-xs text-gray-500 italic line-clamp-1 border-l-2 border-gray-700 pl-2 py-0.5">
                "{activity.content}"
              </p>
            )}

            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              {formatDistanceToNow(new Date(activity.createdDate), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {/* Sağdaki Resim */}
        {activity.targetImage && (
          <div className="w-10 h-14 rounded shadow-lg border border-gray-700 overflow-hidden shrink-0">
            <img
              src={
                activity.targetImage.startsWith("http")
                  ? activity.targetImage
                  : `https://image.tmdb.org/t/p/w200${activity.targetImage}`
              }
              alt="preview"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/fallback-movie.png")}
            />
          </div>
        )}
      </div>
    </Link>
  );
};