"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { userService } from "@/services/userService";
import { followService } from "@/services/followService";
import { ProfileResponse, MovieCollectionResponse } from "@/types"; // Tipleri ekledik
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FollowModal from "@/components/profile/FollowModal";
import { ActivityCard } from "@/components/social/ActivityCard";
import { CollectionItem } from "@/components/movie/CollectionItem";
import { movieCollectionService } from "@/services/movieCollectionService";

export default function UserProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useTranslation();
  const { user: currentUser } = useAuth();

  const [userCollections, setUserCollections] = useState<
    MovieCollectionResponse[]
  >([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  // Takip etmiyor ve kendi profili değilse içerik kilitli sayılır
  const isLocked = !isOwnProfile && !profile?.isFollowing;

  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get("tab") as
    | "activities"
    | "collections"
    | null;
  const activeTab = tabFromUrl || "activities";

  // Tab değiştirme fonksiyonu (URL'yi günceller)
  const handleTabChange = (tabName: "activities" | "collections") => {
    router.push(`/profile/${username}?tab=${tabName}`, { scroll: false });
  };

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    users: any;
  }>({ isOpen: false, title: "", users: null });

  // 1. Profil Verisini Çek
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await userService.getUserProfile(username as string, lang);
        if (res.success) setProfile(res.data);
      } catch (error) {
        console.error("Profile fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username, lang]);

  // 2. Sekme Koleksiyon Olduğunda Veriyi Çek (Hata düzeltildi)
  useEffect(() => {
    const fetchCollections = async () => {
      // 1. Profil datası gelmeden veya sekme "collections" değilse çalışma
      if (!profile?.username || activeTab !== "collections") return;

      setCollectionsLoading(true);
      try {
        let res;
        if (isOwnProfile) {
          // Kendi profilimdeysem "benimkileri" getir
          res = await movieCollectionService.getMyCollections();
        } else {
          // Başkasının profilindeysem (Test 5), O KULLANICININ koleksiyonlarını getir
          res = await movieCollectionService.getUserCollections(
            profile.username,
          );
        }

        if (res.success) setUserCollections(res.data);
      } catch (error) {
        console.error("Collections fetch error", error);
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollections();
  }, [activeTab, profile?.username, isOwnProfile]);

  // Takipçi/Takip Edilen Modalları
  const openFollowers = async () => {
    if (!profile) return;
    const res = await followService.getFollowers(profile.id);
    if (res.success)
      setModalConfig({
        isOpen: true,
        title: t("profile.followers"),
        users: res.data,
      });
  };

  const openFollowing = async () => {
    if (!profile) return;
    const res = await followService.getFollowing(profile.id);
    if (res.success)
      setModalConfig({
        isOpen: true,
        title: t("profile.following"),
        users: res.data,
      });
  };

  const handleFollowToggle = async () => {
    if (!profile) return;
    const originalProfile = { ...profile };
    const isFollowing = profile.isFollowing;

    setProfile((prev) =>
      prev
        ? {
            ...prev,
            isFollowing: !isFollowing,
            followerCount: isFollowing
              ? prev.followerCount - 1
              : prev.followerCount + 1,
          }
        : null,
    );

    try {
      if (isFollowing) await followService.unfollow(profile.id);
      else await followService.follow(profile.id);
      const res = await userService.getUserProfile(profile.username, lang);
      if (res.success) setProfile(res.data);
    } catch (err) {
      setProfile(originalProfile);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile)
    return (
      <div className="text-center py-20 text-gray-500">User not found.</div>
    );

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onFollowToggle={handleFollowToggle}
        onShowFollowers={openFollowers}
        onShowFollowing={openFollowing}
      />

      <div className="flex border-b border-gray-800 mt-10">
        <button
          onClick={() => handleTabChange("activities")}
          className={`px-6 py-3 font-medium transition-all duration-200 cursor-pointer ${
            activeTab === "activities"
              ? "text-yellow-500 border-b-2 border-yellow-500 bg-yellow-500/5"
              : "text-gray-500 hover:text-white"
          }`}
        >
          🎬 {t("profile.recentActivity")}
        </button>
        <button
          onClick={() => handleTabChange("collections")}
          className={`px-6 py-3 font-medium transition-all duration-200 cursor-pointer ${
            activeTab === "collections"
              ? "text-yellow-500 border-b-2 border-yellow-500 bg-yellow-500/5"
              : "text-gray-500 hover:text-white"
          }`}
        >
          📁 {t("profile.collections")}
        </button>
      </div>

      {/* İçerik Alanı */}
      <div className="mt-8">
        {isLocked ? (
          /* KİLİTLİ GÖRÜNÜM */
          <div className="py-20 flex flex-col items-center justify-center bg-gray-900/20 rounded-3xl border border-gray-800 backdrop-blur-sm">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-4xl">
              🔒
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {activeTab === "activities"
                ? t("profile.activitiesLocked")
                : t("profile.collectionsLocked")}
            </h3>
            <p className="text-gray-500 text-center max-w-xs">
              {username} adlı kullanıcının içeriklerini görmek için onu takip
              etmelisin.
            </p>
            <button
              onClick={handleFollowToggle}
              className="mt-6 px-8 py-2 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-colors"
            >
              {t("profile.follow")}
            </button>
          </div>
        ) : /* AÇIK İÇERİK */
        activeTab === "activities" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.recentActivities?.content?.length > 0 ? (
              profile.recentActivities.content.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  compact={true}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-gray-500 italic">
                  {t("profile.noRecentActivity")}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {collectionsLoading ? (
              <LoadingSpinner />
            ) : userCollections.length > 0 ? (
              userCollections.map((col) => (
                <CollectionItem key={col.id} collection={col} mode="navigate" />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-500 italic">
                {t("profile.noCollections")}
              </div>
            )}
          </div>
        )}
      </div>

      <FollowModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        users={modalConfig.users}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onAction={() => {
          userService.getUserProfile(username as string, lang).then((res) => {
            if (res.success) setProfile(res.data);
          });
        }}
      />
    </main>
  );
}
