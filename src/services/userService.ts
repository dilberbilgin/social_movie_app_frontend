import api from "./api";
import {
  PageResponse,
  ProfileResponse,
  RestResponse,
  UserProfileUpdateRequest,
  UserResponse,
} from "@/types";

export const userService = {
  getUserProfile: async (
    username: string,
    lang: string,
  ): Promise<RestResponse<ProfileResponse>> => {
    const response = await api.get<RestResponse<ProfileResponse>>(
      `/users/profile/${username}`,
      { params: { lang } },
    );
    return response.data;
  },

  updateProfile: async (
    username: string,
    data: UserProfileUpdateRequest,
  ): Promise<RestResponse<UserResponse>> => {
    const response = await api.put<RestResponse<UserResponse>>(
      `/users/profile/${username}`,
      data,
    );
    return response.data;
  },

  searchUsers: async (
    query: string,
    lang: string,
    page: number = 0,
    size: number = 10,
  ): Promise<RestResponse<PageResponse<UserResponse>>> => {
    const response = await api.get<RestResponse<PageResponse<UserResponse>>>(
      `/users/search`,
      {
        params: {
          query,
          lang,
          page,
          size,
        },
      },
    );
    return response.data;
  },

  getSuggestedUsers: async (
    limit: number = 5,
  ): Promise<RestResponse<UserResponse[]>> => {
    const response = await api.get<RestResponse<UserResponse[]>>(
      `/users/suggestions`,
      { params: { limit } },
    );
    return response.data;
  },
};
