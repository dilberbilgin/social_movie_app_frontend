
"use client";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

interface LanguageSelectorProps {
  dropdownPosition?: "top" | "bottom";
  hideText?: boolean;
  align?: "left" | "right"; // <-- YENİ: Hizalama yönü
  showLabel?: boolean;
  isFullWidth?: boolean;
}

export default function LanguageSelector({ 
  dropdownPosition = "bottom", 
  hideText = false,
  align = "left", // Varsayılan soldan sağa
  showLabel = true,
  isFullWidth = true 
}: LanguageSelectorProps) {
  const { lang, changeLanguage } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const positionClasses = dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2";
  
  // Hizalama sınıfı: 'right' ise butonun sağ kenarına yaslanır ve sola doğru açılır
  const alignClasses = align === "right" ? "right-0" : "left-0";

  return (
    <div className={`relative ${isFullWidth ? 'w-full' : 'w-auto'}`} ref={langRef}>
      <button 
        onClick={() => setIsLangOpen(!isLangOpen)} 
        className={`flex items-center gap-2 p-3 rounded-lg hover:bg-white/10 text-gray-400 transition-all ${isFullWidth ? 'w-full' : ''}`}
      >
        <Globe size={20} /> 
        {showLabel && (
          <>
            <span className="hidden xl:block flex-1 text-left uppercase font-bold text-xs">
              {lang}
            </span>
            <ChevronDown size={14} className={`hidden xl:block transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isLangOpen && (
        <div className={`absolute min-w-[140px] bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden ${positionClasses} ${alignClasses}`}>
          <button 
            onClick={() => {changeLanguage('tr'); setIsLangOpen(false)}} 
            className={`w-full p-3 text-left text-xs hover:bg-white/5 transition-colors ${lang === 'tr' ? 'text-yellow-500 font-bold' : 'text-white'}`}
          >
            TR - Türkçe
          </button>
          <button 
            onClick={() => {changeLanguage('en'); setIsLangOpen(false)}} 
            className={`w-full p-3 text-left text-xs hover:bg-white/5 transition-colors ${lang === 'en' ? 'text-yellow-500 font-bold' : 'text-white'}`}
          >
            EN - English
          </button>
        </div>
      )}
    </div>
  );
}