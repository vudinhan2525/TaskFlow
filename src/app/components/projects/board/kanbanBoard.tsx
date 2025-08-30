import { useEffect, useState, useCallback } from "react";
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
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IColumn } from "@libs/types/project";
import { IIssue } from "@libs/types/issue";
import { useParams } from "react-router-dom";
import { useAddProjectColumn, useProjectColumns } from "@libs/hooks/useProject";
import { LuCirclePlus } from "react-icons/lu";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { KanbanColumn } from "@libs/app/components/projects/board/kanbanColumn";
import IssueCard from "./issueCard";
import PageFilter from "@libs/app/components/general-components/pageFilter";
import KanbanBoardSkeleton from "../../skeleton/kanbanBoardSkeleton";

export default function KanbanBoard() {
  const { projectId } = useParams();
  const { columns: initialColumns, isLoading } = useProjectColumns(
    projectId || "",
  );
  const [columns, setColumns] = useState<IColumn[]>(initialColumns);
  const [activeIssue, setActiveIssue] = useState<IIssue | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const [newColumnText, setNewColumnText] = useState("");

  const { createColumn } = useAddProjectColumn({
    setColumns: setColumns,
  });

  const { updateIssue } = useUpdateIssue({
    projectId: projectId || "",
    isNotToasting: true,
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // When drag starts, set the active issue
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const issueId = active.id as string;

      // Find the active issue across all columns
      for (const column of columns) {
        const issue = column.issues.find((issue) => issue.id === issueId);
        if (issue) {
          setActiveIssue(issue);
          setActiveColumn(column.id);
          break;
        }
      }
    },
    [columns, activeIssue],
  );

  // Handler for when item is dragged over a droppable area
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over || !activeIssue) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId === overId) {
        return;
      }
      // Check if we're hovering over a column
      const isOverColumn = columns.some((col) => col.id === overId);
      if (isOverColumn) {
        // We're dropping onto a column directly
        setColumns((prevColumns) => {
          // Find which column the active issue belongs to
          const sourceColumnIndex = prevColumns.findIndex((column) =>
            column.issues.some((issue) => issue.id === activeId),
          );

          if (sourceColumnIndex === -1) return prevColumns;

          // Remove from the source column
          const newColumns = [...prevColumns];
          const activeIssue = newColumns[sourceColumnIndex].issues.find(
            (issue) => issue.id === activeId,
          );

          if (!activeIssue) return prevColumns;

          newColumns[sourceColumnIndex] = {
            ...newColumns[sourceColumnIndex],
            issues: newColumns[sourceColumnIndex].issues.filter(
              (issue) => issue.id !== activeId,
            ),
          };

          // Add to the target column (at the end)
          const targetColumnIndex = prevColumns.findIndex(
            (column) => column.id === overId,
          );

          if (targetColumnIndex === -1) return prevColumns;

          newColumns[targetColumnIndex] = {
            ...newColumns[targetColumnIndex],
            issues: [...newColumns[targetColumnIndex].issues, activeIssue],
          };

          return newColumns;
        });
        setActiveColumn(overId);
        return;
      }

      // We're over an issue
      // Find out which column the over issue belongs to
      let overColumnId = null;
      let overIssue = null;

      for (const column of columns) {
        overIssue = column.issues.find((issue) => issue.id === overId);
        if (overIssue) {
          overColumnId = column.id;
          break;
        }
      }

      if (!overColumnId || !overIssue) return;

      // Only proceed if we're over a different column or we're reordering within the same column
      if (activeColumn !== overColumnId) {
        const prevColumns = [...columns];
        const sourceColumnIndex = prevColumns.findIndex((column) =>
          column.issues.some((issue) => issue.id === activeId),
        );

        // Find the target column index
        const targetColumnIndex = prevColumns.findIndex(
          (column) => column.id === overColumnId,
        );

        if (sourceColumnIndex === -1 || targetColumnIndex === -1) {
          return prevColumns;
        }

        // Get the active issue
        const issueToMove = prevColumns[sourceColumnIndex].issues.find(
          (issue) => issue.id === activeId,
        );

        if (!issueToMove) return prevColumns;

        // Create new columns array
        const newColumns = [...prevColumns];

        // Remove from source
        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          issues: newColumns[sourceColumnIndex].issues.filter(
            (issue) => issue.id !== activeId,
          ),
        };

        // Find where to insert in target
        const overIssueIndex = newColumns[targetColumnIndex].issues.findIndex(
          (issue) => issue.id === overId,
        );
        // Insert in target
        newColumns[targetColumnIndex] = {
          ...newColumns[targetColumnIndex],
          issues: [
            ...newColumns[targetColumnIndex].issues.slice(
              0,
              overIssueIndex + 1,
            ),
            issueToMove,
            ...newColumns[targetColumnIndex].issues.slice(overIssueIndex + 1),
          ],
        };
        setActiveColumn(newColumns[targetColumnIndex].id);
        setColumns(newColumns);
      }
    },
    [columns, activeIssue],
  );

  // When drag ends
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveIssue(null);
      setActiveColumn(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Update issue status in backend
      if (projectId) {
        const targetColumn = columns.find((col) =>
          col.issues.some((issue) => issue.id === overId),
        );
        if (targetColumn) {
          updateIssue({
            id: activeId,
            data: {
              column_id: targetColumn.id,
            },
          });
        }
      }
      if (activeId === overId) return;

      const isOverColumn = columns.some((col) => col.id === overId);

      if (isOverColumn) {
        return;
      }
      // We're dropping onto another issue
      setColumns((prevColumns) => {
        // Find the column containing our active issue
        const activeColumnIndex = prevColumns.findIndex((column) =>
          column.issues.some((issue) => issue.id === activeId),
        );

        // Find the column containing the issue we're dropping onto
        const overColumnIndex = prevColumns.findIndex((column) =>
          column.issues.some((issue) => issue.id === overId),
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1)
          return prevColumns;

        // Same column reordering
        if (activeColumnIndex === overColumnIndex) {
          const column = prevColumns[activeColumnIndex];
          const oldIndex = column.issues.findIndex(
            (issue) => issue.id === activeId,
          );
          const newIndex = column.issues.findIndex(
            (issue) => issue.id === overId,
          );

          const newColumns = [...prevColumns];
          newColumns[activeColumnIndex] = {
            ...column,
            issues: arrayMove(column.issues, oldIndex, newIndex),
          };

          return newColumns;
        }

        return prevColumns; // Cross-column movement was handled in dragOver
      });
    },
    [columns, activeIssue],
  );

  useEffect(() => {
    if (initialColumns.length > 0) {
      setColumns(initialColumns);
    }
  }, [initialColumns]);
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="p-2 text-2xl font-bold text-gray-700">Kanban Board</h1>
      <PageFilter />
      {(isLoading || columns.length === 0) ? (
        <KanbanBoardSkeleton />
      ) : (
        <div className="flex">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  setColumns={setColumns}
                  columns={columns}
                  projectId={projectId}
                />
              ))}
              <div className="relative h-[200px] w-80 rounded-lg bg-gray-100 p-4">
                <input
                  id="email-address"
                  autoComplete="email"
                  onChange={(e) => {
                    setNewColumnText(e.target.value);
                  }}
                  placeholder="New Stage"
                  className={`relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm`}
                />
                <div className="absolute top-[60%] left-[50%] flex translate-x-[-50%] translate-y-[-50%] items-center justify-center">
                  <LuCirclePlus
                    className="cursor-pointer text-4xl text-gray-600"
                    onClick={() => {
                      if (!newColumnText || !projectId) {
                        return;
                      }
                      createColumn({
                        name: newColumnText,
                        projectId: projectId,
                      });
                      setNewColumnText("");
                    }}
                  />
                </div>
              </div>
            </SortableContext>
            <DragOverlay>
              {activeIssue ? (
                <IssueCard issue={activeIssue} isDragging={false} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
}
