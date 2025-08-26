import { INotification, NotificationType } from "@libs/types/notification";
import { JSX } from "react";
import {
  LuBell,
  LuCalendar,
  LuFolderOpen,
  LuGroup,
  LuMessageCircle,
  LuRocket,
  LuSettings,
  LuUser,
} from "react-icons/lu";
import { TbAlertTriangle } from "react-icons/tb";
const renderNotificationCard = (notification: INotification): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refData = notification.reference_data as any;
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
            <div className="text-sm text-gray-600">"{refData.issueTitle}"</div>
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
export {
  renderNotificationCard,
  getNotificationIcon,
  getNotificationTypeLabel,
};
