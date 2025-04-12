import React, { useState } from "react";
import { IssueStatus, IIssue } from "@libs/types/issue";
import Button from "@libs/app/components/general-components/button";
import CreateIssueModalFromSprint from "@libs/app/components/projects/modals/createIssueModalFromSprint";
import CreateSprintModal from "@libs/app/components/projects/modals/createSprintModal";
import StatusDropdown from "./StatusDropdown";
import { formatSprintDate } from "../../../../utils/date";
import { useCreateIssue } from "@libs/hooks/useIssue";
interface ScrumSprintProps {
  sprintName: string;
  startDate: string;
  endDate: string;
  issues: IIssue[];
  issueCount: number;
  projectId: string;
  sprintId: string;
  selectedIssues: { [key: string]: boolean };
  onIssueSelect: (issueId: string, selected: boolean) => void;
  onStatusChange?: (issueId: string, newStatus: IssueStatus) => void;
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
  const { createIssueAsync } = useCreateIssue({
    projectId,
    onClose: () => setIsIssueModalOpen(false),
  });

  return (
    <div className="mb-6">
      <div className="bg-gray-100 p-4 rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button className="text-gray-500" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "▼" : "▶"}
            </button>
            <h3 className="font-semibold">{sprintName}</h3>
            <span className="text-sm text-gray-500">
              {formatSprintDate(startDate)} - {formatSprintDate(endDate)}
            </span>
            <span className="text-sm text-gray-500">{issueCount} issues</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm text-gray-500">
            <div>To Do: {issues.filter((issue) => issue.status === "ToDo").length}</div>
            <div>In Progress: {issues.filter((issue) => issue.status === "InProgress").length}</div>
            <div>Done: {issues.filter((issue) => issue.status === "Done").length}</div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              className="text-sm bg-green-600 text-white hover:bg-green-700"
              onClick={() => setIsIssueModalOpen(true)}
            >
              Create Issue
            </Button>
            <Button variant="secondary" className="text-sm">
              Complete Sprint
            </Button>
            <Button variant="secondary" className="text-sm" onClick={() => setIsSprintModalOpen(true)}>
              Edit Sprint
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border border-gray-200 rounded-b-lg divide-y">
          {/* Select all sprint issues */}
          <div className="p-3 bg-white">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={issues.length > 0 && issues.every((issue) => selectedIssues[issue.id])}
                onChange={(e) => {
                  issues.forEach((issue) => {
                    onIssueSelect(issue.id, e.target.checked);
                  });
                }}
                className="rounded"
              />
              <span className="text-sm font-medium">Select All Sprint Issues</span>
            </label>
          </div>

          {issues.map((issue) => (
            <div key={issue.id} className="p-3 bg-white hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedIssues[issue.id] || false}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onIssueSelect(issue.id, e.target.checked)}
                  className="rounded"
                />
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm">👤</span>
                </div>
                <div className="flex-grow cursor-pointer" onClick={() => onIssueSelect(issue.id, true)}>
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-sm text-gray-500">{issue.id}</div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <StatusDropdown
                    status={issue.status as IssueStatus}
                    onChange={(newStatus) => onStatusChange?.(issue.id, newStatus as IssueStatus)}
                  />
                </div>
              </div>
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
              status: formData.status || "ToDo",
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
