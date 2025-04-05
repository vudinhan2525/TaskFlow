import React, { useState } from "react";
import { FaPlus, FaFileAlt, FaChevronDown } from "react-icons/fa";

interface Issue {
  id: string;
  type: string;
  key: string;
  summary: string;
  status: string;
  sprint: string;
  assignee: { initials: string; name: string };
  dueDate: string;
  labels: string;
  created: string;
}

const List: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "1",
      type: "Task",
      key: "SCRUM-1",
      summary: "Build landing page",
      status: "IN PROGRESS",
      sprint: "SCRUM Sprint 1",
      assignee: { initials: "KP", name: "Khoa Phan" },
      dueDate: "",
      labels: "",
      created: "Mar 22, 2025",
    },
    {
      id: "2",
      type: "Task",
      key: "SCRUM-2",
      summary: "dasda",
      status: "DONE",
      sprint: "SCRUM Sprint 1",
      assignee: { initials: "KP", name: "Khoa Phan" },
      dueDate: "",
      labels: "",
      created: "Mar 22, 2025",
    },
  ]);

  const [hoveredIssueId, setHoveredIssueId] = useState<string | null>(null);

  const handleCreateSubIssue = (parentIssueId: string) => {
    // Placeholder for creating a sub-issue
    console.log(`Creating sub-issue for issue with ID: ${parentIssueId}`);
    // You can add logic here to create a sub-issue, e.g., open a modal or add a new issue to the list
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search list"
              className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">
              KP
            </span>
            <button className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-200">
              Filter <FaChevronDown className="inline ml-1" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-gray-700">📊</button>
          <button className="text-gray-500 hover:text-gray-700">⚙️</button>
          <button className="text-gray-500 hover:text-gray-700">...</button>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white border border-gray-200 rounded">
        {/* Table Header */}
        <div className="grid grid-cols-10 gap-2 p-2 text-sm font-medium text-gray-600 border-b border-gray-200">
          <div className="col-span-1">
            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
          </div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Key</div>
          <div className="col-span-2">Summary</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Sprint</div>
          <div className="col-span-1">Assignee</div>
          <div className="col-span-1">Due date</div>
          <div className="col-span-1">Labels</div>
          <div className="col-span-1">Created</div>
        </div>

        {/* Table Rows */}
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="grid grid-cols-10 gap-2 p-2 text-sm border-b border-gray-200 hover:bg-gray-50"
            onMouseEnter={() => setHoveredIssueId(issue.id)}
            onMouseLeave={() => setHoveredIssueId(null)}
          >
            <div className="col-span-1">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
            </div>
            <div className="col-span-1 flex items-center space-x-1">
              <FaFileAlt className="text-gray-500" />
              {hoveredIssueId === issue.id && (
                <button onClick={() => handleCreateSubIssue(issue.id)} className="text-gray-500 hover:text-gray-700">
                  <FaPlus className="text-xs" />
                </button>
              )}
            </div>
            <div className="col-span-1">
              <span className="text-blue-600 hover:underline">{issue.key}</span>
            </div>
            <div className="col-span-2 text-gray-800">{issue.summary}</div>
            <div className="col-span-1">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  issue.status === "IN PROGRESS" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                }`}
              >
                {issue.status}
              </span>
            </div>
            <div className="col-span-1 text-gray-600">{issue.sprint}</div>
            <div className="col-span-1 flex items-center space-x-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">
                {issue.assignee.initials}
              </span>
              <span className="text-gray-600">{issue.assignee.name}</span>
            </div>
            <div className="col-span-1 text-gray-600">{issue.dueDate || "-"}</div>
            <div className="col-span-1 text-gray-600">{issue.labels || "-"}</div>
            <div className="col-span-1 text-gray-600">{issue.created}</div>
          </div>
        ))}
      </div>

      {/* Create Issue Input */}
      <div className="mt-2 flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">📄</span>
        </div>
        <button className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300">Create</button>
      </div>
    </div>
  );
};

export default List;
