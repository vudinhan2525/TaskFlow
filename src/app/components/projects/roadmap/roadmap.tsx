import TaskItem from "./task-item";
import { IIssue } from "@libs/types/issue";
import RoadmapSkeleton from "../../skeleton/roadmapSkeleton";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
interface RoadmapProps {
  calendarDays: Record<string, IIssue[]>;
  isLoadingProjectIssues: boolean;
  activeDate: string;
}

const SortableIssue = ({ issue }: { issue: IIssue }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: issue.id,
  });
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

  const isDifferentMonth = (date: Date): boolean => {
    const currentDate = new Date();
    return date.getMonth() !== currentDate.getMonth();
  };

  const isWeekend = (date: Date): boolean => {
    return date.getDay() === 0 || date.getDay() === 6;
  };
  return (
    <div ref={setNodeRef}>
      <SortableContext
        items={issues.map((issue) => issue.id)}
        // strategy={horizontalListSortingStrategy}
      >
        <div
          className={`h-48 overflow-auto border p-2 hover:cursor-pointer hover:bg-gray-100 ${isToday(new Date(dateStr)) ? "border-blue-500 bg-blue-50" : "border-gray-200"} ${isDifferentMonth(new Date(dateStr)) ? "bg-gray-50" : ""} ${isWeekend(new Date(dateStr)) ? "hidden bg-gray-100" : ""}  ${isActive ? "bg-green-100" : ""}`}
        >
          <div
            className={`mb-2 text-sm font-medium ${isDifferentMonth(new Date(dateStr)) ? "text-gray-400" : "text-gray-600"}`}
          >
            {new Date(dateStr).getDate()}
          </div>
          <div className="space-y-1 ">
            {issues.map((issue) => (
              <SortableIssue key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </SortableContext>
    </div>
  );
};

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
                  className="rounded-t-xs border border-b-0 border-gray-300 bg-gray-50 py-2 text-center text-sm font-medium text-gray-600"
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
