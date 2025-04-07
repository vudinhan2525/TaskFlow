import React from "react";
import { IssueType, IssueStatus, IssuePriority } from "./types";

interface TaskItemProps {
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: {
    initials: string;
    name: string;
  };
}

const TaskItem: React.FC<TaskItemProps> = ({ title, type, status, priority, assignee }) => {
  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-800";
      case "ONGOING":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case "CRITICAL" as IssuePriority:
        return "bg-red-500 text-white";
      case "HIGH" as IssuePriority:
        return "bg-orange-500 text-white";
      case "MEDIUM" as IssuePriority:
        return "bg-yellow-500 text-white";
      case "LOW" as IssuePriority:
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTypeIcon = (type: IssueType) => {
    switch (type) {
      case "BUG":
        return "🐛";
      case "STORY":
        return "📖";
      case "EPIC":
        return "🚀";
      default:
        return "📋";
    }
  };

  return (
    <div className="px-2 py-1 mb-1 text-sm bg-white rounded shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Top row: Priority and Status */}
      <div className="flex items-center justify-between mb-1">
        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(status)}`}>{status}</span>
        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getPriorityColor(priority)}`}>{priority}</span>
      </div>

      {/* Middle row: Type and Title */}
      <div className="flex items-center space-x-2 mb-2">
        <span>{getTypeIcon(type)}</span>
        <span className="truncate font-medium">{title}</span>
      </div>

      {/* Bottom row: Assignee */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500 text-white text-xs">
            {assignee.initials}
          </span>
          <span className="text-xs text-gray-600">{assignee.name}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
