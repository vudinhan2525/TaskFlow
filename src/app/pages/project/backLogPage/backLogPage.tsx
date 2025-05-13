import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectIssues, useUpdateIssue } from "@libs/hooks/useIssue";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { useProjectColumns } from "@libs/hooks/useProject";
import { Sprint } from "@libs/apis/sprint";
import { IIssue } from "@libs/types/issue";
import ScrumSprint from "@libs/app/components/projects/backlog/scrumPrint";
import CreateSprintModal from "@libs/app/components/projects/modals/createSprintModal";
import Button from "@libs/app/components/general-components/button";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";

const BackLogPage: React.FC = () => {
  const { projectId = "" } = useParams();
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const { selectIssue } = useIssueSelection();
  const [selectedIssues, setSelectedIssues] = useState<{ [key: string]: boolean }>({});
  const { sprints, isLoading: isLoadingSprints } = useProjectSprints(projectId || "");
  const { issues, isLoading: isLoadingIssues } = useProjectIssues({
    project_id: projectId,
  });
  const { columns, isLoading: isLoadingColumns } = useProjectColumns(projectId);
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleStatusChange = async (issueId: string, newColumnId: string) => {
    // TODO: FIX COLUMN ID
    try {
      await updateIssueAsync({ id: issueId, data: { column_id: newColumnId } });
    } catch (error) {
      console.error("Failed to update issue status:", error);
    }
  };

  const handleIssueSelect = (issueId: string, selected: boolean, issue?: IIssue) => {
    setSelectedIssues((prev) => ({
      ...prev,
      [issueId]: selected,
    }));

    if (!selected) {
      selectIssue(null);
    } else if (issue) {
      selectIssue(issue);
    }
  };

  if (isLoadingSprints || isLoadingIssues || isLoadingColumns) {
    return <div>Loading...</div>;
  }

  const backlogIssues = issues.filter((issue) => !issue.sprint_id);
  const sprintIssues = (sprintId: string) => {
    return issues.filter((i) => i.sprint_id === sprintId);
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Backlog</h1>
          <Button onClick={() => setIsCreateSprintModalOpen(true)} variant="primary">
            Create Sprint
          </Button>
        </div>

        {/* Sprint List */}
        <div className="space-y-4">
          {sprints?.map((sprint: Sprint) => (
            <ScrumSprint
              key={sprint.id}
              sprintName={sprint.name}
              startDate={sprint.date_started}
              endDate={sprint.date_ended}
              issues={sprintIssues(sprint.id)}
              issueCount={sprintIssues(sprint.id).length}
              projectId={projectId}
              sprintId={sprint.id}
              selectedIssues={selectedIssues}
              onIssueSelect={handleIssueSelect}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {/* Backlog Section */}
        <div className="mt-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Backlog Items</h2>
            <div className="space-y-2">
              {backlogIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
                  onClick={() => handleIssueSelect(issue.id, !selectedIssues[issue.id], issue)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{issue.title}</h3>
                      <p className="text-sm text-gray-500">{issue.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select value={issue.column.name} onChange={(e) => handleStatusChange(issue.id, e.target.value)} className="p-1 border rounded text-sm">
                        {columns.map((column) => (
                          <option key={column.id} value={column.name}>
                            {column.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Sprint Modal */}
        <CreateSprintModal isOpen={isCreateSprintModalOpen} onClose={() => setIsCreateSprintModalOpen(false)} projectId={projectId} />
      </div>

      <IssueSideBar />
    </div>
  );
};

export default BackLogPage;
