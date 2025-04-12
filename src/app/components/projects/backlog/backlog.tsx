import React, { useState } from "react";
import Button from "@libs/app/components/general-components/button";
import CreateSprintModal from "../modals/createSprintModal";
import ScrumSprint from "./scrumPrint";
import { Issue, IssueStatus } from "@libs/types";
import { Sprint } from "@libs/apis/sprint";
import StatusDropdown from "./StatusDropdown";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";

export interface CreateSprintData {
  name: string;
  date_started: string;
  date_ended: string;
  duration: number;
  goal: string;
  project_id: string;
}

interface BacklogProps {
  projectId: string;
  sprints: Sprint[];
  issues: Issue[];
  onCreateSprint: (data: CreateSprintData) => Promise<void>;
  onStatusChange?: (issueId: string, newStatus: IssueStatus) => void;
}

const Backlog: React.FC<BacklogProps> = ({ projectId, sprints, issues, onCreateSprint, onStatusChange }) => {
  const { selectIssue } = useIssueSelection();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<{ [key: string]: boolean }>({});

  const handleIssueSelect = (issueId: string, selected: boolean) => {
    setSelectedIssues((prev) => ({
      ...prev,
      [issueId]: selected,
    }));
  };

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    try {
      if (onStatusChange) {
        await onStatusChange(issueId, newStatus);
      }
    } catch (error) {
      console.error("Error updating issue status:", error);
    }
  };

  const backlogIssues = (Array.isArray(issues) ? issues : []).filter((issue) => !issue.sprint_id);

  return (
    <div>
      {/* Sprint sections */}
      {sprints?.map((sprint) => {
        const sprintIssues = issues?.filter((issue) => issue.sprint_id === sprint.id) || [];
        return (
          <ScrumSprint
            key={sprint.id}
            sprintName={sprint.name}
            startDate={sprint.date_started}
            endDate={sprint.date_ended}
            issues={sprintIssues}
            issueCount={sprintIssues.length}
            projectId={projectId}
            sprintId={sprint.id}
            selectedIssues={selectedIssues}
            onIssueSelect={handleIssueSelect}
            onStatusChange={handleStatusChange}
          />
        );
      })}

      {/* Backlog section */}
      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <button className="text-gray-500" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "▼" : "▶"}
              </button>
              <h3 className="font-semibold">Backlog</h3>
              <span className="text-sm text-gray-500">{backlogIssues.length} issues</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="primary" className="text-sm" onClick={() => setIsCreateSprintModalOpen(true)}>
                Create Sprint
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border border-gray-200 rounded-b-lg divide-y">
            {/* Select all backlog issues */}
            <div className="p-3 bg-white">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={backlogIssues.length > 0 && backlogIssues.every((issue) => selectedIssues[issue.id])}
                  onChange={(e) => {
                    backlogIssues.forEach((issue) => {
                      handleIssueSelect(issue.id, e.target.checked);
                    });
                  }}
                  className="rounded"
                />
                <span className="text-sm font-medium">Select All Backlog Issues</span>
              </label>
            </div>

            {backlogIssues.map((issue) => (
              <div key={issue.id} className="p-3 bg-white hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedIssues[issue.id] || false}
                    onChange={(e) => handleIssueSelect(issue.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded"
                  />
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm">👤</span>
                  </div>
                  <div className="flex-grow cursor-pointer" onClick={() => selectIssue(issue.id)}>
                    <div className="font-medium">{issue.title}</div>
                    <div className="text-sm text-gray-500">{issue.id}</div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      status={issue.status}
                      onChange={(newStatus) => handleStatusChange(issue.id, newStatus)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <CreateSprintModal
          isOpen={isCreateSprintModalOpen}
          onClose={() => setIsCreateSprintModalOpen(false)}
          projectId={projectId}
          onSubmit={async (data) => {
            try {
              await onCreateSprint({
                name: data.name,
                date_started: data.dateStarted,
                date_ended: data.dateEnded,
                duration: Math.ceil(
                  (new Date(data.dateEnded).getTime() - new Date(data.dateStarted).getTime()) / (1000 * 3600 * 24)
                ),
                goal: "",
                project_id: projectId,
              });
              setIsCreateSprintModalOpen(false);
            } catch (error) {
              console.error("Failed to create sprint:", error);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Backlog;
