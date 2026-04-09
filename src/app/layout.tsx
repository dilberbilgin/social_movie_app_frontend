import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toaster } from "react-hot-toast"; // Bildirim popupları için

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="bg-gray-900 text-white antialiased flex"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <Toaster position="top-right" />

              <Sidebar />
              
              <div
                className="flex-1 transition-all duration-300 
     ml-0 sm:ml-16 xl:ml-64 
     min-h-screen flex flex-col"
              >
                <main className="container mx-auto px-2 sm:px-4 py-6">
                  {children}
                </main>
              </div>

              {/* 3. Portallar ve Modallar */}
              {modal}
              <div id="modal-root" />
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
