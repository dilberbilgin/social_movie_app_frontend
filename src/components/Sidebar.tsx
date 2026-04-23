"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Compass, LogOut, LogIn, Bell, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SearchModal from "./ui/SearchModal";
import LanguageSelector from "./ui/LanguageSelector";
import { NotificationPanel } from "./social/NotificationPanel";
import { useNotifications } from "@/context/NotificationContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleHomeClick = (e) => {
  if (window.location.pathname === '/') {
    e.preventDefault(); // Sayfayı tekrar yükleme
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

  const NavLinks = () => (
    <>
      <Link
        href="/"
        onClick={handleHomeClick}
        className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 ${pathname === "/" ? "text-white font-bold" : "text-gray-400"}`}
      >
        <Home size={24} />{" "}
        <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>Home</span>
      </Link>

      <button
        onClick={() => {
          setIsSearchOpen(true);
          setIsNotifOpen(false);
        }}
        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-gray-400"
      >
        <Search size={24} />{" "}
        <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>
          Search
        </span>
      </button>

      <Link
        href="/explore"
        className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 ${pathname === "/explore" ? "text-white font-bold" : "text-gray-400"}`}
      >
        <Compass size={24} />{" "}
        <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>
          Explore
        </span>
      </Link>

      {isAuthenticated && (
        <button
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className={`w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 relative ${isNotifOpen ? "text-white bg-white/10 font-bold" : "text-gray-400"}`}
        >
          <div className="relative">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>
            Notifications
          </span>
        </button>
      )}
    </>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR (Geniş ekranlarda solda) */}
      <aside
        className={`fixed left-0 top-0 h-screen border-r border-gray-900 #030712; p-3 hidden md:flex flex-col transition-all duration-300 z-70 ${isNotifOpen ? "w-16" : "w-16 xl:w-64"}`}
      >
        <div className="mb-10 px-3 pt-6">
          <Link href="/">
            <h1
              className={`text-xl font-bold italic text-yellow-500 ${isNotifOpen ? "hidden" : "hidden xl:block"}`}
            >
              MovieSocial
            </h1>
            <div
              className={`w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-black ${isNotifOpen ? "block" : "xl:hidden"}`}
            >
              M
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLinks />
          <div className="pt-2">
            <LanguageSelector
              dropdownPosition="bottom"
              hideText={isNotifOpen}
            />
          </div>
        </nav>

        <div className="mt-auto pb-4 border-t border-gray-900 pt-4 space-y-2 text-white">
          {isAuthenticated ? (
            <>
              <Link
                href={`/profile/${user?.username}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10"
              >
                <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs font-bold shrink-0">
                  {user?.username?.[0].toUpperCase()}
                </div>
                <span
                  className={`truncate text-sm font-medium ${isNotifOpen ? "hidden" : "hidden xl:block"}`}
                >
                  {user?.username}
                </span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-500/10 text-red-500"
              >
                <LogOut size={24} />{" "}
                <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>
                  Logout
                </span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-500/10 text-blue-400"
            >
              <LogIn size={24} />{" "}
              <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>
                Login
              </span>
            </Link>
          )}
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV (Telefon boyutu aşağıda )*/}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800 flex md:hidden items-center justify-around px-2 z-70 pb-safe">
        <Link
          href="/"
          className={pathname === "/" ? "text-yellow-500" : "text-gray-400"}
        >
          <Home size={26} />
        </Link>
        <button onClick={() => setIsSearchOpen(true)} className="text-gray-400">
          <Search size={26} />
        </button>
        <Link
          href="/explore"
          className={
            pathname === "/explore" ? "text-yellow-500" : "text-gray-400"
          }
        >
          <Compass size={26} />
        </Link>
        {isAuthenticated && (
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative ${isNotifOpen ? "text-yellow-500" : "text-gray-400"}`}
          >
            <Bell size={26} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full min-w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        )}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link
              href={`/profile/${user?.username}`}
              className={`cursor-pointer ${pathname.includes("/profile") ? "text-yellow-500" : "text-gray-400"}`}
            >
              <User size={26} />
            </Link>
            {/* Mobilde Logout'u küçük bir ikon olarak profilin yanına ekleyebilirsin veya Profil sayfasının içine koyabilirsin */}
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-red-500 cursor-pointer p-1"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-gray-400">
            <LogIn size={26} />
          </Link>
        )}
      </nav>

      {/* NOTIFICATION PANEL (Mobilde bildirimler acilinca kapanamiyor, buraya bakilacak!!!) */}
      {isNotifOpen && (
        <div className="fixed left-0 md:left-16 bottom-16 md:top-0 h-[calc(100vh-64px)] md:h-screen w-full md:w-80 xl:w-100 bg-black border-r border-gray-800 shadow-2xl z-65 animate-in slide-in-from-bottom md:slide-in-from-left duration-300">
          <NotificationPanel onClose={() => setIsNotifOpen(false)} />
        </div>
      )}

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      {isNotifOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:bg-transparent z-64"
          onClick={() => setIsNotifOpen(false)}
        />
      )}
    </>
  );
}
