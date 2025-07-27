import React from "react";
import { FaBell } from "react-icons/fa";
import { Popover } from "antd";
import NotificationList from "./notificationList";
import { useNotificationContext } from "@libs/app/context/notification.context";

const NotificationsPopover: React.FC = () => {
  const { unreadCount } = useNotificationContext();

  return (
    <Popover content={<NotificationList />} trigger="click" placement="bottom">
      <div className="relative cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100">
        <FaBell />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 shadow-sm">
            <span className="text-xs font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </div>
        )}
      </div>
    </Popover>
  );
};

export default NotificationsPopover;
