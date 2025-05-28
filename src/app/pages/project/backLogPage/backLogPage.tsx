import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectIssues } from "@libs/hooks/useIssue";
import BackLog from "@libs/app/components/projects/backlog/backlog";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import CreateSprintModal from "@libs/app/components/projects/modals/createSprintModal";
import Button from "@libs/app/components/general-components/button";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";


const BackLogPage: React.FC = () => {
  const { projectId = "" } = useParams();
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [backLogMinWidth, setBackLogMinWidth] = useState(0);
  useEffect(() => {
    if (containerRef.current) {
      setBackLogMinWidth(
        Math.round((containerRef.current?.clientWidth || 0) * 0.6),
      );
    }
  }, []);
  const { selectedIssue } = useIssueSelection();
  const { sprints: initialSprints, isLoading: isLoadingSprints } =
    useProjectSprints(projectId || "");
  const { issues: initialIssues, isLoading: isLoadingIssues } =
    useProjectIssues({
      project_id: projectId,
    });

  return (
    <div
      ref={containerRef}
      className="flex flex-1 flex-col gap-4 overflow-auto p-4"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Backlog</h1>
        <Button
          onClick={() => setIsCreateSprintModalOpen(true)}
          variant="primary"
        >
          Create Sprint
        </Button>
      </div>
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
            <div className="h-full overflow-auto">
              <div
                style={{
                  minWidth: backLogMinWidth,
                }}
              >
                <BackLog
                  initialSprints={initialSprints}
                  initialIssues={initialIssues}
                  isLoadingSprints={isLoadingSprints}
                  isLoadingIssues={isLoadingIssues}
                />
              </div>
            </div>
          </Panel>

          {selectedIssue && (
            <PanelResizeHandle
              style={{
                width: "2px",
                backgroundColor: "oklch(0.696 0.17 162.48)",
              }}
              className="backlog--panel-resize-handle relative w-1 cursor-col-resize bg-gray-300 text-emerald-500 opacity-0 hover:opacity-100"
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
              <div className="h-full overflow-y-auto">
                <IssueSideBar />
              </div>
            </Panel>
          )}
        </PanelGroup>
      </div>

      {/* Create Sprint Modal */}
      <CreateSprintModal
        isOpen={isCreateSprintModalOpen}
        onClose={() => setIsCreateSprintModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
};

export default BackLogPage;
