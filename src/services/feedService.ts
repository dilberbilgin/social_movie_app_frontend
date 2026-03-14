import { RestResponse, ActivityResponse } from "@/types";
import api from "./api";

// Backend Page<T> döndüğü için Page yapısını da karşılamalıyız
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const feedService = {
  getFollowedFeed: async (page = 0, size = 10): Promise<RestResponse<PageResponse<ActivityResponse>>> => {
    const response = await api.get<RestResponse<PageResponse<ActivityResponse>>>(
      `/feed?page=${page}&size=${size}`
    );
    return response.data;
  },
};