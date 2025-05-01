import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IColumn } from "@libs/types/project";
import { IIssue } from "@libs/types/issue";
import { useParams } from "react-router-dom";
import { useAddProjectColumn, useProjectColumns } from "@libs/hooks/useProject";
import { LuCirclePlus } from "react-icons/lu";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { KanbanColumn } from "@libs/app/components/projects/board/kanbanColumn";

export default function KanbanBoard() {
  const { projectId } = useParams();
  const { columns: initialColumns } = useProjectColumns(projectId || "");
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
    })
  );

  // When drag starts, set the active issue
  const handleDragStart = (event: DragStartEvent) => {
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
  };

  // Handler for when item is dragged over a droppable area
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activeIssue) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Don't do anything if we're hovering over ourselves
    if (activeId === overId) return;
    // Check if we're hovering over a column
    const isOverColumn = columns.some((col) => col.id === overId);
    if (isOverColumn) {
      // We're dropping onto a column directly
      setColumns((prevColumns) => {
        // Find which column the active issue belongs to
        const sourceColumnIndex = prevColumns.findIndex((column) => column.issues.some((issue) => issue.id === activeId));

        if (sourceColumnIndex === -1) return prevColumns;

        // Remove from the source column
        const newColumns = [...prevColumns];
        const activeIssue = newColumns[sourceColumnIndex].issues.find((issue) => issue.id === activeId);

        if (!activeIssue) return prevColumns;

        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          issues: newColumns[sourceColumnIndex].issues.filter((issue) => issue.id !== activeId),
        };

        // Add to the target column (at the end)
        const targetColumnIndex = prevColumns.findIndex((column) => column.id === overId);

        if (targetColumnIndex === -1) return prevColumns;

        newColumns[targetColumnIndex] = {
          ...newColumns[targetColumnIndex],
          issues: [...newColumns[targetColumnIndex].issues, activeIssue],
        };

        return newColumns;
      });
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

      const sourceColumnIndex = prevColumns.findIndex((column) => column.issues.some((issue) => issue.id === activeId));

      // Find the target column index
      const targetColumnIndex = prevColumns.findIndex((column) => column.id === overColumnId);

      if (sourceColumnIndex === -1 || targetColumnIndex === -1) return prevColumns;

      // Get the active issue
      const issueToMove = prevColumns[sourceColumnIndex].issues.find((issue) => issue.id === activeId);

      if (!issueToMove) return prevColumns;

      // Create new columns array
      const newColumns = [...prevColumns];

      // Remove from source
      newColumns[sourceColumnIndex] = {
        ...newColumns[sourceColumnIndex],
        issues: newColumns[sourceColumnIndex].issues.filter((issue) => issue.id !== activeId),
      };

      // Find where to insert in target
      const overIssueIndex = newColumns[targetColumnIndex].issues.findIndex((issue) => issue.id === overId);
      // Insert in target
      newColumns[targetColumnIndex] = {
        ...newColumns[targetColumnIndex],
        issues: [...newColumns[targetColumnIndex].issues.slice(0, overIssueIndex + 1), issueToMove, ...newColumns[targetColumnIndex].issues.slice(overIssueIndex + 1)],
      };
      setColumns(newColumns);
    }
  };

  // When drag ends
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveIssue(null);
    setActiveColumn(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Update issue status in backend
    if (projectId) {
      const targetColumn = columns.find((col) => col.issues.some((issue) => issue.id === overId));
      if (targetColumn) {
        updateIssue({
          id: activeId,
          data: {
            status: targetColumn.name,
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
      const activeColumnIndex = prevColumns.findIndex((column) => column.issues.some((issue) => issue.id === activeId));

      // Find the column containing the issue we're dropping onto
      const overColumnIndex = prevColumns.findIndex((column) => column.issues.some((issue) => issue.id === overId));

      if (activeColumnIndex === -1 || overColumnIndex === -1) return prevColumns;

      // Same column reordering
      if (activeColumnIndex === overColumnIndex) {
        const column = prevColumns[activeColumnIndex];
        const oldIndex = column.issues.findIndex((issue) => issue.id === activeId);
        const newIndex = column.issues.findIndex((issue) => issue.id === overId);

        const newColumns = [...prevColumns];
        newColumns[activeColumnIndex] = {
          ...column,
          issues: arrayMove(column.issues, oldIndex, newIndex),
        };

        return newColumns;
      }

      return prevColumns; // Cross-column movement was handled in dragOver
    });
  };

  useEffect(() => {
    if (initialColumns.length > 0) {
      setColumns(initialColumns);
    }
  }, [initialColumns]);
  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Kanban Board</h1>
      <div className="flex">
        <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <SortableContext items={columns.map((col) => col.id)} strategy={verticalListSortingStrategy}>
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} setColumns={setColumns} columns={columns} projectId={projectId} />
            ))}
            <div className="bg-gray-100 rounded-lg h-[200px] p-4 w-80 relative ">
              <input
                id="email-address"
                autoComplete="email"
                onChange={(e) => {
                  setNewColumnText(e.target.value);
                }}
                placeholder="New Stage"
                className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              />
              <div className="flex items-center justify-center absolute left-[50%] translate-y-[-50%] translate-x-[-50%] top-[60%]">
                <LuCirclePlus
                  className="text-4xl text-gray-600 cursor-pointer"
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
          {/* <DragOverlay>{activeIssue ? <Issue issue={activeIssue} isDragging /> : null}</DragOverlay> */}
        </DndContext>
      </div>
    </div>
  );
}
