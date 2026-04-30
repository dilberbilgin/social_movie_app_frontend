"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RegionContextType {
  region: string;
  changeRegion: (newRegion: string) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState("TR");

  useEffect(() => {
    const savedRegion = localStorage.getItem("region") || "TR";
    setRegion(savedRegion);
  }, []);

  const changeRegion = (newRegion: string) => {
    setRegion(newRegion);
    localStorage.setItem("region", newRegion);
    // Sayfayı yenilemek en temizidir çünkü tüm API call'lar yeni header ile gitmeli
    window.location.reload(); 
  };

  return (
    <RegionContext.Provider value={{ region, changeRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) throw new Error("useRegion must be used within RegionProvider");
  return context;
};