export const detectRegion = () => {
  if (typeof window === "undefined") return "TR";
  
  const existing = localStorage.getItem("region");
  if (existing) return existing;

  // Zaman diliminden ülke tahmini (Basit ve etkili)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes("Lisbon")) return "PT";
  if (tz.includes("Istanbul")) return "TR";
  
  return "TR";
};