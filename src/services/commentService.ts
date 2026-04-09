import api from "./api";
import {
  CommentRequest,
  CommentResponse,
  PageResponse,
  RestResponse,
} from "@/types";

export const commentService = {
  getMovieComments: async (
    movieId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<RestResponse<PageResponse<CommentResponse>>> => {
    const response = await api.get<RestResponse<PageResponse<CommentResponse>>>(
      `/comments/movie/${movieId}`,
      { params: { page, size } },
    );
    return response.data;
  },

  addComment: async (
    request: CommentRequest,
  ): Promise<RestResponse<CommentResponse>> => {
    const response = await api.post<RestResponse<CommentResponse>>(
      "/comments",
      request,
    );
    return response.data;
  },

  deleteComment: async (id: string): Promise<RestResponse<void>> => {
    const response = await api.delete<RestResponse<void>>(`/comments/${id}`);
    return response.data;
  },

  //   toggleLike: async (id: string): Promise<RestResponse<any>> => { // 'any' yerine varsa ReactionResponse tipini yazabilirsin
  //   const response = await api.post<RestResponse<any>>(`/movies/${id}/like`);
  //   return response.data;
  // },
  //   toggleDislike: async (id: string): Promise<RestResponse<void>> => {
  //     const response = await api.post<RestResponse<void>>(
  //       `/comments/${id}/dislike`,
  //     );
  //     return response.data;
  //   },

  toggleLike: async (commentId: string): Promise<RestResponse<void>> => {
    // Film değil, YORUM beğenisi için endpoint budur:
    const response = await api.post<RestResponse<void>>(
      `/comments/${commentId}/like`,
    );
    return response.data;
  },

  toggleDislike: async (commentId: string): Promise<RestResponse<void>> => {
    const response = await api.post<RestResponse<void>>(
      `/comments/${commentId}/dislike`,
    );
    return response.data;
  },
};
