import React from "react";
import { FaBell } from "react-icons/fa";
import { Popover } from "antd";
import NotificationList from "./notificationList";
import { useNotifications } from "@libs/hooks/useNotification";

interface NotificationsPopoverProps {
  userId: string;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  userId,
}) => {
  const { unreadCount } = useNotifications(userId);

  return (
    <Popover
      content={<NotificationList userId={userId} />}
      trigger="click"
      placement="bottom"
    >
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
