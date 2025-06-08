import React from "react";
import { INotification } from "@libs/types/notification";
import { useNotifications } from "@libs/hooks/useNotification";
import { formatDistanceToNow, parseISO } from "date-fns";
import { FaTrash } from "react-icons/fa";
import Button from "../general-components/button";

interface NotificationListProps {
  userId: string;
}

const NotificationList: React.FC<NotificationListProps> = ({ userId }) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications(userId);

  const handleMarkAsRead = async (notification: INotification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  };

  const handleDelete = async (
    event: React.MouseEvent,
    notificationId: string,
  ) => {
    event.stopPropagation();
    await deleteNotification(notificationId);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.warn("Error parsing date:", dateString, error);
      return "Invalid date";
    }
  };

  return (
    <div className="max-h-[500px] w-[400px] overflow-y-auto">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {notifications.some((n) => !n.is_read) && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </Button>
        )}
      </div>
      <div className="divide-y">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group cursor-pointer p-4 hover:bg-gray-50 ${
                !notification.is_read ? "bg-blue-50" : ""
              }`}
              onClick={() => handleMarkAsRead(notification)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{notification.title}</p>
                    {notification.is_read && (
                      <button
                        onClick={(e) => handleDelete(e, notification.id)}
                        className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.content}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;
