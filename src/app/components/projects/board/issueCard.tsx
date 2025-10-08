import { IIssue } from "@libs/types/issue";
import { useState } from "react";
import PriorityBadge from "../../general-components/badge/priorityBadge";
import TypeBadge from "../../general-components/badge/typeBadge";
import UserAvatar from "../../general-components/user/userAvatar";
import { FaBars } from "react-icons/fa";
import { useIssueStore } from "@libs/store/useIssueStore";
import { useFieldVisibility } from "@libs/app/context/board.context";
import { ParentBadge } from "../../general-components/dropdown/parentDropdown";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableIssue = ({
  issue,
  children,
}: {
  issue: IIssue;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: issue.id,
      data: {
        type: "Issue",
        issue,
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab"
    >
      {children}
    </div>
  );
};

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
  const { openIssueDetail } = useIssueStore();
  const { fieldVisibility } = useFieldVisibility();

  return (
    <SortableIssue issue={issue}>
      <div
        // initial={{ opacity: 0, scale: 0.95 }}
        // animate={{ opacity: 1, scale: 1 }}
        // exit={{ opacity: 0, scale: 0.9 }}
        // transition={{ duration: 0.3 }}
        className={`} $ cursor-pointer rounded-sm border border-gray-200 bg-white p-3 shadow-sm transition-all hover:bg-gray-200 hover:shadow-md ${isDragging ? "opacity-70" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          openIssueDetail(issue.id);
        }}
      >
        {/* Header with issue key and menu */}
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {fieldVisibility.workType && (
              <TypeBadge type={issue.type} isShowLabel={false} />
            )}
            {fieldVisibility.workItemKey && (
              <span className="">{issue.key}</span>
            )}
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
        <div className="mb-2 flex items-center gap-2">
          {fieldVisibility.priority && (
            <PriorityBadge priority={issue.priority} isShowLabel={false} />
          )}
          {fieldVisibility.estimate && issue.story_point > 0 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
              {issue.story_point} {issue.story_point === 1 ? "point" : "points"}
            </span>
          )}

          {/* Labels - Currently not available in IIssue interface */}
          {/* {fieldVisibility.labels && issue.labels && issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.labels.map((label, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
              >
                {label}
              </span>
            ))}
          </div>
        )} */}

          {/* Attachments indicator */}
          {issue.attachments.length > 0 && (
            <div className={`text-xs text-gray-500`}>
              <span className="flex items-center">
                <span className="mr-1">📎</span>
                {issue.attachments.length}
              </span>
            </div>
          )}

          {fieldVisibility.epic && issue.parent_id && (
            <div className="ml-auto">
              <ParentBadge issueId={issue.parent_id} />
            </div>
          )}
        </div>

        {/* Footer with assignee and date */}
        <div
          className={`mt-3 flex items-center justify-between text-xs text-gray-500`}
        >
          {fieldVisibility.assignee && (
            <UserAvatar userId={issue.assignee_id} />
          )}
          {fieldVisibility.dueDate && (
            <span title={issue.created_at}>
              Created {formatDate(issue.created_at)}
            </span>
          )}
        </div>
      </div>
    </SortableIssue>
  );
};
export default IssueCard;
