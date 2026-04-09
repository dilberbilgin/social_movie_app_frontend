"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Client } from "@stomp/stompjs";
import { notificationService } from "@/services/notificationService";
import { useAuth } from "@/context/AuthContext";
import { NotificationResponse } from "@/types";
import { toast } from "react-hot-toast";

interface NotificationContextType {
  notifications: NotificationResponse[];
  unreadCount: number;
  markRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => String(n.isRead) === "false").length;
  }, [notifications]);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationService.getNotifications();
      const list = (res.data as any)?.content || res.data || [];
      setNotifications(list);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !user?.username) {
      setNotifications([]);
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    fetchNotifications();

    // TEK BİR WEBSOCKET BAĞLANTISI
    const client = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws")}/ws-notifications`,
      connectHeaders: {
        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(
          `/user/${user.username}/queue/notifications`,
          (message) => {
            if (message.body) {
              const newNotif = JSON.parse(message.body);
              // State'e yeni bildirimi ekle
              setNotifications((prev) => [newNotif, ...prev]);
              toast.success(newNotif.message, { icon: "🔔" });
            }
          },
        );
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [isAuthenticated, user?.username, fetchNotifications]);

  const markRead = async (id: string) => {
    // Optimistic Update: Önce UI'ı güncelle
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error("Mark read error:", err);
      fetchNotifications(); // Hata olursa geri al (tazele)
    }
  };

  const markAllAsRead = async () => {
    const previous = [...notifications];
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      setNotifications(previous);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  return context;
};
