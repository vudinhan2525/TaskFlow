import { useQuery } from "@tanstack/react-query";
import { INotification } from "@libs/types/notification";
import { notifications } from "@libs/apis/notification";

export const useNotifications = (userId: string) => {
  const { data: notificationsData = [], refetch } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const response = await notifications.list();
      return response.data.data as INotification[];
    },
    enabled: !!userId,
  });

  const markAsRead = async (notificationId: string) => {
    await notifications.markAsRead(notificationId);
    refetch();
  };

  const markAllAsRead = async () => {
    await notifications.markAllAsRead();
    refetch();
  };

  const deleteNotification = async (notificationId: string) => {
    await notifications.delete(notificationId);
    refetch();
  };

  const unreadCount = notificationsData.filter((n) => !n.is_read).length;

  return {
    notifications: notificationsData,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  };
};
