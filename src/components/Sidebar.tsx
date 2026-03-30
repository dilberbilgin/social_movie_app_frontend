
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Home, Search, Compass, LogOut, LogIn, UserPlus } from "lucide-react"; 
// import { useAuth } from "@/context/AuthContext";
// import SearchModal from "./ui/SearchModal"; 
// import LanguageSelector from "./ui/LanguageSelector";

// export default function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { logout, user, isAuthenticated } = useAuth();
//   const [isSearchOpen, setIsSearchOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     router.push("/login");
//   };

//   return (
//     <>
//       <aside className="fixed left-0 top-0 h-screen w-16 xl:w-64 border-r border-gray-800 bg-black p-3 flex flex-col transition-all duration-300 z-60">
//         <div className="mb-10 px-3 pt-6">
//           <Link href="/"><h1 className="text-xl font-bold hidden xl:block italic text-yellow-500">MovieSocial</h1></Link>
//         </div>

//         <nav className="flex-1 space-y-2">
//           <Link href="/" className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 ${pathname === '/' ? "text-white font-bold" : "text-gray-400"}`}>
//             <Home size={24} /> <span className="hidden xl:block">Home</span>
//           </Link>

//           <button 
//             onClick={() => setIsSearchOpen(true)}
//             className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-gray-400 transition-all"
//           >
//             <Search size={24} /> <span className="hidden xl:block">Search</span>
//           </button>

//           <Link href="/explore" className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 ${pathname === '/explore' ? "text-white font-bold" : "text-gray-400"}`}>
//             <Compass size={24} /> <span className="hidden xl:block">Explore</span>
//           </Link>

//           {/* TEMİZLENDİ: LanguageSelector artık burada */}
//           <LanguageSelector dropdownPosition="bottom" />
//         </nav>

//         <div className="mt-auto pb-4 border-t border-gray-800 pt-4 space-y-2">
//           {isAuthenticated ? (
//             <>
//               <Link href={`/profile/${user?.username}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all">
//                 <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs font-bold">
//                   {user?.username?.[0].toUpperCase()}
//                 </div>
//                 <span className="hidden xl:block text-sm font-medium">{user?.username}</span>
//               </Link>
//               <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-500/10 text-red-500">
//                 <LogOut size={24} /> <span className="hidden xl:block text-sm">Logout</span>
//               </button>
//             </>
//           ) : (
//             <>
//               <Link href="/login" className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-blue-400"><LogIn size={24} /> <span className="hidden xl:block">Login</span></Link>
//               <Link href="/register" className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-green-400"><UserPlus size={24} /> <span className="hidden xl:block">Register</span></Link>
//             </>
//           )}
//         </div>
//       </aside>

//       {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
//     </>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Compass, LogOut, LogIn, Bell } from "lucide-react"; 
import { useAuth } from "@/context/AuthContext";
// import { useNotifications } from "@/hooks/useNotifications";
import SearchModal from "./ui/SearchModal"; 
import LanguageSelector from "./ui/LanguageSelector";
import { NotificationPanel } from "./social/NotificationPanel";
import { useNotifications } from "@/context/NotificationContext"

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications(); // Buradaki unreadCount'u kullanıyoruz
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <>
      <aside className={`fixed left-0 top-0 h-screen border-r border-gray-800 bg-black p-3 flex flex-col transition-all duration-300 z-[70] ${isNotifOpen ? "w-16" : "w-16 xl:w-64"}`}>
        <div className="mb-10 px-3 pt-6">
          <Link href="/">
            <h1 className={`text-xl font-bold italic text-yellow-500 ${isNotifOpen ? "hidden" : "hidden xl:block"}`}>MovieSocial</h1>
            <div className={`w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-black ${isNotifOpen ? "block" : "xl:hidden"}`}>M</div>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/" className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 ${pathname === '/' ? "text-white font-bold" : "text-gray-400"}`}>
            <Home size={24} /> <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>Home</span>
          </Link>

          <button onClick={() => { setIsSearchOpen(true); setIsNotifOpen(false); }} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-gray-400">
            <Search size={24} /> <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>Search</span>
          </button>

          <Link href="/explore" className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 ${pathname === '/explore' ? "text-white font-bold" : "text-gray-400"}`}>
            <Compass size={24} /> <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>Explore</span>
          </Link>

          {isAuthenticated && (
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 relative ${isNotifOpen ? "text-white bg-white/10 font-bold" : "text-gray-400"}`}
            >
              <div className="relative">
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>Notifications</span>
            </button>
          )}

          <div className="pt-2">
            <LanguageSelector dropdownPosition="bottom" hideText={isNotifOpen} />
          </div>
        </nav>

        <div className="mt-auto pb-4 border-t border-gray-800 pt-4 space-y-2 text-white">
          {isAuthenticated ? (
            <>
              <Link href={`/profile/${user?.username}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10">
                <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs font-bold shrink-0">{user?.username?.[0].toUpperCase()}</div>
                <span className={`truncate text-sm font-medium ${isNotifOpen ? "hidden" : "hidden xl:block"}`}>{user?.username}</span>
              </Link>
              <button onClick={() => { logout(); router.push("/login"); }} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-500/10 text-red-500">
                <LogOut size={24} /> <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>Logout</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-500/10 text-blue-400">
              <LogIn size={24} /> <span className={isNotifOpen ? "hidden" : "hidden xl:block"}>Login</span>
            </Link>
          )}
        </div>
      </aside>

      {/* PANEL */}
      {isNotifOpen && (
        <div className="fixed left-16 top-0 h-screen w-80 xl:w-[400px] bg-black border-r border-gray-800 shadow-2xl z-[65] animate-in slide-in-from-left duration-300">
           <NotificationPanel onClose={() => setIsNotifOpen(false)} />
        </div>
      )}

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      {isNotifOpen && <div className="fixed inset-0 bg-transparent z-[64]" onClick={() => setIsNotifOpen(false)} />}
    </>
  );
}