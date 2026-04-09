"use client";
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

export const ActivityCard = ({ activity, compact = false }: Props) => {
  const { lang, t } = useTranslation();
  const dateLocale = lang === "tr" ? tr : enUS;

  // ÇALIŞAN Harici Placeholder URL'leri
  const POSTER_PLACEHOLDER =
    "https://placehold.co/400x600/111827/FFFFFF/png?text=No+Poster";
  const AVATAR_PLACEHOLDER =
    "https://placehold.co/100x100/111827/FFFFFF/png?text=User";

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const target = e.currentTarget;
    if (target.src === POSTER_PLACEHOLDER || target.src === AVATAR_PLACEHOLDER)
      return;

    target.src = target.alt.toLowerCase().includes("user")
      ? AVATAR_PLACEHOLDER
      : POSTER_PLACEHOLDER;
  };

  const getImageUrl = (path: string | null) => {
    if (
      !path ||
      path.includes("via.placeholder.com") ||
      path === "null" ||
      path === ""
    )
      return POSTER_PLACEHOLDER;
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `https://image.tmdb.org/t/p/w500${cleanPath}`;
  };

  const getTargetLink = () => {
    // 1. Takip işlemiyse profile git
    if (activity.type === "FOLLOW_USER") {
      return `/profile/${activity.username}`;
    }

    // 2. Koleksiyon işlemiyse koleksiyon detayına git
    // Backend'den gelen activity.type'a göre kontrol et (Örn: COLLECTION_CREATE, COLLECTION_ADD)
    if (activity.type.toString().includes("COLLECTION")) {
      return `/collections/${activity.targetId}`;
    }

    // 3. Varsayılan olarak film detayına git
    return `/movies/${activity.targetId}`;
  };

  const isFollowAction = activity.type === "FOLLOW_USER";

  if (compact) {
    return (
      <Link
        // href={`/movies/${activity.targetId}`}
        href={getTargetLink()}
        className="flex items-center gap-4 p-2 bg-gray-900/60 rounded-xl border border-gray-800 hover:border-yellow-500 hover:bg-gray-800/40 transition-all group h-28"
      >
        <div className="relative w-16 h-full shrink-0 overflow-hidden rounded-lg border border-gray-700">
          <img
            src={getImageUrl(activity.targetImage)}
            alt={activity.targetTitle || "Movie"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
          />
        </div>
        <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
          <h4 className="text-white font-semibold truncate text-sm leading-tight group-hover:text-yellow-500 transition-colors">
            {activity.targetTitle || t("common.movie")}
          </h4>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500 font-bold uppercase tracking-wider">
              {activity.type === "MOVIE_RATE" ? "RATE" : "COMMENT"}
            </span>
            <span className="text-[10px] text-gray-500">
              {formatDistanceToNow(new Date(activity.createdDate), {
                addSuffix: true,
                locale: dateLocale,
              })}
            </span>
          </div>
          <p className="text-gray-400 text-xs line-clamp-2 italic">
            "{activity.content}"
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-gray-900/40 rounded-2xl border border-gray-800 mb-6 overflow-hidden hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-3 p-4">
        <Link
          href={`/profile/${activity.username || "unknown"}`}
          className="shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-yellow-500 to-purple-600 p-0.5">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
              <img
                src={activity.userAvatar || AVATAR_PLACEHOLDER}
                alt={`${activity.username || "unknown"} User`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
          </div>
        </Link>
        <div className="flex flex-col">
          <Link
            href={`/profile/${activity.username || "unknown"}`}
            className="text-sm font-semibold hover:text-blue-400 transition-colors"
          >
            {activity.username || "unknown"}
          </Link>
          <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
            {formatDistanceToNow(new Date(activity.createdDate), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </span>
        </div>
      </div>

      {!isFollowAction && activity.targetImage && (
        <Link
          href={getTargetLink()}
          className="block bg-black/20 border-y border-gray-800/50"
        >
          <div className="relative w-full flex justify-center py-4 bg-gray-950/40">
            <div
              className="absolute inset-0 blur-2xl opacity-20"
              style={{
                backgroundImage: `url(${getImageUrl(activity.targetImage)})`,
                backgroundSize: "cover",
              }}
            />
            <img
              src={getImageUrl(activity.targetImage)}
              alt="movie preview"
              className="h-80 sm:h-96 w-auto rounded-md object-contain relative z-10 transition-transform duration-500 hover:scale-[1.02]"
              onError={handleImageError}
            />
          </div>
        </Link>
      )}

      {!isFollowAction && (
        <FeedActions
          activityId={activity.id}
          targetId={activity.targetId}
          initialLikeCount={activity.likeCount || 0}
          initialCommentCount={activity.commentCount || 0}
          initialUserReaction={activity.userReaction}
        />
      )}

      <div className="p-4 pt-0 space-y-1.5">
        <p className="text-sm text-gray-300">
          <Link
            href={`/profile/${activity.username}`}
            className="font-semibold text-white hover:text-blue-400"
          >
            {activity.username}
          </Link>{" "}
          <span className="text-gray-400">
            {t(`activity.${activity.type.toLowerCase()}`, {
              title: isFollowAction ? "" : `"${activity.targetTitle}"`,
            })}
          </span>
        </p>
        {activity.content && (
          <div className="border-l-2 border-gray-700 pl-3 py-0.5 text-sm text-gray-500 italic">
            "{activity.content}"
          </div>
        )}
      </div>
    </div>
  );
};
