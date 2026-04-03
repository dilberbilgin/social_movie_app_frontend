// import { MovieCollectionResponse } from "@/types";

// interface CollectionItemProps {
//   collection: MovieCollectionResponse;
//   onAdd: (id: string) => void;
// }

// export const CollectionItem = ({ collection, onAdd }: CollectionItemProps) => (
//   <button
//     onClick={() => onAdd(collection.id)}
//     className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition-colors group border border-transparent hover:border-gray-700"
//   >
//     <div className="flex items-center gap-3">
//       <div className="w-10 h-10 bg-gray-700 rounded-lg overflow-hidden shrink-0">
//         {collection.coverImageUrl ? (
//           <img src={`https://image.tmdb.org/t/p/w200${collection.coverImageUrl}`} className="object-cover w-full h-full" alt="" />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-500">🎬</div>
//         )}
//       </div>
//       <div className="text-left">
//         <p className="text-sm font-medium text-white group-hover:text-yellow-500">{collection.name}</p>
//         <p className="text-xs text-gray-500">{collection.movieCount} movies</p>
//       </div>
//     </div>
//     <span className="text-gray-600 group-hover:text-yellow-500 text-xl">+</span>
//   </button>
// );

// src/components/movie/CollectionItem.tsx
import { MovieCollectionResponse } from "@/types";
import { useRouter } from "next/navigation";

interface CollectionItemProps {
  collection: MovieCollectionResponse;
  onAction?: (id: string) => void; // Ekleme işlemi için
  mode?: "select" | "navigate";   // Mod: Seçme (Modal) veya Sayfaya Gitme (Profil)
}

export const CollectionItem = ({ collection, onAction, mode = "select" }: CollectionItemProps) => {
  const router = useRouter();

  // const handleClick = () => {
  //   if (mode === "navigate") {
  //     router.push(`/collections/${collection.id}`); // Sayfaya yönlendir
  //   } else if (onAction) {
  //     onAction(collection.id); // Filmi ekle
      
  //   }
  // };
  const handleClick = (e: React.MouseEvent) => {
  e.preventDefault(); // Sayfa yenilenmesini engelle
  if (mode === "navigate") {
    router.push(`/collections/${collection.id}`);
  } else if (onAction) {
    onAction(collection.id); // Burası addToCollection'ı tetikler
  }
};

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition-all group border border-transparent hover:border-gray-700 bg-gray-900/50"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden shrink-0 border border-gray-700">
          {collection.coverImageUrl ? (
            <img 
              src={`https://image.tmdb.org/t/p/w200${collection.coverImageUrl}`} 
              className="object-cover w-full h-full" 
              alt={collection.name} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
          )}
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors">
            {collection.name}
          </p>
          <p className="text-xs text-gray-500">{collection.movieCount} movies</p>
        </div>
      </div>
      
      {/* Modlara göre sağdaki ikon değişir */}
      <span className="text-gray-600 group-hover:text-yellow-500 text-xl transition-transform group-hover:scale-125">
        {mode === "select" ? "+" : "→"}
      </span>
    </button>
  );
};