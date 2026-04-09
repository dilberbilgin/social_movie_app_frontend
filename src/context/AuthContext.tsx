"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 1. Kimlik kurallarımızı (Interface) belirliyoruz
interface AuthContextType {
  user: any; // Giriş yapan kullanıcının bilgileri
  token: string | null; // JWT Token (Backend ile konuşmak için )

  login: (userData: any, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 2. Boş havuzu oluştur
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // 3. Sayfa açıldığında "Giriş yapılmış mı?" kontrolü yap
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        // LocalStorage'daki metni tekrar objeye çevir(Deserilization)
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("User bilgisi okunurken hata oluştu:", error);
      }
    }
  }, []);

  // 4. Giriş Yapma Fonksiyonu
  const login = (userData: any, newToken: string) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 5. Çıkış Yapma Fonksiyonu
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 6. Güvenli Hook oluşturuyoruz (Context'i kullanmak için)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
