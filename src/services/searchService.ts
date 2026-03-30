import api from './api';
import { GlobalSearchResponse, RestResponse } from '../types';

export const searchService = {
  globalSearch: async (query: string, lang: string): Promise<RestResponse<GlobalSearchResponse>> => {
    const response = await api.get<RestResponse<GlobalSearchResponse>>('/search/global', {
      params: { query },
      headers: { 'Accept-Language': lang }
    });
    return response.data;
  }
};