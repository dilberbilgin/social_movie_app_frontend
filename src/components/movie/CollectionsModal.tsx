"use client";
import { useCollections } from "@/hooks/useCollections";
import { CollectionItem } from "./CollectionItem";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useState } from "react";
import { movieCollectionService } from "@/services/movieCollectionService";

export const CollectionsModal = ({ tmdbId, onClose }: { tmdbId: number; onClose: () => void }) => {
  const { collections, loading, addToCollection, refresh } = useCollections(tmdbId);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = async () => {
    if (!newName) return;
    const res = await movieCollectionService.createCollection({ name: newName, isPublic: true });
    if (res.success) {
      setNewName("");
      setShowCreate(false);
      refresh(); // Listeyi yenile
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Save to Collection</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2 custom-scrollbar">
          {loading ? <LoadingSpinner /> : (
            collections.map(col => (
              <CollectionItem 
              key={col.id} 
              collection={col} 
              onAction={addToCollection}
              mode="select" />
            ))
          )}
        </div>

        <div className="p-6 bg-gray-950/50 border-t border-gray-800">
          {!showCreate ? (
            <button 
              onClick={() => setShowCreate(true)}
              className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-all"
            >
              + Create New Collection
            </button>
          ) : (
            <div className="flex gap-2">
              <input 
                autoFocus
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-yellow-500"
                placeholder="Collection name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleCreate} className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-sm">Create</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};