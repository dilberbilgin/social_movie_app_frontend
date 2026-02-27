import { Genre, RestResponse } from "@/types";
import api from "./api";

export const genreService = {
  getAllGenres: async (): Promise<RestResponse<Genre[]>> => {
    const response = await api.get<RestResponse<Genre[]>>('/genres');
    return response.data;
  },
};