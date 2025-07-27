import { connectSocket } from "@libs/apis/notiApi";
import { useAuth } from "@libs/hooks/useAuth";
import { INotification } from "@libs/types/notification";
import React, { createContext, useContext, useEffect, useState } from "react";

interface NotificationContextType {
  notifications: INotification[];
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
  unreadCount: number;
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
  useEffect(() => {
    if (user?.data.id) {
      const socket = connectSocket(user?.data.id);

      socket.on("refresh-list", (data) => {
        const notis: INotification[] = data?.notifications || [];

        setNotifications(notis);

        const unreadCount = notis.filter((n) => !n?.is_read).length;

        setUnReadCount(unreadCount);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user?.data.id]);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
