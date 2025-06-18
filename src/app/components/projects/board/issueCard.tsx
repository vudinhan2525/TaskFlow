import { IIssue, IssuePriority } from "@libs/types/issue";
import { useState } from "react";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const PriorityBadge = ({ priority }: { priority: IssuePriority }) => {
  const getPriorityIcon = (priority: string) => {
    const issuePriority = priorityOptions.find(
      (option) => option.name === priority,
    );
    return issuePriority?.icon;
  };

  return (
    <span className="flex items-center gap-2 rounded-md p-2">
      {getPriorityIcon(priority)}
      <span className="text-sm">{priority}</span>
    </span>
  );
};

import { typeOptions, priorityOptions } from "../../../../constants/list";

const TypeBadge = ({ type }: { type: IIssue["type"] }) => {
  const getIssueTypeIcon = (type: string) => {
    const issueType = typeOptions.find((option) => option.name === type);
    return issueType?.icon;
  };

  return (
    <span className="mr-1 text-sm" title={type}>
      {getIssueTypeIcon(type)}
    </span>
  );
};

const IssueCard = ({
  issue,
  isDragging,
}: {
  issue: IIssue;
  isDragging?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isChildIssue = !!issue.parent_id;
  const titleClasses = `font-medium mb-2 line-clamp-2 text-sm`;
  if (isChildIssue) return <></>;
  return (
    <div
      className={`mb-2 cursor-pointer rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md ${isDragging ? "opacity-40" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with issue key and menu */}
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <TypeBadge type={issue.type} />
          <span>{issue.id.toUpperCase()}</span>
        </div>
        {isHovered && (
          <div className="text-gray-400 hover:text-gray-600">
            <span className="px-1">⋮</span>
          </div>
        )}
      </div>

      {/* Issue title */}
      <h3 className={titleClasses}>{issue.title}</h3>

      {/* Issue metadata */}
      <div className="mb-2 flex flex-wrap gap-2">
        <PriorityBadge priority={issue.priority} />
        {issue.story_point > 0 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
            {issue.story_point} {issue.story_point === 1 ? "point" : "points"}
          </span>
        )}
      </div>

      {/* Footer with assignee and date */}
      <div
        className={`mt-3 flex items-center justify-between text-xs text-gray-500`}
      >
        <div className="flex items-center">
          <div
            className={`mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs uppercase`}
          >
            {issue.assignee_id.charAt(0)}
          </div>
          <span className="max-w-[100px] truncate">{issue.assignee_id}</span>
        </div>
        <span title={issue.updated_at}>
          Updated {formatDate(issue.updated_at)}
        </span>
      </div>

      {/* Attachments indicator */}
      {issue.attachments.length > 0 && (
        <div className={`mt-2 text-xs text-gray-500`}>
          <span className="flex items-center">
            <span className="mr-1">📎</span>
            {issue.attachments.length}
          </span>
        </div>
      )}
    </div>
  );
};
export default IssueCard;
