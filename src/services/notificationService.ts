import api from "./api";
import { NotificationResponse, RestResponse } from "@/types";

export const notificationService = {
  getNotifications: async (): Promise<RestResponse<NotificationResponse[]>> => {
    const response =
      await api.get<RestResponse<NotificationResponse[]>>("/notifications");
    return response.data;
  },

  markAsRead: async (id: string): Promise<RestResponse<void>> => {
    const response = await api.patch<RestResponse<void>>(
      `/notifications/${id}/read`,
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<RestResponse<void>> => {
    const response = await api.patch<RestResponse<void>>(
      "/notifications/read-all",
    );
    return response.data;
  },
};
