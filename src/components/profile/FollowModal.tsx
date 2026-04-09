"use client";
import { UserResponse } from "@/types";
import Link from "next/link";
import { followService } from "@/services/followService";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  users: any;
  onAction?: () => void; // Sayıları yenilemek için tetiklenecek fonksiyon
}

export default function FollowModal({
  title,
  isOpen,
  onClose,
  users,
  onAction,
}: Props) {
  const { user: currentUser } = useAuth();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 1. Gelen kullanıcıları lokal state'e alıyoruz ki anlık güncelleyebilelim
  const [localUsers, setLocalUsers] = useState<UserResponse[]>([]);

  // Modal her açıldığında veya users değişkendiğinde lokal state'i güncelle
  useEffect(() => {
    if (users?.content) {
      setLocalUsers(users.content);
    } else if (Array.isArray(users)) {
      setLocalUsers(users);
    } else {
      setLocalUsers([]); // Veri yoksa boşalt
    }
  }, [users, isOpen]);

  if (!isOpen) return null;

  const handleFollowToggle = async (u: UserResponse) => {
    setLoadingId(u.id);
    try {
      if (u.isFollowing) {
        await followService.unfollow(u.id);
      } else {
        await followService.follow(u.id);
      }

      // 2. Arayüzü anlık güncelle (Optimistic Update)
      setLocalUsers((prev) =>
        prev.map((user) =>
          user.id === u.id ? { ...user, isFollowing: !user.isFollowing } : user,
        ),
      );

      if (onAction) onAction();
    } catch (error) {
      console.error("Follow action failed", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
          {localUsers && localUsers.length > 0 ? (
            localUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/50 transition-colors"
              >
                <Link
                  href={`/profile/${u.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                    👤
                  </div>
                  <p className="text-white font-bold">{u.username}</p>
                </Link>

                {currentUser?.id !== u.id && (
                  <button
                    onClick={() => handleFollowToggle(u)}
                    disabled={loadingId === u.id}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer min-w-23.75 ${
                      u.isFollowing
                        ? "bg-gray-800 text-gray-400 border border-gray-700 hover:border-red-500 hover:text-red-500"
                        : "bg-yellow-500 text-black hover:bg-yellow-400"
                    }`}
                  >
                    {loadingId === u.id
                      ? "..."
                      : u.isFollowing
                        ? "Unfollow"
                        : "Follow"}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-500 italic">
              {users ? "Henüz kimse yok." : "Yükleniyor..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
