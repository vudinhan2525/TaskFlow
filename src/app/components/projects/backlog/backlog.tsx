import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectColumns } from "@libs/hooks/useProject";
import { ISprint } from "@libs/types/index";
import { IIssue } from "@libs/types/issue";
import ScrumSprint from "@libs/app/components/projects/backlog/scrumSprint";
import {
  DndContext,
  useSensor,
  PointerSensor,
  closestCenter,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { FaCheck } from "react-icons/fa";

import BacklogSkeleton from "@libs/app/components/skeleton/backlogSkeleton";

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
  const [activeIssue, setActiveIssue] = useState<IIssue | null>(null);
  const [sprints, setSprints] = useState<ISprintIssues[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  // item = sprint or issue
  const [overItemId, setOverItemId] = useState<string | null>(null);
  const { isLoading: isLoadingColumns } = useProjectColumns({
    project_id: projectId,
  });
  const { updateIssueAsync } = useUpdateIssue({ projectId });

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const issueId = active.id as string;

    for (const sprint of sprints) {
      const issue = sprint.issues.find((i) => i.id === issueId);
      if (issue) {
        setActiveIssue(issue);
        break;
      }
    }
    setIsDragging(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;

    setOverItemId(over?.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    setActiveIssue(null);
    setOverItemId(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isOverSprint = sprints.find((sprint) =>
      sprint.issues.some((issue) => issue.id === overId),
    )
      ? false
      : true;

    // Find the sprint that the issue is being dragged over
    const targetSprint =
      sprints.find((sprint) =>
        sprint.issues.some((issue) => issue.id === overId),
      ) || sprints.find((sprint) => sprint.id === overId);
    const activeSprint = sprints.find((sprint) =>
      sprint.issues.some((issue) => issue.id === activeId),
    );

    //Drop into the same sprint
    if (targetSprint?.id == activeSprint?.id) {
      if (targetSprint?.id == overId) return;
      setSprints((prevSprints) => {
        const newSprints = prevSprints.map((sprint) => ({
          ...sprint,
          issues: [...sprint.issues],
        }));
        const targetSprintIndex = newSprints.findIndex(
          (sprint) => sprint.id === targetSprint?.id,
        );

        const activeIssueIndex = newSprints[targetSprintIndex].issues.findIndex(
          (issue) => issue.id === activeId,
        );
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
      setSprints((prevSprints) => {
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
        const activeIssueIndex = newSprints[activeSprintIndex].issues.findIndex(
          (issue) => issue.id == activeId,
        );

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
              sprint_id: targetSprint.id === "" ? "null" : targetSprint.id,
            },
          });
        }
      }
    }
  };

  if (isLoadingColumns || isLoadingSprints || isLoadingIssues) {
    return <BacklogSkeleton />;
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        strategy={horizontalListSortingStrategy}
        items={sprints.map((sprint: ISprintIssues) => sprint.id)}
      >
        {/* Sprint List */}

        <div className="flex min-w-[650px] flex-col gap-2 overflow-x-auto">
          {sprints?.map((sprint: ISprintIssues) => (
            <ScrumSprint
              key={sprint.id}
              sprint={sprint}
              projectId={projectId}
              overItemId={overItemId}
              isDragging={isDragging}
            />
          ))}
        </div>
      </SortableContext>

      {activeIssue && (
        <DragOverlay>
          <IssueCardOverlay issue={activeIssue} />
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default memo(BackLog);

const IssueCardOverlay = memo(({ issue }: { issue: IIssue }) => {
  return (
    <div className="inline-block">
      <div className="flex flex-row items-center gap-3 rounded-md bg-white px-4 py-2 opacity-60">
        <div className="flex flex-row items-center gap-1">
          <div className="rounded-sm border-1 border-emerald-500 p-0.5">
            <FaCheck className="font-normal text-emerald-500" size={12} />
          </div>
          <span className="text-xs">{issue.key}</span>
        </div>
        <span className="text-xs">{issue.summary}</span>
      </div>
    </div>
  );
});
