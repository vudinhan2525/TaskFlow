import React from "react";
import { LuBell } from "react-icons/lu";
import {
  getNotificationIcon,
  getNotificationTypeLabel,
  renderNotificationCard,
} from "@libs/app/components/notifications/notificationCard";
import { useNotificationContext } from "@libs/app/context/notification.context";

const NotificationList: React.FC = () => {
  const { notifications, unreadCount } = useNotificationContext();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 60) {
        return diffInMinutes <= 1 ? "just now" : `${diffInMinutes} minutes ago`;
      } else if (diffInHours < 24) {
        return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
      } else if (diffInDays < 7) {
        return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.warn("Error parsing date:", dateString, error);
      return "Invalid date";
    }
  };

  return (
    <div className="m-[-8px] max-h-[600px] w-[450px] rounded-lg border border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <LuBell className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <div
            onClick={() => {}}
            className="cursor-pointer text-gray-600 hover:text-gray-700"
          >
            Mark all as read
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <LuBell className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                  !notification.is_read
                    ? "border-l-4 border-l-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => {}}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wide text-gray-800 uppercase">
                        {getNotificationTypeLabel(notification.type)}
                      </span>
                    </div>

                    <div
                      className={`mb-2 text-sm ${!notification.is_read ? "font-medium" : ""}`}
                    >
                      {renderNotificationCard(notification)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.created_at)}
                      </span>
                      {!notification.is_read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 p-3"></div>
      )}
    </div>
  );
};

export default NotificationList;
