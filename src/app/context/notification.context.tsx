import { connectSocket } from "@libs/apis/notiApi";
import { notificationApi } from "@libs/apis/notification";
import { useAuth } from "@libs/hooks/useAuth";
import { INotification } from "@libs/types/notification";
import _ from "lodash";
import React, { createContext, useContext, useEffect, useState } from "react";

interface NotificationContextType {
  notifications: INotification[];
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAsReadAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("NotificationContext is not available");
  return ctx;
};

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnReadCount] = useState(0);
  const { user } = useAuth();
  const markAsRead = async (notiId: string) => {
    setNotifications((notis) =>
      notis.map((el) => (el.id === notiId ? { ...el, is_read: true } : el)),
    );

    await notificationApi.update(notiId, { isRead: true });
  };
  const markAsReadAll = async () => {
    if (!user?.data.id) return;
    setNotifications((notis) => notis.map((el) => ({ ...el, is_read: true })));
    await notificationApi.updateAll({ userId: user?.data.id, isRead: true });
  };

  useEffect(() => {
    const userId = _.get(user,'data.id');
    if (userId) {
      const socket = connectSocket(userId);

      socket.on("refresh-list", (data) => {
        const notis: INotification[] = data?.notifications || [];
        setNotifications(notis);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n?.is_read).length;
    setUnReadCount(unreadCount);
  }, [notifications]);
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
        markAsRead,
        markAsReadAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
