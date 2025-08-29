import React, { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import TaskItem from "./task-item";
import { IIssue } from "@libs/types/issue";
import PageFilter from "../../general-components/pageFilter";
import { GetIssuesParams } from "@libs/types/issue";
import { useProjectIssues } from "@libs/hooks/useIssue";
interface RoadmapProps {
  projectId?: string;
  // issues?: IIssue[];
}

const formatMonth = (date: Date): string => {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const Roadmap: React.FC<RoadmapProps> = ({ projectId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [issues, setIssues] = useState<IIssue[]>([]);
  const [filters, setFilters] = useState<GetIssuesParams>({
    project_id: projectId || "",
  });
  const { issues } = useProjectIssues(filters);

  const calendarDays = useMemo<Date[]>(() => {
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
    const days: Date[] = [];
    const iterDate = new Date(startDate);

    while (iterDate <= endDate) {
      days.push(new Date(iterDate));
      iterDate.setDate(iterDate.getDate() + 1);
    }

    return days;
  }, [currentDate]);

  // Group tasks by date
  const getIssuesForDate = (date: Date): IIssue[] => {
    return issues.filter((issue) => {
      const issueDate = new Date(issue.due_date_to);
      return (
        issueDate.getDate() === date.getDate() &&
        issueDate.getMonth() === date.getMonth() &&
        issueDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDifferentMonth = (date: Date): boolean => {
    return date.getMonth() !== currentDate.getMonth();
  };

  const isWeekend = (date: Date): boolean => {
    return date.getDay() === 0 || date.getDay() === 6;
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

  return (
    <div className="flex h-full w-full flex-col gap-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-700">Roadmap Page</h1>
      {/* Navigation Bar */}
      <div className="flex items-center justify-between">
        {/* Left side - Filters */}
        <PageFilter onFiltersChange={(filter) => setFilters(filter)} />
        {/* <RoadmapFilter setIssues={setIssues} /> */}

        {/* Right side - Calendar Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="rounded border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
          >
            Today
          </button>

          <div className="flex items-center space-x-1 rounded border border-gray-300">
            <button
              onClick={previousMonth}
              className="p-1 text-gray-600 hover:bg-gray-100"
            >
              <FaChevronLeft size={14} />
            </button>

            <span className="px-3 py-1 text-sm text-gray-800">
              {formatMonth(currentDate)}
            </span>

            <button
              onClick={nextMonth}
              className="p-1 text-gray-600 hover:bg-gray-100"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1">
        {/* Weekday Headers */}
        <div className="mb-2 grid grid-cols-5 gap-1">
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
              className="py-2 text-center text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-5 gap-1">
          {calendarDays.map((date: Date) => (
            <div
              key={date.toISOString()}
              className={`min-h-[150px] rounded border p-2 hover:cursor-pointer hover:bg-gray-100 ${isToday(date) ? "border-blue-500 bg-blue-50" : "border-gray-200"} ${isDifferentMonth(date) ? "bg-gray-50" : ""} ${isWeekend(date) ? "hidden bg-gray-100" : ""} `}
            >
              <div
                className={`mb-2 text-sm font-medium ${isDifferentMonth(date) ? "text-gray-400" : "text-gray-600"}`}
              >
                {date.getDate()}
              </div>
              <div className="max-h-[100px] space-y-1 overflow-y-auto">
                {getIssuesForDate(date).map((issue) => (
                  <TaskItem key={issue.id} issue={issue} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
