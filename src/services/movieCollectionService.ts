import api from "./api";
import {
  MovieCollectionRequest,
  MovieCollectionResponse,
  RestResponse,
} from "@/types";

export const movieCollectionService = {
  getMyCollections: async (): Promise<
    RestResponse<MovieCollectionResponse[]>
  > => {
    const response = await api.get<RestResponse<MovieCollectionResponse[]>>(
      "/collections/my-collections",
    );
    return response.data;
  },

  getUserCollections: async (
    username: string,
  ): Promise<RestResponse<MovieCollectionResponse[]>> => {
    const response = await api.get<RestResponse<MovieCollectionResponse[]>>(
      `/collections/user/${username}`,
    );
    return response.data;
  },

  createCollection: async (
    data: MovieCollectionRequest,
  ): Promise<RestResponse<MovieCollectionResponse>> => {
    const response = await api.post<RestResponse<MovieCollectionResponse>>(
      "/collections",
      data,
    );
    return response.data;
  },

  // lang parametresini ekledik
  addMovieToCollection: async (
    collectionId: string,
    tmdbId: number,
    lang: string,
  ): Promise<RestResponse<void>> => {
    const response = await api.post<RestResponse<void>>(
      `/collections/${collectionId}/movies/${tmdbId}`,
      null,
      {
        params: { lang }, 
      },
    );
    return response.data;
  },

  getCollectionDetail: async (
    id: string,
    lang: string,
  ): Promise<RestResponse<MovieCollectionResponse>> => {
    const response = await api.get<RestResponse<MovieCollectionResponse>>(
      `/collections/${id}`,
      {
        params: { lang },
      },
    );
    return response.data;
  },
};
