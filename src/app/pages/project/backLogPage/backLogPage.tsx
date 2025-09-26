import React, {
  useState,
  lazy,
  Suspense,
  useTransition,
  useMemo,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectIssues } from "@libs/hooks/useIssue";
import { Helmet } from "react-helmet-async";
import BackLog from "@libs/app/components/projects/backlog/backlog";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Button from "@libs/app/components/general-components/button";
import PageFilter from "@libs/app/components/general-components/pageFilter";
import { GetIssuesParams } from "@libs/types/issue";

import { useIssueStore } from "@libs/store/useIssueStore";
// import { useSearchParams } from "react-router-dom";
import { getIssuesNotEpic } from "@libs/utils/issue";
// import BacklogEpic from "@libs/app/components/projects/backlog/backlogEpic";
import BacklogSkeleton from "@libs/app/components/skeleton/backlogSkeleton";

import IssueDetail from "@libs/app/components/issues/IssueDetail";
const CreateSprintModal = lazy(
  () => import("@libs/app/components/projects/modals/createSprintModal"),
);
import IssueDetailSkeleton from "@libs/app/components/skeleton/issueDetailSkeleton";

const BackLogPage: React.FC = () => {
  const { projectId = "" } = useParams();
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<GetIssuesParams>({
    project_id: projectId,
    // is_fetch: true,
  });

  // const [searchParams] = useSearchParams();
  // const epicVisible = searchParams.get("epicVisible");
  const { selectedIssueId } = useIssueStore();
  const [_, startTransition] = useTransition();
  const { sprints: initialSprints, isLoading: isLoadingSprints } =
    useProjectSprints(projectId);
  const { issues: initialIssues, isLoading: isLoadingIssues } =
    useProjectIssues(filters);

  const notEpicIssues = useMemo(() => {
    return getIssuesNotEpic(initialIssues);
  }, [initialIssues]);

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-4 p-4 pb-28">
      <Helmet>
        <title>Backlog - Task Flow</title>
      </Helmet>
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
      {isLoadingSprints ||
      isLoadingIssues ||
      !initialIssues.length ||
      !initialSprints.length ? (
        <BacklogSkeleton />
      ) : (
        <div className="flex flex-1 gap-4 overflow-auto">
          {/* <div className="w-[20%]">
            <BacklogEpic issues={initialIssues} />
          </div> */}

          <PanelGroup
            className="flex w-full flex-1"
            autoSaveId="backlog-panel-group"
            direction="horizontal"
          >
            <Panel
              id="backlog-panel"
              order={1}
              defaultSize={selectedIssueId ? 60 : 100}
              minSize={50}
              maxSize={100}
            >
              <div className="h-full overflow-auto pr-4">
                <BackLog
                  projectId={projectId}
                  initialSprints={initialSprints}
                  initialIssues={notEpicIssues}
                />
              </div>
            </Panel>

            {selectedIssueId && (
              <PanelResizeHandle
                style={{
                  backgroundColor: "oklch(0.696 0.17 162.48)",
                }}
                className="backlog--panel-resize-handle relative w-[2px] cursor-col-resize bg-gray-300 pl-[2px] text-emerald-500 opacity-0 hover:opacity-100"
              />
            )}
            <Panel
              id="issue-side-bar-panel"
              order={2}
              defaultSize={selectedIssueId ? 40 : 0}
              maxSize={selectedIssueId ? 50 : 0}
              minSize={selectedIssueId ? 30 : 0}
            >
              <div className="h-full overflow-y-auto pr-4">
                <Suspense fallback={<IssueDetailSkeleton />}>
                  <IssueDetail selectedIssueId={selectedIssueId || ""} />
                </Suspense>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      )}

      {/* Create Sprint Modal */}
      {isCreateSprintModalOpen && (
        <CreateSprintModal
          isOpen={isCreateSprintModalOpen}
          onClose={() => {
            startTransition(() => {
              setIsCreateSprintModalOpen(false);
            });
          }}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default BackLogPage;
