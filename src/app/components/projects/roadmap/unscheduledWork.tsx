import React, { memo } from "react";
import { Input, ConfigProvider, Popover } from "antd";
import { ChevronDown, ListFilter, X } from "lucide-react";
import { IIssue } from "@libs/types/issue";
import IssueCard from "../board/issueCard";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useProjectIssues } from "@libs/hooks/useIssue";

interface UnscheduledWorkProps {
  handleToggleUnscheduledWork: () => void;
  // unscheduledIssues: IIssue[];
  isOver?: boolean;
  projectId: string;
}
const SortableIssue = ({ issue }: { issue: IIssue }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: issue.id });

  const isDragging = attributes["aria-pressed"];

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-grab"
    >
      <div className={`${isDragging && "opacity-40"}`}>
        <IssueCard issue={issue} />
      </div>
    </div>
  );
};
const UnscheduledWork: React.FC<UnscheduledWorkProps> = memo(
  ({ handleToggleUnscheduledWork, isOver = false, projectId }) => {
    const { setNodeRef, isOver: isDroppableOver } = useDroppable({
      id: "unscheduled-work",
      data: { type: "unscheduled-work" },
    }); 
    const [isSort, setIsSort] = React.useState(false);
    const { issues, isLoading } = useProjectIssues({
      project_id: projectId,
      due_date_to: "unassigned",
      is_fetch: true,
    });

    if (isLoading) {
      return null;
    }

    return (
      <div
        ref={setNodeRef}
        className={`flex h-full w-full flex-col gap-6 rounded p-6 shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-700">
            Unscheduled work
          </h2>
          <button
            onClick={handleToggleUnscheduledWork}
            className="cursor-pointer rounded p-1 hover:bg-gray-50"
          >
            <X className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <span className="text-base text-gray-500">
          Drag each work item onto the calendar to set a due date for the work.
        </span>

        {/* Search + Filter */}
        <div className="space-y-2">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#22c55e", // xanh lá tailwind (green-500)
                colorSuccess: "#16a34a",
                colorError: "#dc2626",
                colorWarning: "#f59e0b",
                borderRadius: 8,
              },
              components: {
                Input: {
                  colorPrimaryHover: "#16a34a",
                  colorPrimaryActive: "#15803d",
                  activeBorderColor: "#22c55e",
                  hoverBorderColor: "#22c55e",
                  borderRadius: 4,
                },
                Button: {
                  borderRadius: 4,
                },
              },
            }}
          >
            <Input.Search
              size="middle"
              placeholder="Search unscheduled items"
              className="border-green-500"
              allowClear
            />
          </ConfigProvider>
        </div>

        {/* List */}
        <div
          className={`transition-color flex h-full flex-1 flex-col overflow-y-auto rounded-sm border border-gray-100 bg-gray-100 p-4 ${
            (isOver || isDroppableOver) && "border border-green-500 bg-green-50"
          }`}
        >
          <div className="mb-1 flex items-center justify-between">
            <button
              onClick={() => setIsSort(!isSort)}
              className="flex cursor-pointer items-center space-x-1 rounded-sm p-2 hover:bg-gray-200"
            >
              <p className="text-sm font-semibold text-gray-500">Most Recent</p>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 ${isSort ? "rotate-180" : ""} transition-transform duration-200`}
              />
            </button>
            <Popover
              placement="bottomRight"
              trigger="click"
              content={
                <div className="w-40 rounded-lg bg-white p-2 shadow-lg">
                 
                </div>
              }
            >
              <button className="flex cursor-pointer items-center space-x-1 rounded-sm p-2 hover:bg-gray-200">
                <ListFilter className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-semibold text-gray-500">Filters</p>
              </button>
            </Popover>
          </div>
          <SortableContext items={issues.map((issue) => issue.id)}>
            {issues.length !== 0 ? (
              <div className="space-y-1 overflow-y-auto pr-2">
                {issues
                  .sort((a, b) => {
                    if (isSort) {
                      return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                      );
                    } else {
                      return (
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                      );
                    }
                  })
                  .map((issue) => (
                    <SortableIssue key={issue.id} issue={issue} />
                  ))}
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center gap-4 border-2 border-dashed border-gray-300 p-8 text-center">
                <p className="text-md font-bold text-gray-900">
                  All works have been scheduled!
                </p>
                <span className="text-sm text-gray-400">
                  To remove a work item from the calendar, drag it back into the
                  unscheduled work panel
                </span>
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    );
  },
);

export default UnscheduledWork;
