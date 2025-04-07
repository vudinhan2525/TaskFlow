import React, { useState, useMemo } from "react";
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaSearch, FaFilter } from "react-icons/fa";
import TaskItem from "./task-item";
import { Task, IssueType, IssueStatus, IssuePriority } from "./types";

const Roadmap: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<IssueType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample tasks
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Implement login page",
      date: new Date(2025, 3, 15),
      type: "TASK",
      status: "ONGOING",
      priority: "II",
      assignee: { initials: "KP", name: "Khoa Phan" },
    },
    {
      id: "2",
      title: "Fix navigation bug",
      date: new Date(2025, 3, 16),
      type: "BUG",
      status: "TODO",
      priority: "III",
      assignee: { initials: "KP", name: "Khoa Phan" },
    },
    {
      id: "3",
      title: "User profile feature",
      date: new Date(2025, 3, 17),
      type: "STORY",
      status: "DONE",
      priority: "I",
      assignee: { initials: "KP", name: "Khoa Phan" },
    },
  ]);

  const issueTypes: IssueType[] = ["BUG", "TASK", "STORY", "EPIC"];
  const issueStatuses: IssueStatus[] = ["TODO", "ONGOING", "DONE"];
  const issuePriorities: IssuePriority[] = ["I", "II", "III"];

  // Get calendar days for current month
  const calendarDays = useMemo<Date[]>(() => {
    const date = new Date(currentDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Find first Monday (may be in previous month)
    const startDate = new Date(firstDay);
    while (startDate.getDay() !== 1) {
      // 1 represents Monday
      startDate.setDate(startDate.getDate() - 1);
    }

    // Find last Friday (may be in next month)
    const endDate = new Date(lastDay);
    while (endDate.getDay() !== 5) {
      // 5 represents Friday
      endDate.setDate(endDate.getDate() + 1);
    }

    // Generate all days between start and end
    const days: Date[] = [];
    const iterDate = new Date(startDate);

    while (iterDate <= endDate) {
      if (iterDate.getDay() !== 0 && iterDate.getDay() !== 6) {
        // Skip weekends
        days.push(new Date(iterDate));
      }
      iterDate.setDate(iterDate.getDate() + 1);
    }

    return days;
  }, [currentDate]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task: Task) => {
      const matchesAssignee = !selectedAssignee || task.assignee.name === selectedAssignee;
      const matchesType = !selectedType || task.type === selectedType;
      const matchesStatus = !selectedStatus || task.status === selectedStatus;
      const matchesPriority = !selectedPriority || task.priority === selectedPriority;
      const matchesSearch = !searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesAssignee && matchesType && matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, selectedAssignee, selectedType, selectedStatus, selectedPriority, searchQuery]);

  // Group tasks by date
  const getTasksForDate = (date: Date): Task[] => {
    return filteredTasks.filter(
      (task) =>
        task.date.getDate() === date.getDate() &&
        task.date.getMonth() === date.getMonth() &&
        task.date.getFullYear() === date.getFullYear()
    );
  };

  const formatMonth = (date: Date): string => {
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
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

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

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

          {/* Filters with badges */}
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            {(selectedAssignee || selectedType || selectedStatus || selectedPriority) && (
              <div className="flex items-center space-x-2">
                {selectedAssignee && (
                  <span
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full cursor-pointer"
                    onClick={() => setSelectedAssignee(null)}
                  >
                    {selectedAssignee} ×
                  </span>
                )}
                {selectedType && (
                  <span
                    className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full cursor-pointer"
                    onClick={() => setSelectedType(null)}
                  >
                    {selectedType} ×
                  </span>
                )}
                {selectedStatus && (
                  <span
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full cursor-pointer"
                    onClick={() => setSelectedStatus(null)}
                  >
                    {selectedStatus} ×
                  </span>
                )}
                {selectedPriority && (
                  <span
                    className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full cursor-pointer"
                    onClick={() => setSelectedPriority(null)}
                  >
                    {selectedPriority} ×
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 text-sm border rounded hover:bg-gray-50 ${
                selectedAssignee ? "border-blue-500 text-blue-600" : "border-gray-300 text-gray-600"
              }`}
              onClick={() => setSelectedAssignee(selectedAssignee ? null : "Khoa Phan")}
            >
              Assignee <FaChevronDown className="inline ml-1" />
            </button>

            <select
              value={selectedType || ""}
              onChange={(e) => setSelectedType((e.target.value as IssueType) || null)}
              className={`px-3 py-1 text-sm border rounded hover:bg-gray-50 ${
                selectedType ? "border-purple-500 text-purple-600" : "border-gray-300 text-gray-600"
              }`}
            >
              <option value="">Type</option>
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus((e.target.value as IssueStatus) || null)}
              className={`px-3 py-1 text-sm border rounded hover:bg-gray-50 ${
                selectedStatus ? "border-green-500 text-green-600" : "border-gray-300 text-gray-600"
              }`}
            >
              <option value="">Status</option>
              {issueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={selectedPriority || ""}
              onChange={(e) => setSelectedPriority((e.target.value as IssuePriority) || null)}
              className={`px-3 py-1 text-sm border rounded hover:bg-gray-50 ${
                selectedPriority ? "border-red-500 text-red-600" : "border-gray-300 text-gray-600"
              }`}
            >
              <option value="">Priority</option>
              {issuePriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
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

            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-3 py-1 text-sm text-gray-800 hover:bg-gray-100 flex items-center"
            >
              {formatMonth(currentDate)}
              <FaCalendarAlt className="ml-2 text-gray-500" />
            </button>

            <button onClick={nextMonth} className="p-1 text-gray-600 hover:bg-gray-100">
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-2">
        {/* Weekday Headers */}
        <div className="grid grid-cols-5 gap-1 mb-2">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
            <div key={day} className="text-sm font-medium text-gray-600 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-5 gap-1">
          {calendarDays.map((date: Date, index: number) => (
            <div
              key={index}
              className={`
                min-h-[150px] p-2 border rounded
                ${isToday(date) ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                ${isDifferentMonth(date) ? "bg-gray-50" : ""}
              `}
            >
              <div className={`text-sm font-medium mb-2 ${isDifferentMonth(date) ? "text-gray-400" : "text-gray-600"}`}>
                {date.getDate()}
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[200px]">
                {getTasksForDate(date).map((task) => (
                  <TaskItem
                    key={task.id}
                    title={task.title}
                    type={task.type}
                    status={task.status}
                    priority={task.priority}
                    assignee={task.assignee}
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
