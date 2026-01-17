import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <div className="container mx-auto px-4"> 
            {children}
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}