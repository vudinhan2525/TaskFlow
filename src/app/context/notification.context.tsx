import { connectSocket } from "@libs/apis/notiApi";
import { notificationApi } from "@libs/apis/notification";
import { useAuthStore } from "@libs/store/useAuthStore";
import { INotification } from "@libs/types/notification";
import {get} from "lodash";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  const { user } = useAuthStore();
  const markAsRead = async (notiId: string) => {
    setNotifications((notis) =>
      notis.map((el) => (el.id === notiId ? { ...el, is_read: true } : el)),
    );

    await notificationApi.update(notiId, { isRead: true });
  };
  const markAsReadAll = async () => {
    if (!user?.id) return;
    setNotifications((notis) => notis.map((el) => ({ ...el, is_read: true })));
    await notificationApi.updateAll({ userId: user?.id, isRead: true });
  };

  useEffect(() => {
    const userId = get(user,'id');
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


  const unreadCount= useMemo(()=>{
    return notifications.filter((n) => !n?.is_read).length;
  },[notifications])

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
