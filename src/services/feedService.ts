import { RestResponse, ActivityResponse, PageResponse } from "@/types";
import api from "./api";

export const feedService = {
  getFollowedFeed: async (
    page = 0,
    size = 10,
  ): Promise<RestResponse<PageResponse<ActivityResponse>>> => {
    // API isteği: /api/feed?page=0&size=10
    const response = await api.get<
      RestResponse<PageResponse<ActivityResponse>>
    >(
      `/feed`,
      { params: { page, size } }, // Query params olarak göndermek daha temizmis
    );
    return response.data;
  },
};
