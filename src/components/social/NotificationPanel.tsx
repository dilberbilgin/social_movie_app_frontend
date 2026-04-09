"use client";

import React from "react";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";
import { X, Bell } from "lucide-react";

export const NotificationPanel = ({ onClose }: { onClose: () => void }) => {
  const { notifications, markRead, markAllAsRead } = useNotifications();
  const { lang } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const handleNotificationClick = async (notif: any) => {
    if (String(notif.isRead) === "false") {
      await markRead(notif.id);
    }

    onClose();

    if (notif.type === "FOLLOW") {
      router.push(`/profile/${notif.actorUsername}`);
    } else {
      const baseUrl = `/movies/${notif.targetId}`;
      const hash = notif.subTargetId ? `#comment-${notif.subTargetId}` : "";
      if (pathname === baseUrl) {
        window.location.hash = hash.replace("#", "");
      } else {
        router.push(`${baseUrl}${hash}`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full text-white bg-black">
      <div className="p-6 border-b border-gray-900 flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tighter">Notifications</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full"
        >
          <X size={24} />
        </button>
      </div>

      <div className="px-6 py-3 flex justify-between items-center border-b border-gray-900">
        <span className="text-xs font-bold uppercase text-gray-500">
          Recent
        </span>
        <button
          onClick={() => markAllAsRead()}
          className="text-xs text-blue-500 font-bold hover:text-blue-400 transition-colors"
        >
          Mark all read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const isUnread = String(n.isRead) === "false";
            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 border-b border-gray-900 cursor-pointer hover:bg-white/5 transition-all flex gap-4 items-center group ${isUnread ? "bg-blue-500/5" : ""}`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-800 shrink-0 border border-gray-700 relative">
                  {n.actorAvatar ? (
                    <img
                      src={n.actorAvatar}
                      className="w-full h-full rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                      {n.actorUsername?.[0].toUpperCase()}
                    </div>
                  )}
                  {isUnread && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-black" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-tight">
                    <span className="font-black text-white">
                      {n.actorUsername}
                    </span>{" "}
                    <span className="text-gray-300">{n.message}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 uppercase font-bold tracking-wider">
                    {formatDistanceToNow(new Date(n.createdDate), {
                      addSuffix: true,
                      locale: lang === "tr" ? tr : enUS,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-10 opacity-30 italic">
            <Bell size={48} className="mb-4" />
            <p className="text-sm font-bold tracking-widest uppercase">
              No notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
