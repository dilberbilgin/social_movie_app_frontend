// // import { useEffect, useState } from 'react';
// // import { Client } from '@stomp/stompjs';
// // import { NotificationResponse } from '@/types';
// // import { notificationService } from '@/services/notificationService';
// // import { useAuth } from '@/context/AuthContext';
// // import { toast } from 'react-hot-toast';

import { useContext } from "react";

// // export const useNotifications = () => {
// //   const { user, isAuthenticated } = useAuth(); // Parametre yerine context'ten alıyoruz
// //   const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
// //   const [unreadCount, setUnreadCount] = useState(0);

// //   useEffect(() => {
// //     // KRİTİK: Auth hazır değilse hiçbir şey yapma
// //     if (!isAuthenticated || !user?.username) return;

// //     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
// //     if (!token) return;

// //     let isMounted = true;


// //   const fetchInitialNotifications = async () => {
// //   try {
// //     const res = await notificationService.getNotifications();
// //     const notificationList = res.data && (res.data as any).content
// //       ? (res.data as any).content
// //       : (Array.isArray(res.data) ? res.data : []);
      
// //     if (isMounted) {
// //       setNotifications(notificationList);
// //       // Backend'den gelen isRead durumuna göre sayıyı kesinleştir
// //       //const unread = notificationList.filter((n: any) => n.isRead === false).length;
// //       const unread = notificationList.filter((n: any) => n.isRead === false || n.isRead === "false").length;
// //       setUnreadCount(unread);
// //     }
// //   } catch (err) {
// //     console.error("Fetch error:", err);
// //   }
// // };

// //     fetchInitialNotifications();

// //     // 2. WebSocket Bağlantısı (STOMP)
// //     const client = new Client({
// //       // Backend SecurityConfig'deki "/ws-notifications" ile aynı olmalı
// //       // brokerURL: 'ws://localhost:8080/ws-notifications', 
// //       brokerURL: `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws')}/ws-notifications`,
// //   connectHeaders: {
// //     Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
// //   },
// //   reconnectDelay: 5000, // Bağlantı koparsa 5 saniyede bir dene
// //   heartbeatIncoming: 4000,
// //   heartbeatOutgoing: 4000,
// //   onConnect: () => {
// //     console.log("WebSocket Connected!");
// //         // Kullanıcıya özel kanala abone ol
// //         client.subscribe(`/user/${user.username}/queue/notifications`, (message) => {
// //             console.log("RAW MESSAGE FROM BACKEND:", message.body);
// //             if (message.body) {
// //     try {
// //       const newNotif: NotificationResponse = JSON.parse(message.body);
// //       // Backend isRead göndermezse default false kabul et
// // if (newNotif.isRead === undefined) newNotif.isRead = false;
// //       console.log("PARSED NOTIFICATION:", newNotif); // Bunu ekle
      
// //       if (isMounted) {
// //         setNotifications(prev => [newNotif, ...prev]);
// //         setUnreadCount(prev => prev + 1);

// //         // Kullanıcıya o an ekranda bir popup gösteriyoruz
// //     toast.success(newNotif.message, {
// //         icon: '🔔',
// //         duration: 4000,
// //         position: 'top-right',
// //     });
// //       }
// //     } catch (err) {
// //       console.error("JSON Parse Error in WebSocket:", err);
// //     }
// //   }
// //         });
// //       },
// //       onStompError: (frame) => {
// //         console.error('STOMP error', frame);
// //       },
// //     });

// //     client.activate();
    
// //     return () => {
// //       isMounted = false;
// //       client.deactivate();
// //     };
// //   }, [isAuthenticated, user?.username]); // Auth durumu değiştikçe tetiklenir

// //   // const markRead = async (id: string) => {
// //   //   try {
// //   //     const res = await notificationService.markAsRead(id);
// //   //     if (res.success) {
// //   //       setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
// //   //       setUnreadCount(prev => Math.max(0, prev - 1));
// //   //     }
// //   //   } catch (err) {
// //   //     console.error("Mark read error:", err);
// //   //   }
// //   // };

// //   const markRead = async (id: string) => {
// //     try {
// //       const res = await notificationService.markAsRead(id);
// //       if (res.success) {
// //         // Hem listeyi güncelle hem de sayıyı azalt
// //         setNotifications(prev => 
// //             prev.map(n => n.id === id ? { ...n, isRead: true } : n)
// //         );
// //         // Sayıyı manuel olarak 1 düşür (veya listeyi tekrar saydır)
// //         setUnreadCount(prev => Math.max(0, prev - 1));
// //       }
// //     } catch (err) {
// //       console.error("Mark read error:", err);
// //     }
// // };

// // // İsteğe bağlı: Tümünü okundu yap
// // const markAllAsRead = async () => {
// //     try {
// //         // Backend'de böyle bir endpoint varsa:
// //         // await notificationService.markAllAsRead();
// //         setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
// //         setUnreadCount(0);
// //     } catch (err) {
// //         console.error("Mark all as read error:", err);
// //     }
// // };

// //   return { notifications, unreadCount, markRead };
// // };

// "use client";

// import { useEffect, useState, useCallback, useMemo } from 'react';
// import { Client } from '@stomp/stompjs';
// import { notificationService } from '@/services/notificationService';
// import { useAuth } from '@/context/AuthContext';
// import { toast } from 'react-hot-toast';
// import { NotificationResponse } from '@/types';

// export const useNotifications = () => {
//   const { user, isAuthenticated } = useAuth();
//   const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

//   // Sayıyı hesapla
//   const unreadCount = useMemo(() => {
//     return notifications.filter(n => String(n.isRead) === "false").length;
//   }, [notifications]);

//   const fetchInitialNotifications = useCallback(async () => {
//     if (!isAuthenticated) return;
//     try {
//       const res = await notificationService.getNotifications();
//       const list = (res.data as any)?.content || res.data || [];
//       setNotifications(list);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   }, [isAuthenticated]);

//   // DİĞER BİLEŞENLERDEN GELEN GÜNCELLEMELERİ DİNLE
//   useEffect(() => {
//     const handleSync = () => fetchInitialNotifications();
//     window.addEventListener('notifications-updated', handleSync);
//     return () => window.removeEventListener('notifications-updated', handleSync);
//   }, [fetchInitialNotifications]);

//   useEffect(() => {
//     if (!isAuthenticated || !user?.username) return;

//     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//     if (!token) return;

//     fetchInitialNotifications();

//     const client = new Client({
//       brokerURL: `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws')}/ws-notifications`,
//       connectHeaders: { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` },
//       reconnectDelay: 5000,
//       onConnect: () => {
//         client.subscribe(`/user/${user.username}/queue/notifications`, (message) => {
//           if (message.body) {
//             const newNotif = JSON.parse(message.body);
//             setNotifications(prev => [newNotif, ...prev]);
//             toast.success(newNotif.message, { icon: '🔔' });
//             // WebSocket geldiğinde de diğerlerini uyandır
//             window.dispatchEvent(new Event('notifications-updated'));
//           }
//         });
//       },
//     });

//     client.activate();
//     return () => { client.deactivate(); };
//   }, [isAuthenticated, user?.username, fetchInitialNotifications]);

//   const markRead = async (id: string) => {
//     try {
//       // 1. Local state'i hemen güncelle
//       setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      
//       // 2. Backend'e gönder
//       await notificationService.markAsRead(id);

//       // 3. KRİTİK: Diğer bileşenlere (Sidebar gibi) "ben güncellendim, sen de verini tazele" de
//       window.dispatchEvent(new Event('notifications-updated'));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const markAllAsRead = async () => {
//     setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
//     window.dispatchEvent(new Event('notifications-updated'));
//   };

//   return { notifications, unreadCount, markRead, markAllAsRead };
// };


// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
//   return context;
// };