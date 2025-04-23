import React, { useState } from "react";
import { IIssue } from "@libs/types/issue";
import { useProjectColumns } from "@libs/hooks/useProject";
import Button from "@libs/app/components/general-components/button";
import CreateIssueModalFromSprint from "@libs/app/components/projects/modals/createIssueModalFromSprint";
import CreateSprintModal from "@libs/app/components/projects/modals/createSprintModal";
import StatusDropdown from "./StatusDropdown";
import { formatSprintDate } from "../../../../utils/date";
import { useCreateIssue } from "@libs/hooks/useIssue";
import {
  FaChevronDown,
  FaChevronRight,
  FaBug,
  FaCheckSquare,
  FaStar,
  FaLightbulb,
  FaExclamationCircle,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

interface ScrumSprintProps {
  sprintName: string;
  startDate: string;
  endDate: string;
  issues: IIssue[];
  issueCount: number;
  projectId: string;
  sprintId: string;
  selectedIssues: { [key: string]: boolean };
  onIssueSelect: (issueId: string, selected: boolean, issue?: IIssue) => void;
  onStatusChange?: (issueId: string, newStatus: string) => void;
}

const ScrumSprint: React.FC<ScrumSprintProps> = ({
  sprintName,
  startDate,
  endDate,
  issues,
  issueCount,
  projectId,
  sprintId,
  selectedIssues,
  onIssueSelect,
  onStatusChange,
}) => {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedIssues, setExpandedIssues] = useState<{ [key: string]: boolean }>({});
  const { columns } = useProjectColumns(projectId);
  const { createIssueAsync } = useCreateIssue({
    projectId,
    onClose: () => setIsIssueModalOpen(false),
  });

  // Group issues by their parent-child relationship
  const issueMap: { [key: string]: IIssue[] } = {};
  const parentIssues: IIssue[] = [];

  issues.forEach((issue) => {
    if (!issue.parent_id) {
      parentIssues.push(issue);
    } else {
      if (!issueMap[issue.parent_id]) {
        issueMap[issue.parent_id] = [];
      }
      issueMap[issue.parent_id].push(issue);
    }
  });

  const getIssueTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "bug":
        return <FaBug className="text-red-600" />;
      case "task":
        return <FaCheckSquare className="text-blue-600" />;
      case "story":
        return <FaLightbulb className="text-green-600" />;
      default:
        return <FaStar className="text-purple-600" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <FaArrowUp className="text-red-600" />;
      case "low":
        return <FaArrowDown className="text-green-600" />;
      default:
        return <FaExclamationCircle className="text-yellow-600" />;
    }
  };

  const toggleIssueExpansion = (issueId: string) => {
    setExpandedIssues((prev) => ({
      ...prev,
      [issueId]: !prev[issueId],
    }));
  };

  const IssueCard = ({ issue, isChild = false }: { issue: IIssue; isChild?: boolean }) => (
    <div
      className={`px-4 py-3 bg-white rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-50 ${
        isChild ? "ml-6 border-l-2 border-gray-200" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={selectedIssues[issue.id] || false}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onIssueSelect(issue.id, e.target.checked, issue)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
        />
        <div className="flex items-center space-x-2 min-w-[100px]">
          {getIssueTypeIcon(issue.type)}
          {getPriorityIcon(issue.priority)}
          <div
            className={`${
              isChild ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"
            } bg-blue-100 rounded-full flex items-center justify-center font-medium text-blue-700`}
          >
            {issue.assignee_id ? issue.assignee_id.substring(0, 2).toUpperCase() : "NA"}
          </div>
        </div>
        {!isChild && issueMap[issue.id]?.length > 0 && (
          <button
            className="text-gray-500 hover:text-gray-700 min-w-[20px]"
            onClick={(e) => {
              e.stopPropagation();
              toggleIssueExpansion(issue.id);
            }}
          >
            {expandedIssues[issue.id] ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
          </button>
        )}
        <div
          className="flex-grow cursor-pointer"
          onClick={() => onIssueSelect(issue.id, !selectedIssues[issue.id], issue)}
        >
          <div className={`font-semibold ${isChild ? "text-sm" : "text-base"} text-gray-900`}>
            {isChild && <span className="text-gray-400 mr-2">↳</span>}
            {issue.title}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`${isChild ? "text-xs" : "text-sm"} text-gray-500`}>{issue.id}</span>
            {issue.story_point && (
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {issue.story_point} SP
              </span>
            )}
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <StatusDropdown
            status={issue.status}
            columns={columns || []}
            onChange={(newStatus) => onStatusChange?.(issue.id, newStatus)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-6 border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-white p-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <FaChevronDown size={18} /> : <FaChevronRight size={18} />}
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{sprintName}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm text-gray-600">
                  {formatSprintDate(startDate)} - {formatSprintDate(endDate)}
                </span>
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  {issueCount} issues
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="grid grid-cols-4 gap-4 text-sm">
              {columns?.map((column) => (
                <div key={column.id} className="text-center">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{column.name}</div>
                  <div className="text-base font-semibold text-gray-900">
                    {issues.filter((issue) => issue.status === column.name).length}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
                onClick={() => setIsIssueModalOpen(true)}
              >
                Create Issue
              </Button>
              <Button
                variant="secondary"
                className="text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg shadow-sm transition-colors"
              >
                Complete Sprint
              </Button>
              <Button
                variant="secondary"
                className="text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg shadow-sm transition-colors"
                onClick={() => setIsSprintModalOpen(true)}
              >
                Edit Sprint
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="divide-y divide-gray-100 bg-gray-50">
          <div className="p-4 bg-white border-b border-gray-200">
            <label className="flex items-center space-x-3 select-none">
              <input
                type="checkbox"
                checked={issues.length > 0 && issues.every((issue) => selectedIssues[issue.id])}
                onChange={(e) => {
                  issues.forEach((issue) => onIssueSelect(issue.id, e.target.checked));
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">Select All Sprint Issues</span>
              <span className="text-xs text-gray-500">({issues.length} issues)</span>
            </label>
          </div>

          {parentIssues.map((parentIssue) => (
            <div key={parentIssue.id} className="group">
              <IssueCard issue={parentIssue} />
              {issueMap[parentIssue.id]?.length > 0 && expandedIssues[parentIssue.id] && (
                <div className="ml-6 space-y-2">
                  {issueMap[parentIssue.id].map((childIssue) => (
                    <IssueCard key={childIssue.id} issue={childIssue} isChild={true} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CreateIssueModalFromSprint
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSubmit={async (formData) => {
          if (!formData.title || !formData.priority || !formData.type) {
            console.error("Missing required fields");
            return;
          }
          try {
            await createIssueAsync({
              title: formData.title,
              summary: formData.summary || "",
              description: formData.description || "",
              status: formData.status || columns?.[0]?.name || "TO DO",
              priority: formData.priority,
              type: formData.type,
              assignee_id: formData.assignee_id || undefined,
              reporter_id: formData.reporter_id || undefined,
              sprint_id: sprintId,
              project_id: projectId,
              attachments: [],
            });
          } catch (error) {
            console.error("Failed to create issue:", error);
          }
        }}
        projectId={projectId}
        sprintId={sprintId}
      />

      <CreateSprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        projectId={projectId}
        isEditing={true}
        initialSprint={{
          id: sprintId,
          name: sprintName,
          date_started: startDate,
          date_ended: endDate,
        }}
      />
    </div>
  );
};

export default ScrumSprint;
