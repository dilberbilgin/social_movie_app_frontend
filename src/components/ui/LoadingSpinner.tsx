export const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-yellow-500 font-bold animate-pulse tracking-widest uppercase text-[10px]">
      Yükleniyor...
    </p>
  </div>
);