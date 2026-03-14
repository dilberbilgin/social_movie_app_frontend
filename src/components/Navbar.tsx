"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { UserResponse } from "@/types";
import { userService } from "@/services/userService";
import { NotificationPanel } from "./social/NotificationPanel";

const Navbar = () => {
  // 1. Santrallere (Context) bağlanıyoruz
  const { user, logout, isAuthenticated } = useAuth();
  const { t, lang, changeLanguage } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState<UserResponse[]>([]);
const [isSearching, setIsSearching] = useState(false);


useEffect(() => {
  if (searchQuery.length < 2) {
    setSearchResults([]);
    return;
  }

  const delayDebounceFn = setTimeout(async () => {
    setIsSearching(true);
    try {
      // const res = await userService.searchUsers(searchQuery, lang);
      const res = await userService.searchUsers(searchQuery, lang, 0, 5); // Sadece en iyi 5 sonucu getir
      if (res.success) {
        setSearchResults(res.data.content || []);
      }
    } finally {
      setIsSearching(false);
    }
  }, 500);

  return () => clearTimeout(delayDebounceFn);
}, [searchQuery, lang]);

  // 2. Dil seçeneklerini bir config olarak tutuyoruz (Geliştirilebilir yapı)
  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        {/* LOGO VE SOL MENÜ */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-bold text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            Movie<span className="text-white">Social</span>
          </Link>

          {/* NAVİGASYON LİNKLERİ */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/explore"
              className="text-gray-300 hover:text-yellow-500 font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-lg">🔍</span> {t('nav.explore')}
            </Link>
          </div>
        </div>

        {/* 2. ORTA: KULLANICI ARAMA ÇUBUĞU (RESPONSIVE) */}
        <div className="relative flex-[1.5] max-w-30 sm:max-w-xs md:max-w-md mx-1 md:mx-4">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center text-gray-500 group-focus-within:text-yellow-500 transition-colors">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchUserPlaceholder') || "Search..."}
              className="w-full bg-gray-900 text-white text-[12px] md:text-sm rounded-lg md:rounded-xl py-1.5 md:py-2 pl-8 md:pl-10 pr-2 border border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-600"
            />
            {isSearching && (
              <span className="absolute right-2 top-2 animate-spin text-[10px] md:text-xs text-yellow-500">
                ⌛
              </span>
            )}
          </div>

          {/* SONUÇLAR DROPDOWN */}
          {searchQuery.length >= 2 && (
            <div className="absolute top-full left-0 w-50 sm:w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg md:rounded-xl shadow-2xl overflow-hidden z-100">
              {searchResults.length > 0 ? (
                searchResults.map((u) => (
                  <Link
                    key={u.id}
                    href={`/profile/${u.username}`}
                    onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                    className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0"
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px] md:text-xs border border-yellow-500/50 shrink-0">
                      👤
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs md:text-sm font-bold text-white truncate">{u.username}</span>
                      <span className="text-[8px] md:text-[10px] text-gray-500 uppercase">View Profile</span>
                    </div>
                  </Link>
                ))
              ) : (
                !isSearching && <div className="p-3 text-center text-xs text-gray-500">No results.</div>
              )}
            </div>
          )}
        </div>

        {/* SAĞ TARAF: Dil Seçici ve Üyelik İşlemleri */}
        <div className="flex items-center gap-6">
          {/* DİL SEÇİCİ (Select Box) */}
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2 border-none outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* KULLANICI MENÜSÜ */}
          <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
            {isAuthenticated ? (
              // Giriş yapmış kullanıcı görünümü
              <>
              {/* BİLDİRİM PANELİ BURAYA GELİYOR */}
                <NotificationPanel />
                <div className="flex flex-col items-end mr-2">
                  {" "}
                  {/* mr-2 ile Profile linkiyle arayı açtık */}
                  <span className="text-sm font-medium text-gray-400">
                    {t("nav.welcome")},
                    <span className="text-yellow-500 font-bold ml-1">
                      {/* Öncelik: Backend'den gelen isim | Yedek: Çeviri dosyasındaki misafir tanımı */}
                      {user?.username || t("nav.guest")}
                      
                    </span>
                  </span>
                  <Link
                    href="/profile"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {t("nav.profile")}
                  </Link>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-all shadow-md active:scale-95"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              // Giriş yapmamış kullanıcı görünümü
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
                >
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
