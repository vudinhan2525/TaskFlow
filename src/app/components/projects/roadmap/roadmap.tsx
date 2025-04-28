import React, { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import TaskItem from "./task-item";
import { IIssue, IssueStatus, IssuePriority } from "@libs/types/issue";

interface RoadmapProps {
  projectId?: string;
  issues?: IIssue[];
}

const formatMonth = (date: Date): string => {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const Roadmap: React.FC<RoadmapProps> = ({ issues = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get calendar days for current month
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

  // Filter tasks
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesAssignee = !selectedAssignee || issue.assignee_id === selectedAssignee;
      const matchesStatus = !selectedStatus || issue.status === selectedStatus;
      const matchesPriority = !selectedPriority || issue.priority === selectedPriority;
      const matchesSearch = !searchQuery || issue.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesAssignee && matchesStatus && matchesPriority && matchesSearch;
    });
  }, [issues, selectedAssignee, selectedStatus, selectedPriority, searchQuery]);

  // Group tasks by date
  const getIssuesForDate = (date: Date): IIssue[] => {
    return filteredIssues.filter((issue) => {
      const issueDate = new Date(issue.created_at);
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
  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* Left side - Filters */}
        <div className="flex items-center space-x-4">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 w-48 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus((e.target.value || null) as IssueStatus | null)}
              className="px-3 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="">Status</option>
              <option value="ToDo">To Do</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select
              value={selectedPriority || ""}
              onChange={(e) => setSelectedPriority((e.target.value || null) as IssuePriority | null)}
              className="px-3 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="">Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={selectedAssignee || ""}
              onChange={(e) => setSelectedAssignee(e.target.value || null)}
              className="px-3 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="">Assignee</option>
              {[...new Set(issues.map((i) => i.assignee_id))].map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee || "Unassigned"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side - Calendar Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Today
          </button>

          <div className="flex items-center space-x-1 border border-gray-300 rounded">
            <button onClick={previousMonth} className="p-1 text-gray-600 hover:bg-gray-100">
              <FaChevronLeft size={14} />
            </button>

            <span className="px-3 py-1 text-sm text-gray-800">{formatMonth(currentDate)}</span>

            <button onClick={nextMonth} className="p-1 text-gray-600 hover:bg-gray-100">
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-2">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
            <div key={day} className="text-sm font-medium text-gray-600 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date: Date, index: number) => (
            <div
              key={index}
              className={`
                min-h-[150px] p-2 border rounded
                ${isToday(date) ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                ${isDifferentMonth(date) ? "bg-gray-50" : ""}
                ${isWeekend(date) ? "bg-gray-100" : ""}
              `}
            >
              <div className={`text-sm font-medium mb-2 ${isDifferentMonth(date) ? "text-gray-400" : "text-gray-600"}`}>
                {date.getDate()}
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[200px]">
                {getIssuesForDate(date).map((issue) => (
                  <TaskItem
                    key={issue.id}
                    title={issue.title}
                    type={issue.type}
                    status={issue.status}
                    priority={issue.priority}
                    assignee={{
                      initials: issue.assignee_id ? issue.assignee_id.substring(0, 2).toUpperCase() : "NA",
                      name: issue.assignee_id || "Unassigned",
                    }}
                  />
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
