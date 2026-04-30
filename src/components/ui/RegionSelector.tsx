"use client";
import { useRegion } from "@/context/RegionContext";
import { Globe } from "lucide-react";

const regions = [
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "US", name: "USA", flag: "🇺🇸" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GB", name: "UK", flag: "🇬🇧" },
];

export default function RegionSelector({ hideText = false }) {
  const { region, changeRegion } = useRegion();

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 text-gray-400 transition-all ${hideText ? "justify-center" : ""}`}>
      <Globe size={24} className="shrink-0" />
      
      {!hideText && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-[10px] uppercase font-bold text-gray-500 leading-none mb-1">
            Region
          </span>
          <select
            value={region}
            onChange={(e) => changeRegion(e.target.value)}
            className="bg-transparent border-none text-sm text-white cursor-pointer outline-none w-full appearance-none"
          >
            {regions.map((r) => (
              <option key={r.code} value={r.code} className="bg-gray-900 text-white">
                {r.flag} {r.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}