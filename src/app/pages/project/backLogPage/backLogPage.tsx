import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectSprints, useCreateSprint } from "@libs/hooks/useSprint";
import { useProjectIssues, useUpdateIssue } from "@libs/hooks/useIssue";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { Sprint } from "@libs/apis/sprint";
import { IssueStatus } from "@libs/types/issue";
import ScrumSprint from "@libs/app/components/projects/backlog/scrumPrint";
import CreateSprintModal from "@libs/app/components/projects/modals/createSprintModal";
import Button from "@libs/app/components/general-components/button";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";

const BackLogPage: React.FC = () => {
  const { projectId = "" } = useParams();
  // console.log("Route params projectId:", projectId);
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const { selectIssue } = useIssueSelection();
  const [selectedIssues, setSelectedIssues] = useState<{ [key: string]: boolean }>({});
  const { sprints, isLoading: isLoadingSprints } = useProjectSprints(projectId || "");
  // console.log("sprints data:", {
  //   projectId,
  //   sprints,
  //   isLoading: isLoadingSprints,
  //   error: sprintsError,
  //   enabled: !!projectId,
  // });
  const { createSprintAsync } = useCreateSprint({ projectId });
  const { issues, isLoading: isLoadingIssues } = useProjectIssues(projectId);
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const handleCreateSprint = async (data: { name: string; dateStarted: string; dateEnded: string }) => {
    try {
      await createSprintAsync({
        name: data.name,
        date_started: data.dateStarted,
        date_ended: data.dateEnded,
        project_id: projectId,
        goal: "",
        duration: Math.ceil(
          (new Date(data.dateEnded).getTime() - new Date(data.dateStarted).getTime()) / (1000 * 3600 * 24)
        ),
      });
      setIsCreateSprintModalOpen(false);
    } catch (error) {
      console.error("Failed to create sprint:", error);
    }
  };

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    try {
      await updateIssueAsync({ id: issueId, data: { status: newStatus } });
    } catch (error) {
      console.error("Failed to update issue status:", error);
    }
  };

  const handleIssueSelect = (issueId: string, selected: boolean) => {
    setSelectedIssues((prev) => ({
      ...prev,
      [issueId]: selected,
    }));
    if (selected) {
      selectIssue(issueId);
    }
  };

  if (isLoadingSprints || isLoadingIssues) {
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
                  onClick={() => handleIssueSelect(issue.id, true)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{issue.title}</h3>
                      <p className="text-sm text-gray-500">{issue.description}</p>
                    </div>
                    <div>
                      <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">{issue.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Sprint Modal */}
        <CreateSprintModal
          isOpen={isCreateSprintModalOpen}
          onClose={() => setIsCreateSprintModalOpen(false)}
          onSubmit={handleCreateSprint}
          projectId={projectId}
        />
      </div>

      <IssueSideBar />
    </div>
  );
};

export default BackLogPage;
