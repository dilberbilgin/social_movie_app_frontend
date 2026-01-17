import api from './api';
import { CommentRequest, CommentResponse, RestResponse } from '@/types';

export const commentService = {
  addComment: async (request: CommentRequest): Promise<RestResponse<CommentResponse>> => {
    const response = await api.post<RestResponse<CommentResponse>>('/comments', request);
    return response.data;
  },
  
  deleteComment: async (id: string): Promise<RestResponse<void>> => {
    const response = await api.delete<RestResponse<void>>(`/comments/${id}`);
    return response.data;
  }
};