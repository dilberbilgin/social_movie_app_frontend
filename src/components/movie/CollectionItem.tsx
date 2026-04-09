import { MovieCollectionResponse } from "@/types";
import { useRouter } from "next/navigation";

interface CollectionItemProps {
  collection: MovieCollectionResponse;
  onAction?: (id: string) => void; // Ekleme işlemi için
  mode?: "select" | "navigate"; // Mod: Seçme (Modal) veya Sayfaya Gitme (Profil)
}

export const CollectionItem = ({
  collection,
  onAction,
  mode = "select",
}: CollectionItemProps) => {
  const router = useRouter();

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
            <div className="w-full h-full flex items-center justify-center text-xl">
              🎬
            </div>
          )}
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors">
            {collection.name}
          </p>
          <p className="text-xs text-gray-500">
            {collection.movieCount} movies
          </p>
        </div>
      </div>

      {/* Modlara göre sağdaki ikon değişir */}
      <span className="text-gray-600 group-hover:text-yellow-500 text-xl transition-transform group-hover:scale-125">
        {mode === "select" ? "+" : "→"}
      </span>
    </button>
  );
};
