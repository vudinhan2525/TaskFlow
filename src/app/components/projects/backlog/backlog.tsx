import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { useProjectColumns } from "@libs/hooks/useProject";
import { ISprint } from "@libs/types/index";
import { IIssue } from "@libs/types/issue";
import ScrumSprint from "@libs/app/components/projects/backlog/scrumPrint";
import CreateSprintModal from "@libs/app/components/projects/modals/createSprintModal";
import Button from "@libs/app/components/general-components/button";
import IssueSideBar from "@libs/app/components/issues/IssueSideBar";
// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  // sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useUpdateIssue } from "@libs/hooks/useIssue";

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

const BackLog = ({
  initialSprints,
  initialIssues,
  isLoadingSprints,
  isLoadingIssues,
}: {
  initialSprints: ISprint[];
  initialIssues: IIssue[];
  isLoadingSprints: boolean;
  isLoadingIssues: boolean;
}) => {
  const { projectId = "" } = useParams();
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const { selectIssue } = useIssueSelection();
  const [activeIssue, setActiveIssue] = useState<IIssue | null>(null);
  const [activeSprint, setActiveSprint] = useState<ISprint | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<{
    [key: string]: boolean;
  }>({});
  const [sprints, setSprints] = useState<ISprintIssues[]>([]);

  useEffect(() => {
    setSprints(
      [...initialSprints, backLogSprint].map((sprint: ISprint) => {
        return {
          ...sprint,
          issues: initialIssues.filter(
            (issue: IIssue) => issue.sprint_id === sprint.id,
          ),
        };
      }),
    );
  }, [initialIssues, initialSprints]);
  const { isLoading: isLoadingColumns } = useProjectColumns(projectId);
  const { updateIssueAsync } = useUpdateIssue({ projectId });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleIssueSelect = (
    issueId: string,
    selected: boolean,
    issue?: IIssue,
  ) => {
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

  if (isLoadingColumns || isLoadingSprints || isLoadingIssues) {
    return <div>Loading...</div>;
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const issueId = active.id as string;

    for (const sprint of sprints) {
      const issue = sprint.issues.find((i) => i.id === issueId);
      if (issue) {
        setActiveIssue(issue);
        setActiveSprint(sprint);
        break;
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activeIssue) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isOverSprint = sprints.some(
      (sprint: ISprint) => sprint.id === overId,
    );
    if (isOverSprint) {
      console.log("Dropped onto a column");
      // We're dropping onto a column directly
      setSprints((prevSprints) => {
        // Find which column the active issue belongs to
        const sourceColumnIndex = prevSprints.findIndex((sprint) =>
          sprint.issues.some((issue) => issue.id === activeId),
        );

        if (sourceColumnIndex === -1) return prevSprints;

        // Remove from the source column
        const newSprints = [...prevSprints];
        const activeIssue = newSprints[sourceColumnIndex].issues.find(
          (issue: IIssue) => issue.id === activeId,
        );

        if (!activeIssue) return prevSprints;

        newSprints[sourceColumnIndex] = {
          ...newSprints[sourceColumnIndex],
          issues: newSprints[sourceColumnIndex].issues.filter(
            (issue: IIssue) => issue.id !== activeId,
          ),
        };

        // Add to the target column (at the end)
        const targetColumnIndex = sprints.findIndex(
          (sprint: ISprintIssues) => sprint.id === overId,
        );

        if (targetColumnIndex === -1) return prevSprints;

        newSprints[targetColumnIndex] = {
          ...newSprints[targetColumnIndex],
          issues: [...newSprints[targetColumnIndex].issues, activeIssue],
        };

        return newSprints;
      });
      return;
    }

    let overSprintId = null;
    let overIssue = null;

    for (const sprint of sprints) {
      overIssue = sprint.issues.find((issue) => issue.id === overId);
      if (overIssue) {
        overSprintId = sprint.id;
        break;
      }
    }

    if (!overSprintId || !overIssue) return;
    if (activeSprint?.id === overSprintId) return;

    const prevSprint = [...sprints];

    const sourceSprintIndex = prevSprint.findIndex(
      (sprint) => sprint.id === activeSprint?.id,
    );

    const targetSprintIndex = prevSprint.findIndex(
      (sprint) => sprint.id === overSprintId,
    );

    if (sourceSprintIndex === -1 || targetSprintIndex === -1) return prevSprint;

    const issueToMove = prevSprint[sourceSprintIndex].issues.find(
      (issue) => issue.id === activeIssue?.id,
    );

    if (!issueToMove) return prevSprint;

    const newSprints = [...prevSprint];

    newSprints[sourceSprintIndex] = {
      ...newSprints[sourceSprintIndex],
      issues: newSprints[sourceSprintIndex].issues.filter(
        (issue) => issue.id !== activeIssue?.id,
      ),
    };

    const overSprintIndex = newSprints.findIndex(
      (sprint) => sprint.id === overSprintId,
    );

    newSprints[overSprintIndex] = {
      ...newSprints[overSprintIndex],
      issues: [...newSprints[overSprintIndex].issues, issueToMove],
    };

    setSprints(newSprints);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveIssue(null);
    setActiveSprint(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Update issue status in backend
    if (projectId) {
      const targetSprint = sprints.find((sprint) =>
        sprint.issues.some((issue) => issue.id === overId),
      );
      if (targetSprint) {
        updateIssueAsync({
          id: activeId,
          data: {
            sprint_id: targetSprint.id === "" ? "null" : targetSprint.id,
          },
        });
      }
    }
    if (activeId === overId) return;

    const isOverSprint = sprints.some((sprint) => sprint.id === overId);

    if (isOverSprint) {
      return;
    }
    // We're dropping onto another issue
    setSprints((prevSprints) => {
      // Find the column containing our active issue
      const activeSprintIndex = prevSprints.findIndex((sprint) =>
        sprint.issues.some((issue) => issue.id === activeId),
      );

      // Find the column containing the issue we're dropping onto
      const overSprintIndex = prevSprints.findIndex((sprint) =>
        sprint.issues.some((issue) => issue.id === overId),
      );

      if (activeSprintIndex === -1 || overSprintIndex === -1)
        return prevSprints;

      // Same column reordering
      if (activeSprintIndex === overSprintIndex) {
        const sprint = prevSprints[activeSprintIndex];
        const oldIndex = sprint.issues.findIndex(
          (issue) => issue.id === activeId,
        );
        const newIndex = sprint.issues.findIndex(
          (issue) => issue.id === overId,
        );

        const newSprints = [...prevSprints];
        newSprints[activeSprintIndex] = {
          ...sprint,
          issues: arrayMove(sprint.issues, oldIndex, newIndex),
        };

        return newSprints;
      }

      return prevSprints; // Cross-column movement was handled in dragOver
    });
  };

  return (
    // <PanelGroup autoSaveId="backlog-panel-group" direction="horizontal">
    //   <Panel defaultSize={25}>
        <div className="flex">

        <div className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Backlog</h1>
            <Button
              onClick={() => setIsCreateSprintModalOpen(true)}
              variant="primary"
            >
              Create Sprint
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={sprints.map((sprint: ISprintIssues) => sprint.id)}
            >
              {/* Sprint List */}

              <div className="flex flex-col gap-2">
                {sprints?.map((sprint: ISprintIssues) => (
                  <ScrumSprint
                    key={sprint.id}
                    sprint={sprint}
                    projectId={projectId}
                    selectedIssues={selectedIssues}
                    onIssueSelect={handleIssueSelect}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Create Sprint Modal */}
          <CreateSprintModal
            isOpen={isCreateSprintModalOpen}
            onClose={() => setIsCreateSprintModalOpen(false)}
            projectId={projectId}
          />
        </div>
        <IssueSideBar />
        </div>

    //   </Panel>
    //   <PanelResizeHandle className="w-1 cursor-col-resize bg-gray-300" />
    //   <Panel defaultSize={75}>
    //   </Panel>
    // </PanelGroup>
  );
};

export default BackLog;
