"use client";

import { useEffect, useState } from "react";
import { movieService } from "@/services/movieService";
import { Movie } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import MovieRow from "@/components/movie/MovieRow";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SocialFeed } from "@/components/social/SocialFeed";
import { PopularReviewSection } from "@/components/social/PopularReviewSection";

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useTranslation();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [trendRes, topRes] = await Promise.all([
          movieService.getTrendingMovies(),
          movieService.getTopRatedMovies(),
        ]);

        if (trendRes.success) setTrending(trendRes.data);
        if (topRes.success) setTopRated(topRes.data);
      } catch (error) {
        console.error("Dashboard Load Error", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [lang]);

  if (loading) return <LoadingSpinner />;

  return (
    <main className="min-h-screen bg-gray-950 pb-20 overflow-x-hidden">
      {" "}
      <div className="h-[24vh] md:h-[24vh] relative flex items-center px-4 bg-linear-to-r from-blue-1300 to-transparent">
        <div className="z-10 max-w-2xl">
          <h1 className="text-3xl font-black text-white mb-1 tracking-tighter">
            {t("home.welcomeTitle")}
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            {t("home.welcomeSubtitle")}
          </p>
        </div>
      </div>
      <div className="relative z-20 -mt-12 grid grid-cols-1 w-full overflow-x-hidden gap-y-8">
        <div className="w-full overflow-hidden px-4">
       <MovieRow title={t("home.trending")} movies={trending} />
    </div>

        {/* <PopularReviewSection /> */}

        <div className="w-full overflow-hidden px-4">
       <MovieRow title={t("home.topRated")} movies={topRated} />
    </div>
        <div className="w-full max-w-4xl mx-auto px-4">
      <PopularReviewSection />
    </div>

        {/* Social Feed */}
        <section className="w-full flex justify-center px-4 pt-0">
          <div className="w-full max-w-md">
            {" "}
            <SocialFeed />
          </div>
        </section>
      </div>
    </main>
  );
}
