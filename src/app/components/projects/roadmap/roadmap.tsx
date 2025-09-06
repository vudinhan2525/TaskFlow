import TaskItem from "./task-item";
import { IIssue } from "@libs/types/issue";
import RoadmapSkeleton from "../../skeleton/roadmapSkeleton";
import { SortableContext } from "@dnd-kit/sortable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Popover } from "antd";
import { X } from "lucide-react";
import dayjs from "dayjs";

interface RoadmapProps {
  calendarDays: Record<string, IIssue[]>;
  isLoadingProjectIssues: boolean;
  activeDate: string;
}

const Roadmap: React.FC<RoadmapProps> = ({
  isLoadingProjectIssues,
  calendarDays,
  activeDate,
}) => {
  return (
    <div className="flex h-full w-full flex-col space-y-6 bg-white pb-32">
      {isLoadingProjectIssues ? (
        <RoadmapSkeleton />
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="flex flex-1 flex-col overflow-auto pr-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-5">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                // "Saturday",
                // "Sunday",
              ].map((day) => (
                <div
                  key={day}
                  className={`rounded-t-xs border border-b-0 border-gray-300 bg-gray-50 py-2 text-center text-sm font-semibold text-gray-600`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-5">
              {/* Hello workd */}
              {Object.keys(calendarDays)

                .map((dateStr: string) => (
                  <DropableDate
                    key={dateStr}
                    dateStr={dateStr}
                    issues={calendarDays[dateStr]}
                    isActive={activeDate === dateStr}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Roadmap;
const SortableIssue = ({ issue }: { issue: IIssue }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: issue.id,
  });
  const isDragging = attributes["aria-pressed"];

  return (
    <div
      ref={setNodeRef}
      // style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab"
    >
      <TaskItem issue={issue} isDragging={isDragging} />
    </div>
  );
};

const DropableDate = ({
  dateStr,
  issues,
  isActive,
}: {
  dateStr: string;
  issues: IIssue[];
  isActive: boolean;
}) => {
  const { setNodeRef } = useDroppable({
    id: dateStr,
    data: {
      type: "date",
      date: dateStr,
    },
  });

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isWeekend = (date: Date): boolean => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <div ref={setNodeRef}>
      <SortableContext items={issues.map((issue) => issue.id)}>
        <div
          className={`h-36 overflow-hidden border p-2 hover:cursor-pointer hover:bg-gray-100 ${isToday(new Date(dateStr)) ? "border-green-500 bg-green-50" : "border-gray-200"} ${isWeekend(new Date(dateStr)) ? "hidden bg-gray-100" : ""} ${isActive ? "bg-green-100" : ""}`}
        >
          <span
            className={`mb-2 inline-flex text-sm font-medium text-gray-600 ${isToday(new Date(dateStr)) ? "rounded-md bg-green-200 px-2 font-semibold text-gray-800" : ""} `}
          >
            {new Date(dateStr).getDate()}
          </span>

          {/* Hiển thị tối đa 2 issue */}
          <div className="flex flex-col gap-1">
            {issues.slice(0, 2).map((issue) => (
              <SortableIssue key={issue.id} issue={issue} />
            ))}
          </div>

          {/* Nếu còn dư thì show Popover */}
          {issues.length > 2 && (
            <Popover
              placement="top"
              trigger="click"
              content={
                <div className="flex w-full max-w-56 flex-col gap-2 overflow-auto p-2 shadow-lg">
                  <div className="flex flex-row items-center justify-between">
                    <h5 className="text-md text-gray-00 font-semibold">
                      {dayjs()
                        .month(new Date(dateStr).getMonth())
                        .format("MMMM")}{" "}
                      {new Date(dateStr).getDate()}
                    </h5>
                    <button
                      onClick={() => {
                        // Handle button click
                      }}
                      className="cursor-pointer rounded-sm border border-green-500 p-0.5"
                    >
                      <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>

                  {issues.map((issue) => (
                    <SortableIssue key={issue.id} issue={issue} />
                  ))}
                </div>
              }
            >
              <div className="mt-2 cursor-pointer rounded-sm px-2 py-1 text-xs text-gray-500 hover:bg-gray-300">
                +{issues.length - 2} more
              </div>
            </Popover>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
