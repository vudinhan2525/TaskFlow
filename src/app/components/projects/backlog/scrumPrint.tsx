import React, { useState } from "react";
import { IssueStatus } from "@libs/types";
import Button from "@libs/app/components/general-components/button";
import CreateIssueModalFromSprint from "@libs/app/components/projects/modals/createIssueModalFromSprint";
import StatusDropdown from "./StatusDropdown";
import { formatSprintDate } from "../../../../utils/date";
import { Issue } from "@libs/apis/issue";

interface ScrumSprintProps {
  sprintName: string;
  startDate: string;
  endDate: string;
  issues: Issue[];
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

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
            <div>To Do: {issues.filter((issue) => issue.status === "To Do").length}</div>
            <div>In Progress: {issues.filter((issue) => issue.status === "In Progress").length}</div>
            <div>Done: {issues.filter((issue) => issue.status === "Done").length}</div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              className="text-sm bg-green-600 text-white hover:bg-green-700"
              onClick={() => setIsModalOpen(true)}
            >
              Create Issue
            </Button>
            <Button variant="secondary" className="text-sm">
              Complete Sprint
            </Button>
            <Button variant="secondary" className="text-sm">
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          console.log("Creating issue in sprint:", data);
          setIsModalOpen(false);
        }}
        projectId={projectId}
        sprintId={sprintId}
      />
    </div>
  );
};

export default ScrumSprint;
