import { RestResponse, UserResponse } from "@/types";
import api from "./api";

export const followService = {
  follow: async (followingId: string): Promise<RestResponse<void>> => {
    // Backend FollowRequest { followingId: UUID } bekliyor
    const response = await api.post<RestResponse<void>>("/follows/follow", {
      followingId,
    });
    return response.data;
  },
  unfollow: async (followingId: string): Promise<RestResponse<void>> => {
    // Unfollow için de aynı FollowRequest formatını gönderiyoruz
    const response = await api.post<RestResponse<void>>("/follows/unfollow", {
      followingId,
    });
    return response.data;
  },
  getFollowers: async (
    userId: string,
  ): Promise<RestResponse<UserResponse[]>> => {
    const response = await api.get<RestResponse<UserResponse[]>>(
      `/follows/${userId}/followers`,
    );
    return response.data;
  },
  getFollowing: async (
    userId: string,
  ): Promise<RestResponse<UserResponse[]>> => {
    const response = await api.get<RestResponse<UserResponse[]>>(
      `/follows/${userId}/following`,
    );
    return response.data;
  },
};
