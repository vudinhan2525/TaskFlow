import api, { ResponseApi } from "@libs/apis/api";
import { INotification } from "@libs/types/notification";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

export const notifications = {
  list: () => api.get<ResponseApi<INotification[]>>(`/notifications`, config),

  markAsRead: (notificationId: string) =>
    api.put<ResponseApi<INotification>>(
      `/notifications/${notificationId}/read`,
      {},
      config,
    ),

  markAllAsRead: () =>
    api.put<ResponseApi<void>>(`/notifications/read-all`, {}, config),

  getUnreadCount: () =>
    api.get<ResponseApi<{ count: number }>>(
      `/notifications/unread-count`,
      config,
    ),

  delete: (notificationId: string) =>
    api.delete<ResponseApi<void>>(`/notifications/${notificationId}`, config),
};
