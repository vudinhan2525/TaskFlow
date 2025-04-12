import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import IssueCard from "../../issues/issueCard";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { IIssue, IssueStatus } from "@libs/types/issue";

interface Column {
  id: string;
  title: string;
  issues: IIssue[];
}

interface KanbanBoardProps {
  issues: IIssue[];
  onIssueMove: (issueId: string, sourceColumn: string, destinationColumn: string) => void;
}

const initialColumns: Column[] = [
  { id: "todo", title: "Todo", issues: [] },
  { id: "in-progress", title: "In Progress", issues: [] },
  { id: "done", title: "Done", issues: [] },
];

const mapColumnToStatus: Record<string, IssueStatus> = {
  todo: "ToDo",
  "in-progress": "InProgress",
  done: "Done",
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ issues, onIssueMove }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [customColumnTitle, setCustomColumnTitle] = useState("");
  const [showNewColumnInput, setShowNewColumnInput] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // useEffect(() => {
  //   // Distribute issues to their respective columns based on status
  //   const distributedColumns = columns.map((column) => ({
  //     ...column,
  //     issues: issues.filter((issue) => {
  //       const columnStatus = mapColumnToStatus[column.id];
  //       return issue.status === columnStatus;
  //     }),
  //   }));
  //   setColumns(distributedColumns);
  // }, [columns, issues]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeIssueId = active.id as string;
    const overId = over.id as string;

    if (activeIssueId === overId) return;

    const sourceColumn = columns.find((col) => col.issues.some((issue) => issue.id === activeIssueId));
    const destColumn = columns.find((col) => col.issues.some((issue) => issue.id === overId));

    if (!sourceColumn || !destColumn) return;

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];

      const sourceColIndex = newColumns.findIndex((col) => col.id === sourceColumn.id);
      const destColIndex = newColumns.findIndex((col) => col.id === destColumn.id);

      const sourceIssueIndex = newColumns[sourceColIndex].issues.findIndex((issue) => issue.id === activeIssueId);
      const destIssueIndex = newColumns[destColIndex].issues.findIndex((issue) => issue.id === overId);

      const [movedIssue] = newColumns[sourceColIndex].issues.splice(sourceIssueIndex, 1);
      const updatedIssue = {
        ...movedIssue,
        status: mapColumnToStatus[destColumn.id],
      };

      newColumns[destColIndex].issues.splice(destIssueIndex, 0, updatedIssue);

      onIssueMove(updatedIssue.id, sourceColumn.id, destColumn.id);
      return newColumns;
    });

    setActiveId(null);
  };

  const addCustomColumn = () => {
    if (customColumnTitle.trim()) {
      const newColumn: Column = {
        id: customColumnTitle.toLowerCase().replace(/\s+/g, "-"),
        title: customColumnTitle,
        issues: [],
      };
      setColumns([...columns, newColumn]);
      setCustomColumnTitle("");
      setShowNewColumnInput(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Bar */}
      <div className="bg-white p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search issues..."
            className="px-3 py-2 border-gray-300 border-[1px] rounded-md w-64"
          />
          <DropdownAntd
            options={[{ value: "Sprint 1", label: "Sprint 1" }]}
            parent={<div>Select</div>}
            className="!py-2"
            menuClassName="w-[120px]"
            rowClassName="text-[15px] font-semibold"
          />
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Complete Sprint</button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Edit Sprint</button>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4">
            {columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">{column.title}</h3>
                  <SortableContext
                    items={column.issues.map((issue) => issue.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="min-h-[200px]">
                      {column.issues.map((issue) => (
                        <div key={issue.id} className="mb-3">
                          {/* <IssueCard issue={issue} /> */}
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </div>
            ))}

            {/* Add Column Button */}
            <div className="flex-shrink-0 w-80">
              {showNewColumnInput ? (
                <div className="bg-gray-100 rounded-lg p-4">
                  <input
                    type="text"
                    value={customColumnTitle}
                    onChange={(e) => setCustomColumnTitle(e.target.value)}
                    placeholder="Enter column title"
                    className="w-full px-3 py-2 border rounded-md mb-2"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={addCustomColumn}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowNewColumnInput(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewColumnInput(true)}
                  className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                >
                  <span className="text-2xl">+</span>
                </button>
              )}
            </div>
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="transform rotate-3 opacity-80">
                {/* <IssueCard issue={issues.find((issue) => issue.id === activeId)!} /> */}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
