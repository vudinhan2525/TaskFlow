import { useState } from "react";
import Button from "@libs/app/components/general-components/button";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";
import ScrumSprint from "@libs/app/components/projects/backlog/scrumPrint";
import CreateIssueModal from "@libs/app/components/projects/modals/createIssueModal";
import CreateSprintModal from "@libs/app/components/projects/modals/createSprintModal";
import { useSelector } from "react-redux";
import { RootState } from "@libs/store";
import Backlog from "@libs/app/components/projects/backlog/backlog";
import { useSprint } from "@libs/hooks/useSprint";
import { useParams } from "react-router-dom";
import { useIssues } from "@libs/hooks/useIssue";

const BacklogPage: React.FC = () => {
  const { projectKey: projectId = "" } = useParams();
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const selectedIssueId = useSelector((state: RootState) => state.ui.selectedIssueId);
  const { sprints, isLoading, createSprint } = useSprint(projectId);
  const { createIssue } = useIssues(projectId);

  return (
    <div className="flex">
      <div
        className={`flex-1 p-4 bg-white min-h-screen transition-all duration-300 ${
          selectedIssueId ? "w-3/4" : "w-full"
        }`}
      >
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => setIsCreateSprintModalOpen(true)}
            >
              Add Sprint
            </Button>
            <Button
              variant="primary"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => setIsCreateIssueModalOpen(true)}
            >
              Create Issue
            </Button>
            <div className="relative ml-2">
              <input
                type="text"
                placeholder="Search backlog"
                className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <Button
              variant="secondary"
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-200"
            >
              Version
            </Button>
            <Button
              variant="secondary"
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-200"
            >
              Epic
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="dark" className="text-gray-500 hover:text-gray-700">
              📊
            </Button>
            <Button variant="dark" className="text-gray-500 hover:text-gray-700">
              ⚙️
            </Button>
            <Button variant="dark" className="text-gray-500 hover:text-gray-700">
              ...
            </Button>
          </div>
        </div>

        {/* Scrum Sprints */}
        {isLoading ? (
          <div className="text-center py-4">Loading sprints...</div>
        ) : sprints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sprints created yet. Create one from the backlog section below.
          </div>
        ) : (
          sprints.map((sprint) => (
            <ScrumSprint
              key={sprint.id}
              sprintName={sprint.name}
              startDate={new Date(sprint.date_started).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              endDate={new Date(sprint.date_ended).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              issues={[]} // TODO: Add sprint issues
              issueCount={0} // TODO: Add issue count
              projectId={projectId}
              sprintId={sprint.id}
            />
          ))
        )}

        {/* Backlog */}
        <Backlog projectId={projectId} />
      </div>

      <IssueSideBar />

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={isCreateIssueModalOpen}
        onClose={() => setIsCreateIssueModalOpen(false)}
        onSubmit={async (data) => {
          try {
            await createIssue.mutateAsync(data);
            setIsCreateIssueModalOpen(false);
          } catch (error) {
            console.error("Failed to create issue:", error);
          }
        }}
      />

      {/* Create Sprint Modal */}
      <CreateSprintModal
        isOpen={isCreateSprintModalOpen}
        onClose={() => setIsCreateSprintModalOpen(false)}
        projectId={projectId}
        onSubmit={async (data) => {
          try {
            await createSprint.mutateAsync({
              projectId,
              name: data.name,
              date_started: data.dateStarted,
              date_ended: data.dateEnded,
            });
            setIsCreateSprintModalOpen(false);
          } catch (error) {
            console.error("Failed to create sprint:", error);
          }
        }}
      />
    </div>
  );
};

export default BacklogPage;
