// import './globals.css';
// import Navbar from '@/components/Navbar';
// import { AuthProvider } from '@/context/AuthContext';
// import { LanguageProvider } from '@/context/LanguageContext';


// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-900 text-white antialiased" suppressHydrationWarning>
//         <LanguageProvider>
//           <AuthProvider>
//             <Navbar />
//             <div className="container mx-auto px-4"> 
//             {children}
//             </div>
//           </AuthProvider>
//         </LanguageProvider>
//       </body>
//     </html>
//   );
// } 







// src/app/layout.tsx
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout({ 
  children,
  modal 
}: { 
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white antialiased flex" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            {/* 1. Sabit Sidebar */}
            <Sidebar />

            {/* 2. Ana İçerik Alanı: Sidebar genişliği kadar soldan boşluk (margin-left) veriyoruz */}
            <div className="flex-1 ml-16 xl:ml-64 min-h-screen flex flex-col">
              <main className="container mx-auto px-4 py-6"> 
                {children}
              </main>
            </div>

            {/* 3. Portallar ve Modallar */}
            {modal}
            <div id="modal-root" />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}














// // src/app/layout.tsx
// import './globals.css';
// import Navbar from '@/components/Navbar';
// import { AuthProvider } from '@/context/AuthContext';
// import { LanguageProvider } from '@/context/LanguageContext';

// export default function RootLayout({ 
//   children,
//   modal // @modal slot'u buraya gelir
// }: { 
//   children: React.ReactNode;
//   modal: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-900 text-white antialiased" suppressHydrationWarning>
//         <LanguageProvider>
//           <AuthProvider>
//             <Navbar />
//             <div className="container mx-auto px-4"> 
//               {children}
//             </div>
//             {modal} {/* Modal slotunu buraya ekledik */}
//             <div id="modal-root" /> {/* İleride portal gerekirse diye */}
//           </AuthProvider>
//         </LanguageProvider>
//       </body>
//     </html>
//   );
// }