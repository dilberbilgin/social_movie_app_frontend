

'use client';

import { useEffect, useState } from 'react';
import { movieService } from '@/services/movieService';
import { Movie } from '@/types';
import { useTranslation } from '@/context/LanguageContext';
import MovieRow from '@/components/movie/MovieRow';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SocialFeed } from '@/components/social/SocialFeed';

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
          movieService.getTopRatedMovies()
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
    <main className="min-h-screen bg-gray-950 pb-20">
      {/* Hero Banner (Öne Çıkan Tek Bir Film) */}
      <div className="h-[50vh] relative flex items-center px-8 bg-linear-to-r from-black to-transparent">
        <div className="z-10 max-w-2xl">
          <h1 className="text-5xl font-black text-white mb-4 uppercase italic tracking-tighter">
             {t('home.welcomeTitle')}
          </h1>
          <p className="text-gray-400 text-lg mb-6">{t('home.welcomeSubtitle')}</p>
        </div>
      </div>

      <div className="space-y-8 -mt-20 relative z-20">
        <MovieRow title={t('home.trending')} movies={trending} />
        <MovieRow title={t('home.topRated')} movies={topRated} />
        
        {/* Sosyal Akış (Social Feed) Bölümü */}
        <section className="px-4 max-w-4xl mx-auto">
           <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white px-4">
                {t('home.socialFeedTitle') || 'Social Feed'}
              </h2>
           </div>
           
           {/* Placeholder yerine gerçek bileşenimizi çağırıyoruz */}
           <SocialFeed />
        </section>
        {/* <section className="px-4">
           <div className="bg-gray-900/50 p-10 rounded-3xl border border-dashed border-gray-800 text-center">
              <h3 className="text-gray-500 font-medium">{t('home.socialFeedPlaceholder')}</h3>
              <p className="text-xs text-gray-700 mt-2 italic">Arkadaşlarının aktiviteleri yakında burada görünecek...</p>
           </div>
        </section> */}
      </div>
    </main>
  );
}