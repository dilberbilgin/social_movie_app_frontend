

import { useEffect, useState, useRef, useCallback } from "react";
import { feedService } from "@/services/feedService";
import { ActivityResponse } from "@/types";
import { ActivityCard } from "./ActivityCard";
import { useAuth } from "@/context/AuthContext";

export const SocialFeed = () => {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const { user, isAuthenticated } = useAuth();
  const observer = useRef<IntersectionObserver | null>(null);

  // Listenin sonuna gelindiğini anlayan "ref" (Infinite Scroll için)
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchFeed = async () => {
      setLoading(true);
      try {
        const response = await feedService.getFollowedFeed(page, 10);
        if (response.success && response.data) {
          // Data gelince listeyi güncelle
          setActivities((prev) =>
            page === 0
              ? response.data.content
              : [...prev, ...response.data.content],
          );

          // 'last' değerini güvenli bir şekilde oku
          const isLast = response.data.last;
          setHasMore(!isLast);
        }
      } catch (error) {
        console.error("Feed error:", error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchFeed();
  }, [isAuthenticated, user, page]); // Sayfa değiştikçe otomatik tetiklenir

  if (initialLoading)
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Loading feed...
      </div>
    );

  // if (activities.length === 0)
  //   return (
  //     <div className="p-10 text-center bg-gray-900/30 rounded-3xl border border-gray-800">
  //       <p className="text-gray-500 italic">
  //         No activity yet. Follow some friends to see what they're watching!
  //       </p>
  //     </div>
  //   );
  // activities null olsa bile patlamaz, false döner
if (!activities || activities.length === 0) 
  return (
    <div className="p-10 text-center bg-gray-900/30 rounded-3xl border border-gray-800">
      <p className="text-gray-500 italic">
        No activity yet. Follow some friends to see what they're watching!
      </p>
    </div>
  );

    return (
  <div className="max-w-md mx-auto w-full px-2 sm:px-0 pb-10"> {/* max-w-lg'den md'ye (448px) çektik */}
    <div className="flex flex-col gap-2">{/* Kartlar arasına boşluk ekledik */}
      {activities.map((activity, index) => {
        if (activities.length === index + 1) {
          return (
            <div ref={lastElementRef} key={activity.id}>
              <ActivityCard activity={activity} />
            </div>
          );
        }
        return <ActivityCard key={activity.id} activity={activity} />;
      })}
    </div>
    {/* Loading indicator... */}
  </div>
);

//   return (
//     <div className="bg-gray-900/50 rounded-3xl border border-gray-800 overflow-hidden backdrop-blur-sm">
//       <div className="divide-y divide-gray-800">
//         {activities.map((activity, index) => {
//           // Eğer bu listenin son elemanıysa, ref'i buna bağla
//           if (activities.length === index + 1) {
//             return (
//               <div ref={lastElementRef} key={activity.id}>
//                 <ActivityCard activity={activity} />
//               </div>
//             );
//           }
//           return <ActivityCard key={activity.id} activity={activity} />;
//         })}
//       </div>

//       {loading && page !== 0 && (
//         <div className="p-4 text-center text-xs text-gray-500 italic animate-bounce">
//           Loading more activities...
//         </div>
//       )}
//     </div>
//   );
};
