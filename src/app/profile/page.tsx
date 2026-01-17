"use client";

import { useEffect, useState } from "react";
import { ratingService } from "@/services/ratingService";
import { RatingResponse } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
// İkon için kütüphane yüklü değilse standart bir X veya Çöp kutusu emojisi kullanacağız
// Eğer 'lucide-react' yüklüyse: import { Trash2, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const [ratings, setRatings] = useState<RatingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useTranslation();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const res = await ratingService.getMyRatings();
        if (res.success) {
          setRatings(res.data);
        }
      } catch (error) {
        console.error("Profile data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, router, lang]);

  const handleDelete = async (e: React.MouseEvent, movieId: string) => {
    e.preventDefault(); // Link'in tetiklenmesini durdurur
    e.stopPropagation(); // Bubbling'i (yukarı sıçramayı) durdurur
    
    if (!confirm(t("common.areYouSure") || "Are you sure?")) return;

    try {
      const res = await ratingService.deleteRating(movieId);
      if (res.success) {
        // UI'ı anlık güncelle (State'den çıkar)
        setRatings((prev) => prev.filter((r) => r.movieId !== movieId));
      }
    } catch (error) {
      console.error("Delete rating error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <main className="py-10 max-w-5xl mx-auto px-4">
      <header className="mb-10 border-b border-gray-800 pb-6">
        <h1 className="text-4xl font-extrabold text-white">
          {t("profile.myRatings")}
        </h1>
        <p className="text-gray-400 mt-2">
          {ratings.length} {t("movie.ratingCount")}
        </p>
      </header>

      {ratings.length === 0 ? (
        <div className="bg-gray-800/30 border border-dashed border-gray-700 rounded-2xl p-20 text-center">
          <p className="text-gray-500 text-lg">{t("movie.noRatingsYet")}</p>
          <Link href="/" className="text-yellow-500 hover:underline mt-4 inline-block">
            {t("movie.startExploring")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="relative group">
              {/* ANA KART LİNKİ */}
              <Link
                href={`/movies/${rating.movieId}`}
                className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-xl border border-gray-800 hover:border-yellow-500/50 transition-all shadow-lg overflow-hidden"
              >
                <div className="relative w-20 h-28 flex-shrink-0">
                  <img
                    src={rating.posterUrl || "/no-poster.png"}
                    alt={rating.movieTitle || "Movie Poster"}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-yellow-500 transition-colors">
                    {rating.movieTitle}
                  </h3>
                  <p className="text-gray-500 text-xs">{rating.releaseYear}</p>
                  
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 mr-2 text-xl">★</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase leading-none">
                        {t("movie.yourScore")}
                      </span>
                      <span className="text-2xl font-black text-white leading-tight">
                        {rating.score}<span className="text-xs text-gray-600 ml-1">/10</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pr-2 hidden sm:block">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                    <span className="text-yellow-500">→</span>
                  </div>
                </div>
              </Link>

              {/* SİLME BUTONU (Kartın sağ üst köşesinde çıkar) */}
              <button
                onClick={(e) => handleDelete(e, rating.movieId)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl flex items-center justify-center hover:bg-red-700 z-20"
                title={t("common.delete") || "Delete"}
              >
                <span className="text-sm font-bold">✕</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}