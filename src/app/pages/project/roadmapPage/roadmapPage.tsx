import React, {
  useState,
  useMemo,
  useTransition,
  useCallback,
  useEffect,
  lazy,
} from "react";
import Roadmap from "@libs/app/components/projects/roadmap/roadmap";
import { useParams } from "react-router-dom";
import PageFilter from "@libs/app/components/general-components/pageFilter";
import { GetIssuesParams } from "@libs/types/issue";
import { useProjectIssues } from "@libs/hooks/useIssue";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { IIssue } from "@libs/types/issue";
import TaskItem from "@libs/app/components/projects/roadmap/task-item";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
  MouseSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import RoadmapFilter from "@libs/app/components/projects/roadmap/roadmapFilter";
const UnscheduledWork = lazy(
  () => import("@libs/app/components/projects/roadmap/unscheduledWork"),
);
import { useUpdateIssue } from "@libs/hooks/useIssue";

const RoadmapPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [currentDate, setCurrentDate] = useState(new Date("2025-08-30"));
  const [isOpenUnscheduledWork, setIsOpenUnscheduledWork] = useState(true);
  const [activeIssue, setActiveIssue] = useState<IIssue | null>(null);
  const [overDate, setIsoverDate] = useState("");
  const [filters, setFilters] = useState<GetIssuesParams>({
    project_id: projectId || "",
  });
  const { updateIssue } = useUpdateIssue({ projectId: projectId || "" });

  const [_, startTransition] = useTransition();

  const { issues, isLoading: isLoadingProjectIssues } =
    useProjectIssues(filters);

  // Group tasks by date
  const getIssuesForDate = useCallback(
    (date: Date): IIssue[] => {
      return issues.filter((issue) => {
        const issueDate = new Date(issue.due_date_to);
        return (
          issueDate.getDate() === date.getDate() &&
          issueDate.getMonth() === date.getMonth() &&
          issueDate.getFullYear() === date.getFullYear()
        );
      });
    },
    [issues],
  );
  const [calendarDays, setCalendarDays] = useState<Record<string, IIssue[]>>(
    {},
  );
  useEffect(() => {
    const date = new Date(currentDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Find first Sunday (may be in previous month)
    const startDate = new Date(firstDay);
    while (startDate.getDay() !== 0) {
      // 0 represents Sunday
      startDate.setDate(startDate.getDate() - 1);
    }

    // Find last Saturday (may be in next month)
    const endDate = new Date(lastDay);
    while (endDate.getDay() !== 6) {
      // 6 represents Saturday
      endDate.setDate(endDate.getDate() + 1);
    }

    // Generate all days between start and end
    const days: Record<string, IIssue[]> = {};
    const iterDate = new Date(startDate);

    while (iterDate <= endDate) {
      if (iterDate.getDay() !== 0 && iterDate.getDay() !== 6)
        // Skip Sundays and Saturdays
        days[iterDate.toISOString()] = getIssuesForDate(iterDate);
      iterDate.setDate(iterDate.getDate() + 1);
    }
    setCalendarDays(days);
  }, [currentDate, issues]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor),
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeIssue = issues.find((issue) => issue.id === active.id);
    setActiveIssue(activeIssue!);
  };
  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || !activeIssue) return;

    const overId = over.id as string;
    const activeId = active.id as string;
    if (overId === activeId) return;
    if (overId == "unscheduled-work") {
      console.log(overId);
      setIsoverDate("unscheduled-work");
      return;
    }

    const isOverDate = Object.keys(calendarDays).findIndex(
      (date) => date === overId,
    );
    if (isOverDate >= 0) {
      setIsoverDate(overId);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveIssue(null);
    setIsoverDate("");

    const { active, over } = e;
    if (!over || !activeIssue) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log("update", overId);
    if (overId === "unscheduled-work") {
      console.log("Unscheduled work");
      updateIssue({
        id: activeId,
        data: {
          due_date_to: "null",
        },
      });
      return;
    }

    const isOverDate = Object.keys(calendarDays).findIndex(
      (date) => date === overId,
    );

    if (isOverDate >= 0) {
      const oldDate = Object.keys(calendarDays).find((date) =>
        calendarDays[date].includes(activeIssue as IIssue),
      );
      if (oldDate && oldDate !== overId) {
        calendarDays[oldDate!].splice(
          calendarDays[oldDate!].indexOf(activeIssue as IIssue),
          1,
        );
      }
      calendarDays[overId].push(activeIssue as IIssue);
      updateIssue({
        id: activeId,
        data: {
          due_date_to: new Date(overId).toISOString(),
        },
      });
    }

    console.log("Dragging over:", overId);
  };

  const goToToday = () => setCurrentDate(new Date());
  const previousMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const handleToggleUnscheduledWork = () => {
    startTransition(() => {
      setIsOpenUnscheduledWork(!isOpenUnscheduledWork);
    });
  };

  // const scheduledIssues: IIssue[] = useMemo(() => {
  //   return issues.filter((issue) => issue.due_date_to);
  // }, [issues]);
  const unscheduledIssues: IIssue[] = useMemo(() => {
    return issues.filter((issue) => !issue.due_date_to);
  }, [issues]);

  return (
    <div className="flex h-full w-full flex-col gap-6 bg-white p-6 pb-32">
      <h1 className="text-2xl font-bold text-gray-700">Roadmap Page</h1>

      <div className="flex flex-1 overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={Object.keys(calendarDays)
              .map((dateStr: string) => dateStr)
              .concat("unscheduled-work")}
          >
            <PanelGroup
              className="flex w-full flex-1"
              autoSaveId="backlog-panel-group"
              direction="horizontal"
            >
              <Panel
                id="roadmap-panel"
                order={1}
                defaultSize={isOpenUnscheduledWork ? 70 : 100}
                minSize={60}
                maxSize={100}
              >
                <div className="flex h-full flex-col gap-6 pr-4">
                  <RoadmapFilter
                    SearchRoadmap={PageFilter}
                    setSearchParams={setFilters}
                    goToToday={goToToday}
                    previousMonth={previousMonth}
                    currentDate={currentDate}
                    nextMonth={nextMonth}
                    handleToggleUnscheduledWork={handleToggleUnscheduledWork}
                  />

                  <Roadmap
                    isLoadingProjectIssues={isLoadingProjectIssues}
                    calendarDays={calendarDays}
                    activeDate={overDate}
                  />
                </div>
              </Panel>

              {isOpenUnscheduledWork && (
                <PanelResizeHandle
                  style={{
                    backgroundColor: "oklch(0.696 0.17 162.48)",
                  }}
                  className="backlog--panel-resize-handle relative w-[2px] cursor-col-resize bg-gray-300 pl-[2px] text-emerald-500 opacity-0 hover:opacity-100"
                />
              )}

              {isOpenUnscheduledWork && (
                <Panel
                  id="unscheduled-work-panel"
                  order={2}
                  defaultSize={30}
                  maxSize={40}
                  minSize={20}
                >
                  <div className="h-full overflow-y-auto p-1">
                    <UnscheduledWork
                      handleToggleUnscheduledWork={handleToggleUnscheduledWork}
                      unscheduledIssues={unscheduledIssues}
                      isOver={overDate === "unscheduled-work"}
                    />
                  </div>
                </Panel>
              )}
            </PanelGroup>
          </SortableContext>
          <DragOverlay>
            {activeIssue ? <TaskItem issue={activeIssue} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default RoadmapPage;
