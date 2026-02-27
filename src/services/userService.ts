import api from './api';
import { PageResponse, ProfileResponse, RestResponse, UserProfileUpdateRequest, UserResponse } from '@/types';

export const userService = {
  // Kullanıcı adıyla profil detaylarını çeker
  getUserProfile: async (username: string, lang:string): Promise<RestResponse<ProfileResponse>> => {
    const response = await api.get<RestResponse<ProfileResponse>>(`/users/profile/${username}`, {params:{lang}});
    return response.data;
  },

  // Kullanıcının kendi bilgilerini günceller (Düzenleme için)
  updateProfile: async(username: string, data: UserProfileUpdateRequest): Promise<RestResponse<UserResponse>> => {
    const response = await api.put<RestResponse<UserResponse>>(`/users/profile/${username}`, data);
    return response.data;
  },

//  searchUsers: async (query: string, lang: string): Promise<RestResponse<UserResponse[]>> => {
//     // Backend'de @RequestParam String query demiştik, o yüzden anahtar 'query' olmalı
//     const response = await api.get<RestResponse<UserResponse[]>>(`/users/search`, { 
//       params: { query, lang } 
//     });
//     return response.data;
//   },

searchUsers: async (query: string, lang: string, page: number = 0, size: number = 10): Promise<RestResponse<PageResponse<UserResponse>>> => {
    const response = await api.get<RestResponse<PageResponse<UserResponse>>>(`/users/search`, { 
      params: { 
        query, 
        lang,
        page, // Backend'deki Pageable bunu otomatik anlar
        size 
      } 
    });
    return response.data;
},

// Dönüş tipini PageResponse olarak güncelledik
  // searchUsers: async (query: string, lang: string): Promise<RestResponse<PageResponse<UserResponse>>> => {
  //   const response = await api.get<RestResponse<PageResponse<UserResponse>>>(`/users/search`, { 
  //     params: { query, lang } 
  //   });
  //   return response.data;
  // },



  getSuggestedUsers: async (limit: number = 5): Promise<RestResponse<UserResponse[]>> => {
  const response = await api.get<RestResponse<UserResponse[]>>(`/users/suggestions`, { params: { limit } });
  return response.data;
}
};

