import React, { lazy, useState, useTransition } from "react";
import { FaBell } from "react-icons/fa";
import { Popover } from "antd";

import { useNotificationContext } from "@libs/app/context/notification.context";
const NotificationList = lazy(
  () => import("@libs/app/components/notifications/notificationList"),
);

const NotificationsPopover: React.FC = () => {
  const { unreadCount } = useNotificationContext();
  const [, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      content={<NotificationList />}
      trigger="click"
      open={isOpen}
      onOpenChange={(open) => {
        startTransition(() => {
          setIsOpen(open);
        });
      }}
      placement="bottomRight"
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
