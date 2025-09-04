import React, { useMemo } from "react";
import PriorityBadge from "../../general-components/badge/priorityBadge";
import { IIssue } from "@libs/types/issue";
import { Clock } from "lucide-react";
import { FaCheck } from "react-icons/fa";
interface TaskItemProps {
  issue: IIssue;
  isDragging?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ issue, isDragging }) => {
  if (isDragging) {
    // return null;
  }
  const isOverdue = useMemo(
    () =>
      new Date(issue.due_date_to) < new Date() && issue.column.name !== "DONE",
    [issue],
  );
  return (
    <div
      className={`z-50 flex flex-row items-center gap-2 rounded border border-gray-100 px-2 py-1 text-sm shadow-sm transition-shadow hover:shadow-md ${isOverdue ? "bg-red-50" : "bg-white"} ${isDragging&&"opacity-40"} `}
    >
      <div className="rounded-sm border-1 border-emerald-500 p-0.5">
        <FaCheck className="font-normal text-emerald-500" size={12} />
      </div>
      <span className={`truncate text-sm font-light text-gray-400
        ${issue.column.name === "DONE" ? "line-through" : ""}
        `}>
        {issue.title}
      </span>
      <span className={`truncate text-xs font-medium`}>{issue.summary}</span>
      <PriorityBadge priority={issue.priority} isShowLabel={false} />


      {isOverdue && (
        <div>
          <Clock className="h-4 w-4 text-red-500" />
        </div>
      )}
    </div>
  );
};

export default TaskItem;
