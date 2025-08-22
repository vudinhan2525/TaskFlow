import { IIssue } from "@libs/types/issue";
import { useState } from "react";
import PriorityBadge from "../../general-components/badge/priorityBadge";
import TypeBadge from "../../general-components/badge/typeBadge";
import UserAvatar from "../../general-components/user/UserAvatar";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
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
  if (isDragging) {
    return (
      <div className="h-[120px] w-full border-2 border-gray-300 z-50 
      border-dashed rounded-md"></div>
    );
  }
  return (
    <div
      className={`mb-2 cursor-pointer rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md ${isDragging ? "opacity-40" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with issue key and menu */}
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <TypeBadge type={issue.type} isShowLabel={false} />
          <span className="ml-2">{issue.id.toUpperCase()}</span>
        </div>
        {isHovered && (
          <div className="text-gray-400 hover:text-gray-600">
            <span className="px-1">⋮</span>
          </div>
        )}
      </div>

      {/* Issue title */}
      <h3 className={titleClasses}>{issue.title}</h3>

      {/* Footer with assignee and date */}
      <div
        className={`mt-3 flex items-center justify-between text-xs text-gray-500`}
      >
        <span title={issue.updated_at}>
          Updated {formatDate(issue.updated_at)}
        </span>
        <div className="flex flex-row gap-1">
          {issue.story_point > 0 && (
            <span className="flex items-center rounded-sm bg-gray-100 px-2 text-center text-xs text-gray-700">
              {issue.story_point}
            </span>
          )}
          <PriorityBadge priority={issue.priority} />
          <UserAvatar userId={issue.assignee_id} isDisplayName={false} />
        </div>
      </div>
    </div>
  );
};
export default IssueCard;
