import api from './api';
import { LoginRequest, UserRegistrationRequest, JwtResponse, UserResponse, RestResponse } from '@/types';

export const authService = {
  // Giriş yapma fonksiyonu
  login: async (request: LoginRequest): Promise<RestResponse<JwtResponse>> => {
    const response = await api.post<RestResponse<JwtResponse>>('/auth/login', request);
    if (response.data.success) {
      // Başarılıysa token'ı tarayıcıya kaydet
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('username', response.data.data.username);
    }
    return response.data;
  },

  // Kayıt olma fonksiyonu
  signup: async (request: UserRegistrationRequest): Promise<RestResponse<UserResponse>> => {
    const response = await api.post<RestResponse<UserResponse>>('/auth/signup', request);
    return response.data;
  },

  // Çıkış yapma
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  }
};