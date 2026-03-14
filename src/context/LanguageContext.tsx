'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';

// 1. Sözlükleri bir çatı altında topla
const translations: Record<string, any> = { tr, en };

// 1. Arayüzü (Interface) netleştiriyoruz
// interface LanguageContextType {
//   lang: string;
//   t: (path: string) => string;
//   changeLanguage: (newLang: string) => void;
// }
// 1. Arayüzü güncelle (ikinci parametre opsiyonel bir obje olsun)
interface LanguageContextType {
  lang: string;
  t: (path: string, params?: Record<string, any>) => string;
  changeLanguage: (newLang: string) => void;
}

// 2. Başlangıçta null yerine undefined verip tipi kısıtlıyoruz
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState('en');
  // Sayfa ilk açıldığında tarayıcı dilini veya kaydedilen dili al
useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'en';
    setLang(savedLang);
  }, []);

//   const t = (path: string): string => {
//     // "auth.loginTitle" şeklinde gelen string'i JSON içinde bulur
// const value = path.split('.').reduce((obj, key) => obj?.[key], translations[lang]);
//     return value || path; // Bulamazsa anahtarın adını dön (Hata ayıklama için iyi)
//   };
const t = (path: string, params?: Record<string, any>): string => {
  // JSON içindeki değeri bul
  let value = path.split('.').reduce((obj, key) => obj?.[key], translations[lang]);
  
  if (!value) return path;

  // Eğer params gönderildiyse, {title} gibi ifadeleri değerleriyle değiştir
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      value = value.replace(new RegExp(`{${key}}`, 'g'), val);
    });
  }

  return value;
};


  const changeLanguage = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ t, lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 3. Güvenli Hook (Eğer Provider dışında kullanılırsa seni uyarır)
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};