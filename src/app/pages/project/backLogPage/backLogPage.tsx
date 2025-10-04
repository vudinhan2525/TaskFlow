import React, {
  useState,
  lazy,
  Suspense,
  useTransition,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectIssues, useUpdateIssue } from "@libs/hooks/useIssue";
import { Helmet } from "react-helmet-async";
import BackLog from "@libs/app/components/projects/backlog/backlog";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Button from "@libs/app/components/general-components/button";
import PageFilter from "@libs/app/components/general-components/pageFilter";
import { GetIssuesParams } from "@libs/types/issue";
import { useIssueStore } from "@libs/store/useIssueStore";
import BacklogSkeleton from "@libs/app/components/skeleton/backlogSkeleton";
import {
  DndContext,
  useSensor,
  PointerSensor,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  SortableContext,
} from "@dnd-kit/sortable";
import { IIssue } from "@libs/types/issue";
import { getIssuesNotEpic } from "@libs/utils/issue";
import {
  OverItemProvider,
  useOverItem,
} from "@libs/app/context/overItem.context";
const BacklogEpic = lazy(
  () => import("@libs/app/components/projects/backlog/backlogEpic"),
);
import IssueDetail from "@libs/app/components/issues/IssueDetail";
const CreateSprintModal = lazy(
  () => import("@libs/app/components/projects/modals/createSprintModal"),
);
import IssueDetailSkeleton from "@libs/app/components/skeleton/issueDetailSkeleton";
import { ISprint } from "@libs/types/sprint";
interface ISprintIssues extends ISprint {
  issues: IIssue[];
}
const backLogSprint: ISprintIssues = {
  id: "",
  name: "Backlog",
  date_started: new Date().toISOString(),
  date_ended: new Date().toISOString(),
  project_id: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  issues: [],
  duration: 0,
  goal: "",
};

const BackLogPageContent: React.FC = () => {
  const { projectId = "" } = useParams();
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState<{
    isOpen: boolean;
    sprint: ISprint | null;
  }>({
    isOpen: false,
    sprint: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<GetIssuesParams>({
    project_id: projectId,
    limit: 100,
    is_fetch: false,
  });

  const { selectedIssueId } = useIssueStore();
  const { setOverItemId } = useOverItem();
  const [_, startTransition] = useTransition();
  const { sprints, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const { issues, isLoading: isLoadingIssues } = useProjectIssues(filters);
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const [activeIssue, setActiveIssue] = useState<IIssue | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sprintIssues, setSprintIssues] = useState<ISprintIssues[]>([]);

  useEffect(() => {
    if (sprints.length && issues.length) {
      const issuesNotEpic = getIssuesNotEpic(issues);
      setSprintIssues(
        [...sprints, backLogSprint].map((sprint: ISprint) => {
          return {
            ...sprint,
            issues: issuesNotEpic.filter(
              (issue: IIssue) => issue.sprint_id === sprint.id,
            ),
          };
        }),
      );
    }
  }, [sprints, issues, isLoadingSprints, isLoadingIssues]);
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (!sprintIssues.length) return;
      const { active } = event;
      const issueId = active.id as string;

      for (const sprint of sprintIssues) {
        const issue = sprint.issues?.find((i) => i.id === issueId);
        if (issue) {
          setActiveIssue(issue);
          break;
        }
      }
      setIsDragging(true);
    },
    [sprintIssues],
  );

  const handleDragOver = (event: DragOverEvent) => {
    if (!sprintIssues) return;
    const { over } = event;
    setOverItemId(over?.id as string);
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!sprintIssues.length) {
        return;
      }
      setIsDragging(false);
      setActiveIssue(null);
      setOverItemId(null);
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      if (over?.data?.current?.type === "epic") {
        updateIssueAsync({
          id: active.id as string,
          data: {
            parent_id: over.id === "no-epic" ? "no-epic" : (over.id as string),
          },
        });
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      const isOverSprint = sprintIssues.find((sprint) =>
        sprint.issues?.some((issue) => issue.id === overId),
      )
        ? false
        : true;

      // Find the sprint that the issue is being dragged over
      const targetSprint =
        over?.data?.current?.type === "Sprint"
          ? over.data.current.sprint
          : sprintIssues.find((sprint) =>
              sprint.issues?.some((issue) => issue.id === overId),
            ) || sprintIssues.find((sprint) => sprint.id === overId);
      const activeSprint = sprintIssues.find((sprint) =>
        sprint.issues?.some((issue) => issue.id === activeId),
      );

      //Drop into the same sprint
      if (targetSprint?.id == activeSprint?.id) {
        if (targetSprint?.id == overId) return;
        setSprintIssues((prevSprints) => {
          const newSprints = prevSprints.map((sprint) => ({
            ...sprint,
            issues: [...sprint.issues],
          }));
          const targetSprintIndex = newSprints.findIndex(
            (sprint) => sprint.id === targetSprint?.id,
          );

          const activeIssueIndex = newSprints[
            targetSprintIndex
          ].issues.findIndex((issue) => issue.id === activeId);
          const activeIssue =
            newSprints[targetSprintIndex].issues[activeIssueIndex];
          const overIssueIndex = newSprints[targetSprintIndex].issues.findIndex(
            (issue) => issue.id === overId,
          );

          newSprints[targetSprintIndex].issues[activeIssueIndex] =
            newSprints[targetSprintIndex].issues[overIssueIndex];
          newSprints[targetSprintIndex].issues[overIssueIndex] = activeIssue;

          return newSprints;
        });
        return;
      }

      //Drop into another sprint
      else {
        //Drop into an empty sprint
        setSprintIssues((prevSprints) => {
          const newSprints = prevSprints.map((sprint) => ({
            ...sprint,
            issues: [...sprint.issues],
          }));
          const targetSprintIndex = newSprints.findIndex(
            (sprint) => sprint.id == targetSprint?.id,
          );
          const activeSprintIndex = newSprints.findIndex(
            (sprint) => sprint.id == activeSprint?.id,
          );
          const activeIssueIndex = newSprints[
            activeSprintIndex
          ].issues.findIndex((issue) => issue.id == activeId);

          //Remove the issue from the active/original sprint
          newSprints[activeSprintIndex].issues.splice(activeIssueIndex, 1);

          if (!activeIssue) return prevSprints;

          //Drop into the target sprint
          if (isOverSprint) {
            newSprints[targetSprintIndex].issues.push(activeIssue);
          } else {
            const targetIssueIndex = newSprints[
              targetSprintIndex
            ].issues.findIndex((issue) => issue.id == overId);

            newSprints[targetSprintIndex].issues.splice(
              targetIssueIndex,
              0,
              activeIssue,
            );
          }
          return newSprints;
        });

        if (projectId) {
          if (targetSprint) {
            updateIssueAsync({
              id: activeId,
              data: {
                sprint_id: targetSprint.id === "" ? undefined : targetSprint.id,
              },
            });
          }
        }
      }
    },
    [sprintIssues, updateIssueAsync, projectId],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div ref={containerRef} className="flex h-full flex-col gap-4 p-4 pb-28">
      <Helmet>
        <title>Backlog - Task Flow</title>
      </Helmet>
      <div className="flex items-center justify-between">
        <h1 className="p-2 text-2xl font-bold text-gray-700">Backlog Page</h1>

        <Button
          onClick={() => {
            startTransition(() => {
              setIsCreateSprintModalOpen({
                isOpen: true,
                sprint: null,
              });
            });
          }}
          variant="primary"
          className="font-semibold"
        >
          Create Sprint
        </Button>
      </div>

      <PageFilter
        initialFilters={filters}
        onFiltersChange={(filter) => {
          setFilters(filter as GetIssuesParams);
        }}
      />
      {isLoadingSprints ||
      isLoadingIssues ||
      !issues.length ||
      !sprintIssues.length ? (
        <BacklogSkeleton />
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-1 gap-4 overflow-auto">
            <SortableContext
              items={sprintIssues
                .map((sprint) => sprint.id)
                .concat(
                  issues
                    .filter((issue) => ["epic", "Epic  "].includes(issue.type))
                    .map((issue) => issue.id),
                )
                .concat("no-epic")}
            >
              <div className="w-[20%]">
                <BacklogEpic issues={issues} />
              </div>

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
                      sprintIssues={sprintIssues}
                      isDragging={isDragging}
                      setIsCreateSprintModalOpen={(isOpen, sprint) => {
                        setIsCreateSprintModalOpen({ isOpen, sprint });
                      }}
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
            </SortableContext>
            {activeIssue && (
              <DragOverlay>
                <div className="inline-block">
                  <div className="flex flex-row items-center gap-3 rounded-md bg-white px-4 py-2 opacity-60">
                    <div className="flex flex-row items-center gap-1">
                      <div className="rounded-sm border-1 border-emerald-500 p-0.5">
                        <span className="text-xs font-normal text-emerald-500">
                          ✓
                        </span>
                      </div>
                      <span className="text-xs">{activeIssue.key}</span>
                    </div>
                    <span className="text-xs">{activeIssue.summary}</span>
                  </div>
                </div>
              </DragOverlay>
            )}
          </div>
        </DndContext>
      )}

      {/* Create Sprint Modal */}
      {isCreateSprintModalOpen.isOpen && (
        <CreateSprintModal
          isOpen={isCreateSprintModalOpen.isOpen}
          isEditing={isCreateSprintModalOpen.sprint ? true : false}
          onClose={() => {
            startTransition(() => {
              setIsCreateSprintModalOpen({
                isOpen: false,
                sprint: null,
              });
            });
          }}
          projectId={projectId}
        />
      )}
    </div>
  );
};

const BackLogPage: React.FC = () => {
  return (
    <OverItemProvider>
      <BackLogPageContent />
    </OverItemProvider>
  );
};

export default BackLogPage;
