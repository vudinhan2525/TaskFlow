import React, { useState, useRef, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectIssues } from "@libs/hooks/useIssue";
import BackLog from "@libs/app/components/projects/backlog/backlog";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import Button from "@libs/app/components/general-components/button";
import PageFilter from "@libs/app/components/general-components/pageFilter";
import { GetIssuesParams } from "@libs/types/issue";
import IssueSidebarSkeleton from "@libs/app/components/skeleton/issueSidebarSkeleton";
const IssueSideBar = lazy(
  () => import("@libs/app/components/issues/IssueSideBar"),
);
const CreateSprintModal = lazy(
  () => import("@libs/app/components/projects/modals/createSprintModal"),
);

const BackLogPage: React.FC = () => {
  const { projectId = "" } = useParams();
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<GetIssuesParams>({
    project_id: projectId,
  });
  const { selectedIssue } = useIssueSelection();
  const { sprints: initialSprints, isLoading: isLoadingSprints } =
    useProjectSprints(projectId || "");
  const { issues: initialIssues, isLoading: isLoadingIssues } =
    useProjectIssues(filters);

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-4 p-4 pb-28">
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-2xl font-bold text-gray-700">Backlog Page</h1>

        <Button
          onClick={() => setIsCreateSprintModalOpen(true)}
          variant="primary"
          className="font-semibold"
        >
          Create Sprint
        </Button>
      </div>
      <PageFilter
        onFiltersChange={(filter) => {
          setFilters(filter);
        }}
      />

      <div className="flex flex-1 overflow-auto">
        <PanelGroup
          className="flex w-full flex-1"
          autoSaveId="backlog-panel-group"
          direction="horizontal"
        >
          <Panel
            id="backlog-panel"
            order={1}
            defaultSize={selectedIssue ? 60 : 100}
            minSize={50}
            maxSize={100}
          >
            <div className="h-full overflow-auto pr-4">
                <BackLog
                  initialSprints={initialSprints}
                  initialIssues={initialIssues}
                  isLoadingSprints={isLoadingSprints}
                  isLoadingIssues={isLoadingIssues}
                />
            </div>
          </Panel>

          {selectedIssue && (
            <PanelResizeHandle
              style={{
                backgroundColor: "oklch(0.696 0.17 162.48)",
              }}
              className="backlog--panel-resize-handle relative w-[2px] cursor-col-resize bg-gray-300 pl-[2px] text-emerald-500 opacity-0 hover:opacity-100"
            />
          )}

          {selectedIssue && (
            <Panel
              id="issue-side-bar-panel"
              order={2}
              defaultSize={40}
              maxSize={50}
              minSize={30}
            >
              <div className="h-full overflow-y-auto pr-4">
                <Suspense fallback={<IssueSidebarSkeleton />}>
                    <IssueSideBar />
                </Suspense>
              </div>
            </Panel>
          )}
        </PanelGroup>
      </div>

      {/* Create Sprint Modal */}
      {isCreateSprintModalOpen && (
        <CreateSprintModal
          isOpen={isCreateSprintModalOpen}
          onClose={() => setIsCreateSprintModalOpen(false)}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default BackLogPage;
