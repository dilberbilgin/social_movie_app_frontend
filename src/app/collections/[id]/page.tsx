// src/app/collections/[id]/page.tsx
"use client";
import { use, useEffect, useState } from "react";
import { movieCollectionService } from "@/services/movieCollectionService";
import { MovieCollectionResponse } from "@/types";
import MovieCard from "@/components/movie/MovieCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CollectionDetailPage({ params }: PageProps) {

    const unwrappedParams = use(params);
  const collectionId = unwrappedParams.id;
  const [collection, setCollection] = useState<MovieCollectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
//         const res = await movieCollectionService.getCollectionDetail(params.id, 'en');
//         if (res.success) setCollection(res.data);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetail();
//   }, [params.id]);
const res = await movieCollectionService.getCollectionDetail(collectionId, 'en');
        if (res.success) setCollection(res.data);
      } catch (error) {
        console.error("Collection load error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (collectionId) {
      fetchDetail();
    }
  }, [collectionId]);

  if (loading) return <div className="h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!collection) return <div className="p-20 text-center">Collection not found.</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Kısmı */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-gray-500">
                {collection.name}
              </h1>
              <p className="text-gray-400 mt-2 max-w-2xl">{collection.description || "No description provided."}</p>
            </div>
            <div className="bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700 text-sm font-medium">
              {collection.movieCount} Movies • Created by <span className="text-yellow-500">@{collection.ownerUsername}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Film Listesi Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {collection.movies && collection.movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {collection.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-dashed border-gray-800">
            <p className="text-gray-500 text-lg">This collection is empty yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}