import { IIssue } from "@libs/types/issue";
import { useState } from "react";
import PriorityBadge from "../../general-components/badge/priorityBadge";
import TypeBadge from "../../general-components/badge/typeBadge";
import UserAvatar from "../../general-components/user/userAvatar";
import { FaBars } from "react-icons/fa";
import { useIssueStore } from "@libs/store/useIssueStore";

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
  // const { toggleSideBarDetailIssue } = useIssueDetailContext();
  const { openIssueDetail } = useIssueStore();
  const isChildIssue = !!issue.parent_id;
  if (isChildIssue) return <></>;
  if (isDragging) {
    return (
      <div className="z-50 min-h-32 w-full truncate rounded-md border-2 border-dashed border-gray-300 bg-gray-200"></div>
    );
  }
  return (
    <div
      className={`     cursor-pointer rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md ${isDragging ? "opacity-40" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with issue key and menu */}
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <TypeBadge type={issue.type} isShowLabel={false} />
          <span className="">{issue.title}</span>
        </div>
        {isHovered && (
          <div
            onClick={() => {
              openIssueDetail(issue.id);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaBars />
          </div>
        )}
      </div>

      {/* Issue title */}
      <h3 className={`mb-2 line-clamp-2 text-sm font-medium`}>
        {issue.summary}
      </h3>

      {/* Issue metadata */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={issue.priority} isShowLabel={false} />
        {issue.story_point > 0 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
            {issue.story_point} {issue.story_point === 1 ? "point" : "points"}
          </span>
        )}

        {/* Attachments indicator */}
        {issue.attachments.length > 0 && (
          <div className={`text-xs text-gray-500`}>
            <span className="flex items-center">
              <span className="mr-1">📎</span>
              {issue.attachments.length}
            </span>
          </div>
        )}
      </div>

      {/* Footer with assignee and date */}
      <div
        className={`mt-3 flex items-center justify-between text-xs text-gray-500`}
      >
        <UserAvatar userId={issue.assignee_id} />
        <span title={issue.created_at}>
          Created {formatDate(issue.created_at)}
        </span>
      </div>
    </div>
  );
};
export default IssueCard;
