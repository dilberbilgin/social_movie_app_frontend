import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns"; // 'npm install date-fns' gerekebilir
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const NotificationPanel = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markRead } = useNotifications();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null); // Paneli takip etmek için ref

  // Dışarı tıklandığında kapatma mantığı
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) await markRead(notif.id);
    setIsOpen(false);

    // Bildirim tipine göre yönlendirme
    if (notif.type === "FOLLOW") {
      router.push(`/profile/${notif.actorUsername}`);
    } else {
      router.push(`/movies/${notif.targetId}`);
    }
  };

// const handleNotificationClick = async (notif: any) => {
//   if (!notif.isRead) await markRead(notif.id);
//   setIsOpen(false);

//   if (notif.type === "FOLLOW") {
//     router.push(`/profile/${notif.actorUsername}`);
//   } else if (notif.type === "COMMENT_REPLY" || notif.type === "COMMENT_LIKE") {
//     // Burada targetId Film ID'si olduğu için filme yönlendirir
//     // İleride yoruma odaklanmak için URL sonuna # ekleyebiliriz
//     router.push(`/movies/${notif.targetId}`);
//   } else {
//     router.push(`/movies/${notif.targetId}`);
//   }
// };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-yellow-500 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-800 font-bold text-sm text-white">
            Bildirimler
          </div>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${!n.isRead ? "bg-yellow-500/5" : ""}`}
              >
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0">
                    {n.actorAvatar && (
                      <img src={n.actorAvatar} className="rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-200">
                      <span className="font-bold text-yellow-500">
                        {n.actorUsername}
                      </span>{" "}
                      {n.message}
                    </p>
                    <span className="text-[10px] text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(n.createdDate), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-gray-500 italic">
              Henüz bildirim yok.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
