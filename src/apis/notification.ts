import { ResponseApi } from "@libs/apis/api";
import notiApi from "@libs/apis/notiApi";
import { INotification } from "@libs/types/notification";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

export const notifications = {
  list: (userId: string) =>
    notiApi.post<ResponseApi<INotification[]>>(
      `/notifications/get-all`,
      { user_id: userId },
      config,
    ),

  markAsRead: (notificationId: string) =>
    notiApi.put<ResponseApi<INotification>>(
      `/notifications/${notificationId}/read`,
      {},
      config,
    ),

  markAllAsRead: () =>
    notiApi.put<ResponseApi<void>>(`/notifications/read-all`, {}, config),

  getUnreadCount: () =>
    notiApi.get<ResponseApi<{ count: number }>>(
      `/notifications/unread-count`,
      config,
    ),

  delete: (notificationId: string) =>
    notiApi.delete<ResponseApi<void>>(
      `/notifications/${notificationId}`,
      config,
    ),
};
