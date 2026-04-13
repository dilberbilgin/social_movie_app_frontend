// import { MovieWatchProviders, WatchProvider } from "@/types";

import { MovieWatchProviders, WatchProvider } from "@/types";

// export default function WatchProviderList({ providers }: { providers: MovieWatchProviders }) {
//   const renderProvider = (p: WatchProvider) => (
//     <div key={p.provider_id} className="group relative">
//       <img 
//         src={p.logo_path} 
//         alt={p.provider_name}
//         className="w-10 h-10 rounded-lg shadow-lg border border-gray-700 group-hover:border-yellow-500 transition-all hover:scale-110"
//       />
//       {/* Tooltip: Üzerine gelince servis adını gösterir */}
//       <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
//         {p.provider_name}
//       </span>
//     </div>
//   );

//   return (
//     <div className="space-y-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
//       {providers.flatrate.length > 0 && (
//         <div>
//           <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">Abonelik (Stream)</p>
//           <div className="flex flex-wrap gap-3">
//             {providers.flatrate.map(renderProvider)}
//           </div>
//         </div>
//       )}
      
//       {providers.rent.length > 0 && (
//         <div>
//           <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">Kirala / Satın Al</p>
//           <div className="flex flex-wrap gap-3">
//             {providers.rent.map(renderProvider)}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

export default function WatchProviderList({ providers }: { providers: MovieWatchProviders }) {
  const renderProvider = (p: WatchProvider) => (
    <div key={p.provider_id} className="group relative flex items-center justify-center">
      <img 
        // src={p.logo_path} 
        // alt={p.provider_name}
        src={p.logo_path.startsWith('http') ? p.logo_path : `https://image.tmdb.org/t/p/original${p.logo_path}`} 
  alt={p.provider_name}
        // h-10 w-10 ve object-contain ekleyerek logonun düzgün görünmesini sağlıyoruz
        className="h-10 w-10 rounded-lg shadow-md border border-gray-700 group-hover:border-yellow-500 transition-all hover:scale-110 object-cover bg-gray-800"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/40?text=?"; // Logo yüklenmezse placeholder
        }}
      />
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-gray-700">
        {p.provider_name}
      </span>
    </div>
  );

  return (
    <div className="space-y-5 bg-gray-900/60 p-4 rounded-xl border border-gray-700/50">
      {providers.flatrate.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-[0.15em] border-l-2 border-yellow-500 pl-2">
            Abonelik
          </p>
          <div className="flex flex-wrap gap-3">
            {providers.flatrate.map(renderProvider)}
          </div>
        </div>
      )}
      
      {(providers.rent.length > 0 || providers.buy.length > 0) && (
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-black mb-3 tracking-[0.15em] border-l-2 border-blue-500 pl-2">
            Satın Al / Kirala
          </p>
          <div className="flex flex-wrap gap-3">
             {/* Aynı servisler hem rent hem buy'da olabilir, benzersiz id ile map'leyelim */}
            {[...providers.rent, ...providers.buy]
              .filter((v, i, a) => a.findIndex(t => t.provider_id === v.provider_id) === i)
              .map(renderProvider)}
          </div>
        </div>
      )}
    </div>
  );
}