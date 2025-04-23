import { IIssue, IssuePriority } from "@libs/types/issue";
import { useState } from "react";

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: IssuePriority }) => {
  const priorityColors = {
    Low: "bg-blue-100 text-blue-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  };

  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>{priority}</span>;
};

// Type badge component
const TypeBadge = ({ type }: { type: IIssue["type"] }) => {
  const typeIcons = {
    Bug: "🐞",
    Task: "✅",
    Story: "📖",
    Epic: "🌟",
  };

  return (
    <span className="mr-1 text-sm" title={type}>
      {typeIcons[type]}
    </span>
  );
};

export default function IssueCard({ issue }: { issue: IIssue }) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine if this is a child issue
  const isChildIssue = !!issue.parent_id;

  // Classes for child issues
  const childIssueClasses = isChildIssue
    ? "ml-8 relative before:content-[''] before:absolute before:left-[-1rem] before:top-[50%] before:w-3 before:h-px before:bg-gray-300 before:transform before:translate-y-[-50%] scale-95"
    : "";

  // Reduced font size for child issues
  const titleClasses = `font-medium mb-2 line-clamp-2 ${isChildIssue ? "text-xs" : "text-sm"}`;

  return (
    <div
      className={`bg-white rounded-md shadow-sm border border-gray-200 p-3 mb-2 cursor-pointer transition-all hover:shadow-md ${childIssueClasses} ${
        isChildIssue ? "border-l-4 border-l-gray-300" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with issue key and menu */}
      <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
        <div className="flex items-center">
          <TypeBadge type={issue.type} />
          <span>{issue.id.toUpperCase()}</span>
          {isChildIssue && (
            <span className="ml-2 text-gray-400" title="Child Issue">
              ↳
            </span>
          )}
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
      <div className="flex flex-wrap gap-2 mb-2">
        <PriorityBadge priority={issue.priority} />
        {issue.story_point > 0 && (
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
            {issue.story_point} {issue.story_point === 1 ? "point" : "points"}
          </span>
        )}
      </div>

      {/* Footer with assignee and date */}
      <div
        className={`flex justify-between items-center mt-3 ${isChildIssue ? "text-[10px]" : "text-xs"} text-gray-500`}
      >
        <div className="flex items-center">
          <div
            className={`${
              isChildIssue ? "w-5 h-5" : "w-6 h-6"
            } rounded-full bg-gray-300 flex items-center justify-center text-xs mr-1 uppercase`}
          >
            {issue.assignee_id.charAt(0)}
          </div>
          <span className="truncate max-w-[100px]">{issue.assignee_id}</span>
        </div>
        <span title={issue.updated_at}>Updated {formatDate(issue.updated_at)}</span>
      </div>

      {/* Attachments indicator */}
      {issue.attachments.length > 0 && (
        <div className={`mt-2 ${isChildIssue ? "text-[10px]" : "text-xs"} text-gray-500`}>
          <span className="flex items-center">
            <span className="mr-1">📎</span>
            {issue.attachments.length}
          </span>
        </div>
      )}
    </div>
  );
}
