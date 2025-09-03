import React from "react";
import StatusBadge from "../../general-components/badge/statusBadge";
import PriorityBadge from "../../general-components/badge/priorityBadge";
import TypeBadge from "../../general-components/badge/typeBadge";
import UserAvatar from "../../general-components/user/userAvatar";
import { IIssue } from "@libs/types/issue";
interface TaskItemProps {
  issue: IIssue;
  isDragging?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ issue, isDragging }) => {
  if (isDragging) {
    return null;
  }
  return (
    <div
      className={`z-50 mb-1 rounded border border-gray-100 bg-white px-2 py-1 text-sm shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="mb-1 flex items-center justify-between">
        <StatusBadge column={issue.column} />

        <PriorityBadge priority={issue.priority} isShowLabel={false} />
      </div>

      {/* Middle row: Type and Title */}
      <div className="mb-2 flex items-center space-x-2">
        <TypeBadge type={issue.type} isShowLabel={false} />
        <span className="truncate font-medium">{issue.title}</span>
      </div>

      <UserAvatar userId={issue.assignee_id} />
    </div>
  );
};

export default TaskItem;
