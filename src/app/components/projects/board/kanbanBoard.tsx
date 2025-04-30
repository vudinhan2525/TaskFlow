import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IColumn } from "@libs/types/project";
import { IIssue } from "@libs/types/issue";
import { useParams } from "react-router-dom";
import { useAddProjectColumn, useProjectColumns } from "@libs/hooks/useProject";
import IssueCard from "@libs/app/components/projects/board/issueCard";
import { LuCirclePlus } from "react-icons/lu";

// Issue component - the draggable item
const Issue = ({ issue, isDragging }: { issue: IIssue; isDragging?: boolean }) => {
  return <IssueCard issue={issue} isDragging={isDragging} />;
};

// Sortable Issue component
const SortableIssue = ({ issue }: { issue: IIssue }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: issue.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
      <Issue issue={issue} />
    </div>
  );
};

// Column component - now droppable
const Column = ({ column }: { column: IColumn }) => {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div ref={setNodeRef} className="w-80 p-2 mx-2 bg-gray-100 rounded">
      <h2 className="p-2 mb-3 text-lg font-bold">{column.name}</h2>
      <SortableContext items={column.issues.map((issue) => issue.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-40">
          {column.issues.map((issue) => {
            if (issue.parent_id === "") {
              return <SortableIssue key={issue.id} issue={issue} />;
            }
          })}
        </div>
      </SortableContext>
    </div>
  );
};

// Kanban Board component
export default function KanbanBoard() {
  const { projectId } = useParams();
  const { columns: initialColumns } = useProjectColumns(projectId || "");
  const [columns, setColumns] = useState<IColumn[]>(initialColumns);
  const [activeIssue, setActiveIssue] = useState<IIssue | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [newColumnText, setNewColumnText] = useState("");
  const { createColumn, isSuccess } = useAddProjectColumn({
    setColumns: setColumns,
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
  useEffect(() => {
    if (isSuccess) {
      setNewColumnText("");
    }
  }, [isSuccess]);
  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Kanban Board</h1>
      <div className="flex">
        <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <SortableContext items={columns.map((col) => col.id)} strategy={verticalListSortingStrategy}>
            {columns.map((column) => (
              <Column key={column.id} column={column} />
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
                  }}
                />
              </div>
            </div>
          </SortableContext>

          <DragOverlay>{activeIssue ? <Issue issue={activeIssue} isDragging /> : null}</DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
