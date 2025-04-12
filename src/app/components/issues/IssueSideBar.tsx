import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaCog } from "react-icons/fa";
import Button from "../general-components/button";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { formatDate } from "../../../utils/date";
import { IssueStatus } from "@libs/types";

const statusOptions: IssueStatus[] = ["To Do", "In Progress", "Done"];

const IssueSideBar: React.FC = () => {
  const { selectedIssueId, selectIssue, mockIssue } = useIssueSelection();
  const [activeTab, setActiveTab] = useState<string>("Comments");
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);

  if (!selectedIssueId) {
    return null;
  }

  const details = {
    assignee: mockIssue.assignee,
    labels: "None",
    parent: "None",
    team: "None",
    sprint: "SCRUM Sprint 1",
    storyPointEstimate: "None",
    fixVersions: "None",
    development: [
      { icon: "🔗", label: "Create branch" },
      { icon: "📝", label: "Create commit" },
    ],
    reporter: mockIssue.reporter,
  };

  return (
    <div className="h-screen p-4 bg-white border-l border-gray-200 w-[400px] transition-all duration-300 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-blue-600 hover:underline">Add epic</span>
          <span className="text-sm text-gray-500">/</span>
          <span className="text-sm text-blue-600 hover:underline">{mockIssue.id}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="dark" className="text-gray-500 hover:text-gray-700" onClick={() => selectIssue(null)}>
            ✖
          </Button>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl text-left font-semibold text-gray-800 mb-2">{mockIssue.title}</h2>

      {/* Status Dropdown */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <select
            value={mockIssue.status}
            onChange={(e) => console.log(e.target.value)}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h2 className="text-md text-left font-bold text-gray-800">Description</h2>
        <p className="text-sm text-gray-600">{mockIssue.description}</p>
      </div>

      {/* Details */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        >
          <h2 className="text-md text-left font-bold text-gray-800">Details</h2>
          <div className="text-gray-500 hover:text-gray-700">{isDetailsOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>
        {isDetailsOpen && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Assignee</span>
              <div className="flex items-center space-x-1">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">
                  {details.assignee.initials}
                </span>
                <span className="text-sm text-gray-800">{details.assignee.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Labels</span>
              <span className="text-sm text-gray-800">{details.labels}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Parent</span>
              <span className="text-sm text-gray-800">{details.parent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Team</span>
              <span className="text-sm text-gray-800">{details.team}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sprint</span>
              <span className="text-sm text-blue-600 hover:underline">{details.sprint}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Story point estimate</span>
              <span className="text-sm text-gray-800">{details.storyPointEstimate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reporter</span>
              <div className="flex items-center space-x-1">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs">
                  {details.reporter.initials}
                </span>
                <span className="text-sm text-gray-800">{details.reporter.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Created/Updated */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Created {formatDate(mockIssue.created_at)}
          <button className="ml-1 text-gray-500 hover:text-gray-700">
            <FaCog />
          </button>
        </p>
        <p className="text-sm text-gray-600">Updated {formatDate(mockIssue.updated_at)}</p>
      </div>

      {/* Activity Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-md text-left font-bold text-gray-800">Activity</h2>
          <button className="text-gray-500 hover:text-gray-700">⤓</button>
        </div>
        <div className="flex space-x-2 border-b border-gray-200">
          {["All", "Comments", "History", "Work log"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm ${
                activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssueSideBar;
