import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedIssueId } from "../../../../store/slices/uiSlice";
import { FaChevronDown, FaChevronRight, FaCheckCircle, FaCircle } from "react-icons/fa";
import Button from "../../general-components/Button";

interface Issue {
  id: string;
  title: string;
  status: "To Do" | "Done" | "In Progress" | "In Review";
  assignee: string;
}

interface ScrumSprintProps {
  sprintName: string;
  startDate: string;
  endDate: string;
  issues: Issue[];
  issueCount: number;
}

const ScrumSprint: React.FC<ScrumSprintProps> = ({ sprintName, startDate, endDate, issues, issueCount }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const dispatch = useDispatch();

  return (
    <div className="border-b border-gray-200">
      {/* Sprint Header */}
      <div
        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <FaChevronDown className="text-gray-500 mr-2" />
          ) : (
            <FaChevronRight className="text-gray-500 mr-2" />
          )}
          <span className="text-sm font-medium text-gray-800">
            {sprintName} {startDate} - {endDate} ({issueCount} issues)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">0 / {issueCount}</span>
          <Button variant="primary" className="px-3 py-1 text-sm text-white ">
            {issueCount > 0 ? "Complete sprint" : "Start sprint"}
          </Button>
          <Button variant="primary-outline" className="text-gray-500 hover:text-gray-700">
            ...
          </Button>
        </div>
      </div>

      {/* Issues List */}
      {isExpanded && (
        <div className="p-3">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between p-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => dispatch(setSelectedIssueId(issue.id))}
              >
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-800">{issue.id}</span>
                  <span className="text-sm text-gray-600">{issue.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {issue.status === "Done" ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaCircle className="text-gray-400" />
                  )}
                  <span className="text-sm text-gray-500">{issue.assignee}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">
              Plan a sprint by dragging the sprint footer down below some issues, or by dragging issues here.
            </p>
          )}
          <div role="button" className="mt-2 text-sm text-blue-600 hover:underline ">
            + Create issue
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrumSprint;
