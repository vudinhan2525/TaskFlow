import React, { JSX, useEffect } from "react";
import { INotification, NotificationType } from "@libs/types/notification";
import { useNotifications } from "@libs/hooks/useNotification";
import {
  LuBell,
  LuCalendar,
  LuFolderOpen,
  LuGroup,
  LuMessageCircle,
  LuRocket,
  LuSettings,
  LuTrash2,
  LuUser,
} from "react-icons/lu";
import { TbAlertTriangle } from "react-icons/tb";
import { socket } from "@libs/apis/notiApi";

interface NotificationListProps {
  userId: string;
}
const NotificationList: React.FC<NotificationListProps> = (
  props: NotificationListProps,
) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications(props.userId);

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

  const getNotificationIcon = (type: NotificationType) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case NotificationType.ASSIGNMENT:
        return <LuUser {...iconProps} className="h-4 w-4 text-blue-500" />;
      case NotificationType.MENTION:
        return <LuBell {...iconProps} className="h-4 w-4 text-purple-500" />;
      case NotificationType.COMMENT:
        return (
          <LuMessageCircle {...iconProps} className="h-4 w-4 text-green-500" />
        );
      case NotificationType.STATUS_UPDATE:
        return (
          <TbAlertTriangle {...iconProps} className="h-4 w-4 text-yellow-500" />
        );
      case NotificationType.DUE_DATE_REMINDER:
        return <LuCalendar {...iconProps} className="h-4 w-4 text-red-500" />;
      case NotificationType.PROJECT_INVITATION:
        return (
          <LuFolderOpen {...iconProps} className="h-4 w-4 text-indigo-500" />
        );
      case NotificationType.SPRINT_STARTED:
        return <LuRocket {...iconProps} className="h-4 w-4 text-orange-500" />;
      case NotificationType.PROJECT_ADDED:
      case NotificationType.PROJECT_TEAM_ADDED:
        return <LuGroup {...iconProps} className="h-4 w-4 text-teal-500" />;
      case NotificationType.SYSTEM_ALERT:
        return <LuSettings {...iconProps} className="h-4 w-4 text-gray-500" />;
      default:
        return <LuBell {...iconProps} className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationTypeLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ASSIGNMENT:
        return "Assignment";
      case NotificationType.MENTION:
        return "Mention";
      case NotificationType.COMMENT:
        return "Comment";
      case NotificationType.STATUS_UPDATE:
        return "Status Update";
      case NotificationType.DUE_DATE_REMINDER:
        return "Due Date";
      case NotificationType.PROJECT_INVITATION:
        return "Project Invitation";
      case NotificationType.SPRINT_STARTED:
        return "Sprint Started";
      case NotificationType.PROJECT_ADDED:
        return "Project Added";
      case NotificationType.PROJECT_TEAM_ADDED:
        return "Team Added";
      case NotificationType.SYSTEM_ALERT:
        return "System Alert";
      default:
        return "Notification";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseReferenceData = (referenceData: string): any => {
    try {
      return JSON.parse(referenceData || "{}");
    } catch (error) {
      console.warn("Error parsing reference data:", referenceData, error);
      return {};
    }
  };

  const renderDynamicContent = (notification: INotification): JSX.Element => {
    const refData = parseReferenceData(notification.reference_data);
    const { type } = notification;

    switch (type) {
      case NotificationType.ASSIGNMENT:
        return (
          <div>
            <span className="font-medium text-blue-600">
              {notification.actor?.first_name +
                " " +
                notification.actor?.last_name || "Someone"}
            </span>
            {" assigned you to "}
            <span className="font-medium text-blue-600">
              {refData.title || notification.reference_id}
            </span>
          </div>
        );

      case NotificationType.MENTION:
        return (
          <div>
            <span className="font-medium text-purple-600">
              {refData.actorName || "Someone"}
            </span>
            {" mentioned you in "}
            <span className="font-medium text-gray-900">
              {refData.issueKey || notification.reference_id}
            </span>
            {refData.commentText && (
              <div className="mt-1 text-sm text-gray-600 italic">
                "
                {refData.commentText.length > 100
                  ? refData.commentText.substring(0, 100) + "..."
                  : refData.commentText}
                "
              </div>
            )}
          </div>
        );

      case NotificationType.COMMENT:
        return (
          <div>
            <span className="font-medium text-green-600">
              {refData.actorName || "Someone"}
            </span>
            {" commented on "}
            <span className="font-medium text-gray-900">
              {refData.issueKey || notification.reference_id}
            </span>
            {refData.commentText && (
              <div className="mt-1 text-sm text-gray-600 italic">
                "
                {refData.commentText.length > 100
                  ? refData.commentText.substring(0, 100) + "..."
                  : refData.commentText}
                "
              </div>
            )}
          </div>
        );

      case NotificationType.STATUS_UPDATE:
        return (
          <div>
            <span className="font-medium text-yellow-600">
              {refData.actorName || "Someone"}
            </span>
            {" moved "}
            <span className="font-medium text-gray-900">
              {refData.issueKey || notification.reference_id}
            </span>
            {" from "}
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
              {refData.oldStatus || "Unknown"}
            </span>
            {" to "}
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {refData.newStatus || "Unknown"}
            </span>
          </div>
        );

      case NotificationType.DUE_DATE_REMINDER: {
        const dueDate = refData.dueDate ? new Date(refData.dueDate) : null;
        const isOverdue = dueDate && dueDate < new Date();
        return (
          <div>
            <span className="font-medium text-red-600">
              {refData.issueKey || notification.reference_id}
            </span>
            {isOverdue ? " is overdue!" : " is due soon"}
            {dueDate && (
              <div className="mt-1 text-sm text-gray-600">
                Due: {dueDate.toLocaleDateString()}
              </div>
            )}
            {refData.issueTitle && (
              <div className="text-sm text-gray-600">
                "{refData.issueTitle}"
              </div>
            )}
          </div>
        );
      }
      case NotificationType.PROJECT_INVITATION:
        return (
          <div>
            <span className="font-medium text-indigo-600">
              {refData.actorName || "Someone"}
            </span>
            {" invited you to join "}
            <span className="font-medium text-gray-900">
              {refData.projectName || "a project"}
            </span>
            {refData.role && (
              <div className="mt-1 text-sm text-gray-600">
                Role: <span className="font-medium">{refData.role}</span>
              </div>
            )}
          </div>
        );
      case NotificationType.REACTION:
        return (
          <div>
            <span className="font-medium text-pink-600">
              {refData.actorName || "Someone"}
            </span>
            {" reacted "}
            <span className="text-lg">{refData.reaction || "👍"}</span>
            {" to your comment on "}
            <span className="font-medium text-gray-900">
              {refData.issueKey || notification.reference_id}
            </span>
          </div>
        );
      case NotificationType.SPRINT_STARTED:
        return (
          <div>
            <span className="font-medium text-orange-600">Sprint started:</span>{" "}
            <span className="font-medium text-gray-900">
              {refData.sprintName || "Sprint"}
            </span>
            {refData.projectName && (
              <div className="mt-1 text-sm text-gray-600">
                Project: {refData.projectName}
              </div>
            )}
          </div>
        );
      case NotificationType.PROJECT_ADDED:
        return (
          <div>
            <span className="font-medium text-teal-600">
              {refData.actorName || "Someone"}
            </span>
            {" added you to "}
            <span className="font-medium text-gray-900">
              {refData.projectName || "a project"}
            </span>
            {refData.role && (
              <div className="mt-1 text-sm text-gray-600">
                Role: <span className="font-medium">{refData.role}</span>
              </div>
            )}
          </div>
        );

      case NotificationType.PROJECT_TEAM_ADDED:
        return (
          <div>
            <span className="font-medium text-teal-600">
              {refData.actorName || "Someone"}
            </span>
            {" added you to the team of "}
            <span className="font-medium text-gray-900">
              {refData.projectName || "a project"}
            </span>
          </div>
        );

      case NotificationType.SYSTEM_ALERT:
        return (
          <div>
            <span className="font-medium text-gray-600">System Alert:</span>{" "}
            <span className="text-gray-900">
              {refData.message || notification.content}
            </span>
            {refData.severity && (
              <div
                className={`mt-1 text-sm font-medium ${
                  refData.severity === "high"
                    ? "text-red-600"
                    : refData.severity === "medium"
                      ? "text-yellow-600"
                      : "text-blue-600"
                }`}
              >
                Severity: {refData.severity.toUpperCase()}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div>
            <span className="text-gray-900">{notification.content}</span>
          </div>
        );
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join", { userId: "123" });
    });

    socket.on("new-notification", () => {
      console.log("Received new-notification!");
      // trigger refresh logic here
    });

    return () => {
      socket.off("connect");
      socket.off("new-notification");
    };
  }, []);
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
            onClick={() => markAllAsRead()}
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
                onClick={() => handleMarkAsRead(notification)}
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
                      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="p-1 text-gray-400 transition-colors hover:text-red-500"
                          title="Delete notification"
                        >
                          <LuTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div
                      className={`mb-2 text-sm ${!notification.is_read ? "font-medium" : ""}`}
                    >
                      {renderDynamicContent(notification)}
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
