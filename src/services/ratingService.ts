import api from "./api";
import { RatingRequest, RatingResponse, RestResponse } from "@/types";

export const ratingService = {
  rateMovie: async (
    request: RatingRequest,
  ): Promise<RestResponse<RatingResponse>> => {
    const response = await api.post<RestResponse<RatingResponse>>(
      "/ratings",
      request,
    );
    return response.data;
  },

  getMyRatings: async (): Promise<RestResponse<RatingResponse[]>> => {
    const response =
      await api.get<RestResponse<RatingResponse[]>>("/ratings/me");
    return response.data;
  },
  deleteRating: async (movieId: string): Promise<RestResponse<void>> => {
    const response = await api.delete<RestResponse<void>>(
      `/ratings/${movieId}`,
    );
    return response.data;
  },
};
