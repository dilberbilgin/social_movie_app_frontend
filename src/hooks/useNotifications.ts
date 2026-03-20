import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { NotificationResponse } from '@/types';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';

export const useNotifications = () => {
  const { user, isAuthenticated } = useAuth(); // Parametre yerine context'ten alıyoruz
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // KRİTİK: Auth hazır değilse hiçbir şey yapma
    if (!isAuthenticated || !user?.username) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    let isMounted = true;


  const fetchInitialNotifications = async () => {
  try {
    const res = await notificationService.getNotifications();
    const notificationList = res.data && (res.data as any).content
      ? (res.data as any).content
      : (Array.isArray(res.data) ? res.data : []);
      
    if (isMounted) {
      setNotifications(notificationList);
      // Backend'den gelen isRead durumuna göre sayıyı kesinleştir
      //const unread = notificationList.filter((n: any) => n.isRead === false).length;
      const unread = notificationList.filter((n: any) => n.isRead === false || n.isRead === "false").length;
      setUnreadCount(unread);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

    fetchInitialNotifications();

    // 2. WebSocket Bağlantısı (STOMP)
    const client = new Client({
      // Backend SecurityConfig'deki "/ws-notifications" ile aynı olmalı
      brokerURL: 'ws://localhost:8080/ws-notifications', 
  connectHeaders: {
    Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
  },
  reconnectDelay: 5000, // Bağlantı koparsa 5 saniyede bir dene
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  onConnect: () => {
    console.log("WebSocket Connected!");
        // Kullanıcıya özel kanala abone ol
        client.subscribe(`/user/${user.username}/queue/notifications`, (message) => {
            console.log("RAW MESSAGE FROM BACKEND:", message.body);
            if (message.body) {
    try {
      const newNotif: NotificationResponse = JSON.parse(message.body);
      // Backend isRead göndermezse default false kabul et
if (newNotif.isRead === undefined) newNotif.isRead = false;
      console.log("PARSED NOTIFICATION:", newNotif); // Bunu ekle
      
      if (isMounted) {
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      console.error("JSON Parse Error in WebSocket:", err);
    }
  }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
    });

    client.activate();
    
    return () => {
      isMounted = false;
      client.deactivate();
    };
  }, [isAuthenticated, user?.username]); // Auth durumu değiştikçe tetiklenir

  const markRead = async (id: string) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  return { notifications, unreadCount, markRead };
};