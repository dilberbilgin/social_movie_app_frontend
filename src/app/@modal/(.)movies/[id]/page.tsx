"use client";
import { useRouter } from "next/navigation";
import MovieDetailContent from "@/components/movie/MovieDetailContent";
import { useEffect, useRef, use } from "react"; 

export default function MovieModal({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const overlay = useRef(null);
  const { id } = use(params);

 
  useEffect(() => {
    // Modal açıldığında arka planın kaymasını engellemek için
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", onKeyDown);

   return () => {
      // Modal kapandığında kaydırmayı tekrar aç
      document.body.style.overflow = 'unset';
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

   const onClick = (e: React.MouseEvent) => {
    if (e.target === overlay.current) {
      router.back();
    }
  };

  return (
    // fixed ve inset-0 modalın ekranın ortasında kalmasını sağlar
    <div
      ref={overlay}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClick}
    >
      <div className="bg-gray-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-800 relative shadow-2xl no-scrollbar">
        <button 
          onClick={() => router.back()}
          className="absolute top-6 right-6 z-10000 w-12 h-12 bg-black/50 hover:bg-white/10 rounded-full text-white transition-all flex items-center justify-center border border-white/10"
        >
          ✕
        </button>
        
        <MovieDetailContent id={id} />
      </div>
    </div>
  );
}