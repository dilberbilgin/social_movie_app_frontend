import { useEffect, useState } from "react";
import { feedService } from "@/services/feedService";
import { ActivityResponse } from "@/types";
import { ActivityCard } from "./ActivityCard";
import { useAuth } from "@/context/AuthContext";

export const SocialFeed = () => {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
    console.log("SocialFeed: Auth yet not ready, skipping fetch.");
    return;
  }
    const fetchFeed = async () => {
      try {
        const response = await feedService.getFollowedFeed(0, 10);
        if (response.success) {
          setActivities(response.data.content);
        }
      } catch (error) {
        console.error("Feed loading error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [isAuthenticated, user]);

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Loading feed...</div>;
  if (activities.length === 0) return (
    <div className="p-10 text-center bg-gray-900/30 rounded-3xl border border-gray-800">
      <p className="text-gray-500">No activity yet. Follow some friends to see what they're watching!</p>
    </div>
  );

  return (
    <div className="bg-gray-900/50 rounded-3xl border border-gray-800 overflow-hidden backdrop-blur-sm">
      <div className="divide-y divide-gray-800">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};