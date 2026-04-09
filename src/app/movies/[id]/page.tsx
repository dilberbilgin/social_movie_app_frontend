
import MovieDetailContent from "@/components/movie/MovieDetailContent";
import { use } from "react";

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <main className="min-h-screen bg-gray-900 pt-10">
      <MovieDetailContent id={id} />
    </main>
  );
}