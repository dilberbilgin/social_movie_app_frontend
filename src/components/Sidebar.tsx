// // // src/components/Sidebar.tsx
// // "use client";

// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare } from "lucide-react";

// // export default function Sidebar() {
// //   const pathname = usePathname();

// //   const menuItems = [
// //     { name: "Home", href: "/", icon: <Home size={24} /> },
// //     { name: "Search", href: "#", icon: <Search size={24} /> },
// //     { name: "Explore", href: "/explore", icon: <Compass size={24} /> },
// //     { name: "Reels", href: "#", icon: <Film size={24} /> },
// //     { name: "Messages", href: "#", icon: <MessageCircle size={24} /> },
// //     { name: "Notifications", href: "#", icon: <Heart size={24} /> },
// //     { name: "Create", href: "#", icon: <PlusSquare size={24} /> },
// //   ];

// //   return (
// //     <aside className="fixed left-0 top-0 h-screen w-16 xl:w-64 border-r border-gray-800 bg-black p-3 flex flex-col transition-all duration-300 z-50">
// //       {/* Logo Alanı */}
// //       <div className="mb-10 px-3 pt-6">
// //         <h1 className="text-xl font-bold hidden xl:block italic">MovieSocial</h1>
// //         <div className="xl:hidden">M</div>
// //       </div>

// //       {/* Menü Linkleri */}
// //       <nav className="flex-1 space-y-2">
// //         {menuItems.map((item) => {
// //           const isActive = pathname === item.href;
// //           return (
// //             <Link
// //               key={item.name}
// //               href={item.href}
// //               className={`
// //                 flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group
// //                 hover:bg-white/10  /* Instagram tarzı hafif grilik */
// //                 ${isActive ? "font-bold" : "text-gray-300"}
// //               `}
// //             >
// //               <div className="group-hover:scale-110 transition-transform">
// //                 {item.icon}
// //               </div>
// //               <span className="hidden xl:block text-base">{item.name}</span>
// //             </Link>
// //           );
// //         })}
// //       </nav>
// //     </aside>
// //   );
// // }

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, LogOut, Globe, LogIn, UserPlus, ChevronUp } from "lucide-react"; 
// import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "@/context/LanguageContext";
// import { useState, useRef, useEffect } from "react";

// export default function Sidebar() {
//   const pathname = usePathname();
//   const { logout, user, isAuthenticated } = useAuth();
//   const { t, lang, changeLanguage } = useTranslation();
  
//   // Menü açılış kontrolü için state
//   const [isLangOpen, setIsLangOpen] = useState(false);
//   const langRef = useRef<HTMLDivElement>(null);

//   const menuItems = [
//     { name: t('nav.home') || "Home", href: "/", icon: <Home size={24} /> },
//     { name: t('nav.search') || "Search", href: "/explore", icon: <Search size={24} /> },
//     { name: t('nav.explore') || "Explore", href: "/explore", icon: <Compass size={24} /> },
//     { name: t('nav.reels') || "Reels", href: "#", icon: <Film size={24} /> },
//   ];

//   const languages = [
//     { code: "en", label: "English", flag: "🇺🇸" },
//     { code: "tr", label: "Türkçe", flag: "🇹🇷" },
//   ];

//   // Menü dışına tıklandığında kapanması için
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (langRef.current && !langRef.current.contains(event.target as Node)) {
//         setIsLangOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <aside className="fixed left-0 top-0 h-screen w-16 xl:w-64 border-r border-gray-800 bg-black p-3 flex flex-col transition-all duration-300 z-[60]">
//       {/* Logo */}
//       <div className="mb-10 px-3 pt-6">
//         <Link href="/" onClick={(e) => {
//           if (pathname === "/") {
//             e.preventDefault();
//             window.scrollTo({ top: 0, behavior: "smooth" });
//           }
//         }}>
//           <h1 className="text-xl font-bold hidden xl:block italic tracking-tighter text-yellow-500">MovieSocial</h1>
//           <div className="xl:hidden font-bold text-xl text-yellow-500 text-center">M</div>
//         </Link>
//       </div>

//       {/* Ana Menü */}
//       <nav className="flex-1 space-y-2">
//         {menuItems.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link key={item.name} href={item.href}
//               className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group hover:bg-white/10 ${isActive ? "font-bold text-white" : "text-gray-400"}`}
//             >
//               <div className="group-hover:scale-110 transition-transform">{item.icon}</div>
//               <span className="hidden xl:block text-base">{item.name}</span>
//             </Link>
//           );
//         })}

//         {/* Dil Değiştirme (Dropdown Yapısı) */}
//         <div className="relative" ref={langRef}>
//           <button 
//             onClick={() => setIsLangOpen(!isLangOpen)}
//             className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all group hover:bg-white/10 ${isLangOpen ? "bg-white/10 text-white" : "text-gray-400"}`}
//           >
//             <div className="group-hover:rotate-12 transition-transform"><Globe size={24} /></div>
//             <span className="hidden xl:block text-base flex-1 text-left">
//               {languages.find(l => l.code === lang)?.label}
//             </span>
//             <ChevronUp size={16} className={`hidden xl:block transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
//           </button>

//           {/* Açılır Menü Modeli */}
//           {isLangOpen && (
//             <div className="absolute bottom-full left-0 mb-2 w-full xl:w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-[70] animate-in fade-in slide-in-from-bottom-2">
//               {languages.map((l) => (
//                 <button
//                   key={l.code}
//                   onClick={() => {
//                     changeLanguage(l.code);
//                     setIsLangOpen(false);
//                   }}
//                   className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 ${lang === l.code ? "text-yellow-500 font-bold bg-white/5" : "text-gray-300"}`}
//                 >
//                   <span>{l.flag}</span>
//                   <span>{l.label}</span>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Alt Kısım: Auth İşlemleri */}
//       <div className="mt-auto pb-4 border-t border-gray-800 pt-4 space-y-2">
//         {isAuthenticated ? (
//           <>
//             <Link href={`/profile/${user?.username}`}
//               className={`flex items-center gap-4 p-3 rounded-lg transition-all group hover:bg-white/10 ${pathname.includes('/profile') ? "text-white font-bold" : "text-gray-400"}`}
//             >
//               <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 to-red-500 p-0.5 group-hover:scale-110 transition-transform">
//                 <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
//                   {user?.username?.[0].toUpperCase()}
//                 </div>
//               </div>
//               <span className="hidden xl:block text-sm font-medium">{user?.username}</span>
//             </Link>
            
//             <button onClick={logout}
//               className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-500/10 text-red-500 transition-all group"
//             >
//               <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
//               <span className="hidden xl:block text-sm font-medium">Logout</span>
//             </button>
//           </>
//         ) : (
//           <>
//             <Link href="/login" className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-blue-400 transition-all group">
//               <LogIn size={24} className="group-hover:translate-x-1 transition-transform" />
//               <span className="hidden xl:block text-sm font-medium">Login</span>
//             </Link>
//             <Link href="/register" className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-green-400 transition-all group">
//               <UserPlus size={24} className="group-hover:scale-110 transition-transform" />
//               <span className="hidden xl:block text-sm font-medium">Register</span>
//             </Link>
//           </>
//         )}
//       </div>
//     </aside>
//   );
// }

// // src/components/Sidebar.tsx
// // "use client";

// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, LogOut, User, Globe, LogIn, UserPlus } from "lucide-react"; 
// // import { useAuth } from "@/context/AuthContext";
// // import { useTranslation } from "@/context/LanguageContext";

// // export default function Sidebar() {
// //   const pathname = usePathname();
// //   const { logout, user, isAuthenticated } = useAuth();
// // //   const { lang, setLang, t } = useTranslation();
// //   const { t, lang, changeLanguage } = useTranslation();

// //   const menuItems = [
// //     { name: t('nav.home') || "Home", href: "/", icon: <Home size={24} /> },
// //     { name: t('nav.search') || "Search", href: "/explore", icon: <Search size={24} /> },
// //     { name: t('nav.explore') || "Explore", href: "/explore", icon: <Compass size={24} /> },
// //     { name: t('nav.reels') || "Reels", href: "#", icon: <Film size={24} /> },
// //   ];

// // //   const toggleLanguage = () => {
// // //     setLang(lang === 'tr' ? 'en' : 'tr');
// // //   };

// //   const languages = [
// //     { code: "en", label: "English", flag: "🇺🇸" },
// //     { code: "tr", label: "Türkçe", flag: "🇹🇷" },
// //   ];
// //   const handleLogoClick = (e: React.MouseEvent) => {
// //   if (window.location.pathname === "/") {
// //     e.preventDefault();
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   }
// // };

// //   return (
// //     <aside className="fixed left-0 top-0 h-screen w-16 xl:w-64 border-r border-gray-800 bg-black p-3 flex flex-col transition-all duration-300 z-50">
// //       {/* Logo */}
// //       <div className="mb-10 px-3 pt-6">
// //         <h1 className="text-xl font-bold hidden xl:block italic tracking-tighter text-yellow-500">MovieSocial</h1>
// //         <div className="xl:hidden font-bold text-xl text-yellow-500 text-center">M</div>
// //       </div>

// //       {/* Ana Menü */}
// //       <nav className="flex-1 space-y-2">
// //         {menuItems.map((item) => {
// //           const isActive = pathname === item.href;
// //           return (
// //             <Link key={item.name} href={item.href}
// //               className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group hover:bg-white/10 ${isActive ? "font-bold text-white" : "text-gray-400"}`}
// //             >
// //               <div className="group-hover:scale-110 transition-transform">{item.icon}</div>
// //               <span className="hidden xl:block text-base">{item.name}</span>
// //             </Link>
// //           );
// //         })}

// //         {/* Dil Değiştirme Butonu */}
// //         <button onClick={changeLanguage}
// //           className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-gray-400 transition-all group"
// //         >
// //           <div className="group-hover:rotate-12 transition-transform"><Globe size={24} /></div>
// //           <span className="hidden xl:block text-base">{lang === 'tr' ? 'English' : 'Türkçe'}</span>
// //         </button>
// //       </nav>

// //       {/* Alt Kısım: Auth İşlemleri */}
// //       <div className="mt-auto pb-4 border-t border-gray-800 pt-4 space-y-2">
// //         {isAuthenticated ? (
// //           <>
// //             <Link href={`/profile/${user?.username}`}
// //               className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all group"
// //             >
// //               <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 to-red-500 p-0.5">
// //                 <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
// //                   {user?.username?.[0].toUpperCase()}
// //                 </div>
// //               </div>
// //               <span className="hidden xl:block text-sm font-medium">{user?.username}</span>
// //             </Link>
            
// //             <button onClick={logout}
// //               className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
// //             >
// //               <LogOut size={24} />
// //               <span className="hidden xl:block text-sm font-medium">Logout</span>
// //             </button>
// //           </>
// //         ) : (
// //           <>
// //             <Link href="/login" className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-blue-400 transition-all">
// //               <LogIn size={24} />
// //               <span className="hidden xl:block text-sm font-medium">Login</span>
// //             </Link>
// //             <Link href="/register" className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-green-400 transition-all">
// //               <UserPlus size={24} />
// //               <span className="hidden xl:block text-sm font-medium">Register</span>
// //             </Link>
// //           </>
// //         )}
// //       </div>
// //     </aside>
// //   );
// // }

// src/components/Sidebar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Compass, LogOut, Globe, LogIn, UserPlus, ChevronDown } from "lucide-react"; 
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import SearchModal from "./ui/SearchModal"; 
import { History } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuth();
  const { t, lang, changeLanguage } = useTranslation();
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Menü dışına tıklandığında kapanması için
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-16 xl:w-64 border-r border-gray-800 bg-black p-3 flex flex-col transition-all duration-300 z-[60]">
        <div className="mb-10 px-3 pt-6">
          <Link href="/"><h1 className="text-xl font-bold hidden xl:block italic text-yellow-500">MovieSocial</h1></Link>
        </div>

        <nav className="flex-1 space-y-2">
          {/* Home */}
          <Link href="/" className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 ${pathname === '/' ? "text-white font-bold" : "text-gray-400"}`}>
            <Home size={24} /> <span className="hidden xl:block">Home</span>
          </Link>

          {/* Search Button - Artık Modal Açıyor */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-gray-400 transition-all"
          >
            <Search size={24} /> <span className="hidden xl:block">Search</span>
          </button>

          {/* Explore */}
          <Link href="/explore" className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 ${pathname === '/explore' ? "text-white font-bold" : "text-gray-400"}`}>
            <Compass size={24} /> <span className="hidden xl:block">Explore</span>
          </Link>

          {/* Language Dropdown (Aşağı Açılan Versiyon) */}
          <div className="relative" ref={langRef}>
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-gray-400">
              <Globe size={24} /> <span className="hidden xl:block flex-1 text-left">{lang.toUpperCase()}</span>
              <ChevronDown size={16} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50">
                <button onClick={() => {changeLanguage('tr'); setIsLangOpen(false)}} className="w-full p-3 text-left hover:bg-white/5">TR - Türkçe</button>
                <button onClick={() => {changeLanguage('en'); setIsLangOpen(false)}} className="w-full p-3 text-left hover:bg-white/5">EN - English</button>
              </div>
            )}
          </div>
        </nav>

        {/* Bottom Auth Section */}
        <div className="mt-auto pb-4 border-t border-gray-800 pt-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link href={`/profile/${user?.username}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all">
                <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs font-bold">
                  {user?.username?.[0].toUpperCase()}
                </div>
                <span className="hidden xl:block text-sm font-medium">{user?.username}</span>
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-500/10 text-red-500">
                <LogOut size={24} /> <span className="hidden xl:block text-sm">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-blue-400"><LogIn size={24} /> <span className="hidden xl:block">Login</span></Link>
              <Link href="/register" className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-green-400"><UserPlus size={24} /> <span className="hidden xl:block">Register</span></Link>
            </>
          )}
        </div>
      </aside>

      {/* Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}