"use client";
import { ProfileResponse } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";

interface Props {
  profile: ProfileResponse;
  isOwnProfile: boolean;
  onFollowToggle: () => void;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
}

export default function ProfileHeader({
  profile,
  isOwnProfile,
  onFollowToggle,
  onShowFollowers,
  onShowFollowing,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
      {/* Profil Fotoğrafı (Placeholder) */}
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-tr from-yellow-500 to-orange-600 p-1">
        <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center border-4 border-gray-950 overflow-hidden">
          <span className="text-4xl md:text-6xl">👤</span>
        </div>
      </div>

      {/* Kullanıcı Bilgileri */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {profile.username}
          </h2>

          {/* {isOwnProfile ? (
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-1.5 rounded-lg text-sm font-bold transition-all border border-gray-700">
              {t("profile.editProfile") || "Edit Profile"}
            </button>
          ) : ( */}
          {isOwnProfile ? (
  <Link 
    href={`/profile/${profile.username}/edit`}
    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-1.5 rounded-lg text-sm font-bold transition-all border border-gray-700 inline-block"
  >
    {t("profile.editProfile") || "Edit Profile"}
  </Link>
) : (
            <button
              onClick={onFollowToggle}
              className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer z-10 ${
                profile.isFollowing
                  ? "bg-gray-800 text-white border border-gray-700 hover:bg-red-900/20 hover:border-red-900/50"
                  : "bg-yellow-500 text-black hover:bg-yellow-400"
              }`}
            >
              {profile.isFollowing
                ? t("profile.unfollow") || "Unfollow"
                : t("profile.follow") || "Follow"}
            </button>
          )}
        </div>

        {/* İstatistikler (Instagram Style) */}
        <div className="flex justify-center md:justify-start gap-8 mb-6">
          <div className="text-center cursor-default">
            <span className="block font-bold text-white text-xl">
              {profile.movieCount}
            </span>
            <span className="text-gray-500 text-xs uppercase tracking-wider">
              {t("profile.movies")}
            </span>
          </div>

          {/* Tıklanabilir Takipçi Sayısı */}
          <button
            onClick={onShowFollowers}
            className="text-center hover:opacity-70 transition-opacity cursor-pointer group"
          >
            <span className="block font-bold text-white text-xl group-hover:text-yellow-500">
              {profile.followerCount}
            </span>
            <span className="text-gray-500 text-[10px] uppercase font-bold">
              {t("profile.followers")}
            </span>
          </button>

          <button
            onClick={onShowFollowing}
            className="text-center hover:opacity-70 transition-opacity cursor-pointer group"
          >
            <span className="block font-bold text-white text-xl group-hover:text-yellow-500">
              {profile.followingCount}
            </span>
            <span className="text-gray-500 text-[10px] uppercase font-bold">
              {t("profile.following")}
            </span>
          </button>
        </div>

        {/* Biyografi */}
        <div className="text-sm">
          <p className="font-bold text-white">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-gray-400 mt-1 whitespace-pre-wrap leading-relaxed">
            {profile.bio || (isOwnProfile ? t("profile.noBioYet") : "")}
          </p>
        </div>
      </div>
    </div>
  );
}
