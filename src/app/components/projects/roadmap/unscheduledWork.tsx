import React from "react";
import { Input } from "antd";
import { X } from "lucide-react";
import { IIssue } from "@libs/types/issue";
import IssueCard from "../board/issueCard";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
interface UnscheduledWorkProps {
  handleToggleUnscheduledWork: () => void;
  unscheduledIssues: IIssue[];
  isOver?: boolean;
}
const SortableIssue = ({ issue }: { issue: IIssue }) => {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({ id: issue.id });
  const isDragging = attributes["aria-pressed"];
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    // transition,
    cursor: isDragging ? "grabbing" : "default",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab"
    >
      <IssueCard issue={issue} />
    </div>
  );
};
const UnscheduledWork: React.FC<UnscheduledWorkProps> = ({
  handleToggleUnscheduledWork,
  unscheduledIssues,
  isOver = false,
}) => {
  const { setNodeRef, isOver: isDroppableOver } = useDroppable({
    id: "unscheduled-work",
    data: { type: "unscheduled-work" },
  });
  
  return (
    <div
      ref={setNodeRef}
      className={`flex h-full w-full flex-col gap-8 rounded border p-6 shadow-xl transition-colors ${
        isOver || isDroppableOver 
          ? "border-green-500 bg-green-50" 
          : "border-gray-100 bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">
          Unscheduled work
        </h2>
        <button
          onClick={handleToggleUnscheduledWork}
          className="cursor-pointer rounded p-1 hover:bg-gray-50"
        >
          <X className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* Search + Filter */}
      <div className="space-y-2">
        <Input.Search placeholder="Search unscheduled items" allowClear />
      </div>

      {/* List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <SortableContext items={unscheduledIssues.map(issue => issue.id)}>
            {unscheduledIssues.map((issue) => (
              <SortableIssue key={issue.id} issue={issue} />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default UnscheduledWork;
