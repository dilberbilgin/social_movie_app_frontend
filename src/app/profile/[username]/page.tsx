"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { userService } from "@/services/userService";
import { UserResponse } from "@/types";
import { followService } from "@/services/followService";
import { ProfileResponse } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import RatingGrid from "@/components/profile/RatingGrid";
import FollowModal from "@/components/profile/FollowModal";

export default function UserProfilePage() {
  const { username } = useParams(); // URL'den /profile/user123 kısmını alır
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useTranslation();
  const { user: currentUser } = useAuth(); // Giriş yapmış kişi

  const isOwnProfile = currentUser?.username === username;
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    // users: UserResponse[];
    users: any; // Artik dizi degil Page objesi gelecek
  }>({ isOpen: false, title: "", users: null });

  const openFollowers = async () => {
    if (!profile) return;
    const res = await followService.getFollowers(profile.id);
    if (res.success) {
      setModalConfig({
        isOpen: true,
        title: t("profile.followers"),
        users: res.data,
      });
    }
  };

  const openFollowing = async () => {
    if (!profile) return;
    const res = await followService.getFollowing(profile.id);
    if (res.success) {
      setModalConfig({
        isOpen: true,
        title: t("profile.following"),
        users: res.data,
      });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); // Veri çekmeye başlarken loading'i true yap ki eski veriyi görmeyelim
      try {
        const res = await userService.getUserProfile(username as string, lang);
        if (res.success) setProfile(res.data);
      } catch (error) {
        console.error("Profile fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    if (username) {
    fetchProfile();
  }
}, [username]); // Sadece username değiştiğinde tetiklenmesi yeterli
  //   fetchProfile();
  // }, [username, lang]);

//   const handleFollowToggle = async () => {
//   if (!profile || !profile.id) return;
//   try {
//     if (profile.isFollowing) {
//       //Takipten cik
//       await followService.unfollow(profile.id);
//       console.log("Unfollow istegi gonderildi");
//     } else {
//       //Takip et
//       await followService.follow(profile.id);
//       console.log("Follow istegi gonderildi");
//     }
    
//     // YEREL STATE GÜNCELLEMEK YERİNE BACKEND'DEN TEKRAR DOĞRUSUNU ÇEKELİM
//     // const updated = await userService.getUserProfile(profile.username, lang);
//     // if (updated.success) setProfile(updated.data);
    
//     // Backend'den en güncel hali çekiyoruz (Dili de ekledik)
//     const res = await userService.getUserProfile(profile.username, lang || "en");
//     if (res.success && res.data) {
//       console.log("Backend'den gelen yeni takip durumu:", res.data.isFollowing);
//       // Backend'deki checkIfCurrentUserFollows metodunun yeni sonucu state'e girer
//       setProfile(res.data); 
//     }
//     else {
//       console.error("Profil verisi çekilemedi veya data boş:", res.message);
//     }
    
//   } catch (err) {
//     console.error("Follow error", err);
//   }
// };

const handleFollowToggle = async () => {
  if (!profile) return;
  
  const originalProfile = { ...profile }; // Hata durumunda geri dönmek için
  const isFollowing = profile.isFollowing;

  // 1. OPTIMISTIC UPDATE: Beklemeden sayıları ve butonu değiştir
  setProfile(prev => prev ? ({
    ...prev,
    isFollowing: !isFollowing,
    followerCount: isFollowing ? prev.followerCount - 1 : prev.followerCount + 1
  }) : null);

  try {
    if (isFollowing) {
      await followService.unfollow(profile.id);
    } else {
      await followService.follow(profile.id);
    }
    // Arka planda sessizce doğrula (Kullanıcıya hissettirme)
    const res = await userService.getUserProfile(profile.username, lang);
    if (res.success) setProfile(res.data);
  } catch (err) {
    setProfile(originalProfile); // Hata varsa eski haline döndür
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

      {/* MODAL BİLEŞENİ */}
      <FollowModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        users={modalConfig.users}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onAction={() => {
    // Modal içinde bir işlem yapıldığında profil verisini sessizce tazele
    userService.getUserProfile(username as string, lang).then(res => {
      if (res.success) setProfile(res.data);
    });
  }}
      />

      <div className="mt-10 border-t border-gray-800 pt-10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🎬</span> {t("profile.recentActivity")}
        </h2>
        <RatingGrid
          ratings={profile.recentRatings}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </main>
  );
}
