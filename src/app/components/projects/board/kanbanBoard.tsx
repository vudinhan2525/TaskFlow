import React, { CSSProperties, useEffect } from "react";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
// import IssueCard from "../../issues/issueCard";
import DropdownAntd from "@libs/app/components/general-components/dropdown";
import { useParams } from "react-router-dom";
import { useProjectColumns } from "@libs/hooks/useProject";
import IssueCard from "@libs/app/components/projects/board/issueCard";
import { IIssue } from "@libs/types/issue";
import { LuCirclePlus } from "react-icons/lu";
import { IColumn } from "@libs/types/project";
import { CSS } from "@dnd-kit/utilities";
interface KanbanBoardProps {
  issues: IIssue[];
  onIssueMove: (issueId: string, sourceColumn: string, destinationColumn: string) => void;
}
export const KanbanBoard: React.FC<KanbanBoardProps> = ({ issues }) => {
  // const [activeId, setActiveId] = useState<string | null>(null);
  const { projectId } = useParams();
  const { columns } = useProjectColumns(projectId || "");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeIssueId = active.id as string;
    const overId = over.id as string;

    if (activeIssueId === overId) return;
  };
  useEffect(() => {}, [issues]);
  return (
    <div className="flex flex-col h-full">
      {/* Navigation Bar */}
      <div className="bg-white p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <input type="text" placeholder="Search issues..." className="px-3 py-2 border-gray-300 border-[1px] rounded-md w-64" />
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
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <SortableContext items={columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-8">
              {columns.map((column) => (
                <DraggableColumn key={column.id} column={column} />
              ))}
              <div className="bg-gray-100 rounded-lg h-[200px] p-4 w-80 relative ">
                <input
                  id="email-address"
                  autoComplete="email"
                  onChange={() => {}}
                  placeholder="New Stage"
                  className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 shadow-md text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                />
                <div className="flex items-center justify-center absolute left-[50%] translate-y-[-50%] translate-x-[-50%] top-[60%]">
                  <LuCirclePlus className="text-3xl text-gray-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
const DraggableColumn = ({ column }: { column: IColumn }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
  });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeIssueId = active.id as string;
    const overId = over.id as string;

    if (activeIssueId === overId) return;
  };
  return (
    <div ref={setNodeRef} style={style} className="bg-gray-100 min-h-[200px] rounded-lg p-4 w-80 relative">
      <div className="mb-4 font-semibold cursor-grab active:cursor-grabbing" {...listeners} {...attributes}>
        {column.name}
      </div>
      <div className="min-h-[200px]">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <SortableContext items={column.issues.map((issue) => issue.id)} strategy={verticalListSortingStrategy}>
            {column.issues.map((issue) => (
              <IssueDragable issue={issue} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
const IssueDragable = ({ issue }: { issue: IIssue }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: issue.id,
  });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <IssueCard issue={issue} />
    </div>
  );
};
export default KanbanBoard;
