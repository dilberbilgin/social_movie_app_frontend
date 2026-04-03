import { useState, useEffect } from 'react';
import { movieCollectionService } from '@/services/movieCollectionService';
import { MovieCollectionResponse } from '@/types';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/context/LanguageContext';

export const useCollections = (tmdbId: number) => {
  const [collections, setCollections] = useState<MovieCollectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useTranslation();

  const fetchCollections = async () => {
    setLoading(true);
    const res = await movieCollectionService.getMyCollections();
    if (res.success) setCollections(res.data);
    setLoading(false);
  };

  // const addToCollection = async (collectionId: string) => {
  //   try {
  //     const res = await movieCollectionService.addMovieToCollection(collectionId, tmdbId, lang);
  //     if (res.success) {
  //       toast.success(res.message);
  //       // İsteğe bağlı: Koleksiyondaki film sayısını yerelde güncelle
  //     }
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.message || "Error");
  //   }
  // };

  const addToCollection = async (collectionId: string) => {
    try {
      const res = await movieCollectionService.addMovieToCollection(collectionId, tmdbId, lang);
      if (res.success) {
        toast.success(res.message);
        await fetchCollections(); // KRİTİK: Listeyi yenile ki sayı güncellensin
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error");
    }
};

  useEffect(() => {
    fetchCollections();
  }, []);

  return { collections, loading, addToCollection, refresh: fetchCollections };
};