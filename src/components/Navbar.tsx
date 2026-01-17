"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";

const Navbar = () => {
  // 1. Santrallere (Context) bağlanıyoruz
  const { user, logout, isAuthenticated } = useAuth();
  const { t, lang, changeLanguage } = useTranslation();

  // 2. Dil seçeneklerini bir config olarak tutuyoruz (Geliştirilebilir yapı)
  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-bold text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          Movie<span className="text-white">Social Movie Club</span>
        </Link>

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
