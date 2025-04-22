import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaCog, FaPaperclip } from "react-icons/fa";
import StatusDropdown from "../projects/backlog/StatusDropdown";
import { useProjectColumns } from "@libs/hooks/useProject";
import Button from "../general-components/button";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { useUpdateIssue } from "@libs/hooks/useIssue";
import { formatDate } from "../../../utils/date";

type DetailOption = "Attachment" | "Child Issue";
const detailOptions: DetailOption[] = ["Attachment", "Child Issue"];

const IssueSideBar: React.FC = () => {
  const { selectedIssueId, selectedIssue, selectIssue, isLoading, isSidebarVisible } = useIssueSelection();
  const { columns } = useProjectColumns(selectedIssue?.project_id || "");
  const { updateIssueAsync } = useUpdateIssue({
    projectId: selectedIssue?.project_id || "",
  });

  const handleStatusChange = async (newStatus: string) => {
    if (selectedIssue && selectedIssue.status !== newStatus) {
      try {
        await updateIssueAsync({
          id: selectedIssue.id,
          data: { status: newStatus },
        });
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };
  const [activeTab, setActiveTab] = useState<string>("Comments");
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);
  const [selectedDetailOption, setSelectedDetailOption] = useState<DetailOption | null>(null);
  const [detailInput, setDetailInput] = useState<string>("");

  if (!isSidebarVisible || !selectedIssueId || !selectedIssue) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="h-screen p-4 bg-white border-l border-gray-200 w-[400px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleDetailSubmit = () => {
    if (!selectedDetailOption || !detailInput) return;

    // Here you would typically make an API call to save the details
    if (selectedDetailOption === "Attachment") {
      console.log("Adding attachment:", detailInput);
    } else if (selectedDetailOption === "Child Issue") {
      console.log("Creating child issue with parent_id:", selectedIssueId);
    }

    // Reset the form
    setSelectedDetailOption(null);
    setDetailInput("");
  };

  const details = {
    assignee: {
      initials: selectedIssue.assignee_id ? selectedIssue.assignee_id.substring(0, 2).toUpperCase() : "NA",
      name: selectedIssue.assignee_id || "Unassigned",
    },
    labels: "None",
    parent: selectedIssue.parent_id || "None",
    team: "None",
    sprint: selectedIssue.sprint_id ? "Current Sprint" : "Backlog",
    storyPointEstimate: selectedIssue.story_point || "None",
    fixVersions: "None",
    development: [
      { icon: "🔗", label: "Create branch" },
      { icon: "📝", label: "Create commit" },
    ],
    reporter: {
      initials: selectedIssue.reporter_id ? selectedIssue.reporter_id.substring(0, 2).toUpperCase() : "NA",
      name: selectedIssue.reporter_id || "Unknown",
    },
    attachments: selectedIssue.attachments || [],
  };

  return (
    <div className="h-screen p-4 bg-white border-l border-gray-200 w-[400px] transition-all duration-300 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-blue-600 hover:underline">Add epic</span>
          <span className="text-sm text-gray-500">/</span>
          <span className="text-sm text-blue-600 hover:underline">{selectedIssue.id}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="dark" className="text-gray-500 hover:text-gray-700" onClick={() => selectIssue(null)}>
            ✖
          </Button>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl text-left font-semibold text-gray-800 mb-2">{selectedIssue.title}</h2>

      {/* Status and Detail Options Dropdowns */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          {/* Status Dropdown */}
          <StatusDropdown status={selectedIssue.status} columns={columns || []} onChange={handleStatusChange} />

          <select
            value={selectedDetailOption || ""}
            onChange={(e) => setSelectedDetailOption((e.target.value as DetailOption) || null)}
            className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="">Add detail...</option>
            {detailOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Input field for selected detail option */}
        {selectedDetailOption && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">{selectedDetailOption === "Attachment" && <FaPaperclip />}</span>
              <input
                type={selectedDetailOption === "Attachment" ? "file" : "text"}
                placeholder={`Add ${selectedDetailOption.toLowerCase()}...`}
                value={selectedDetailOption === "Attachment" ? undefined : detailInput}
                onChange={(e) => setDetailInput(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleDetailSubmit}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <h2 className="text-md text-left font-bold text-gray-800">Description</h2>
        <p className="text-sm text-gray-600">{selectedIssue.description || "No description"}</p>
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

            {/* Attachments Section */}
            <div className="flex items-center justify-between group">
              <span className="text-sm text-gray-600">Attachments</span>
              <div className="flex items-center space-x-1">
                {details.attachments.length > 0 ? (
                  <div className="flex flex-col space-y-1">
                    {details.attachments.map((attachment, index) => (
                      <span key={index} className="text-sm text-blue-600 hover:underline flex items-center">
                        <FaPaperclip className="mr-1" />
                        {attachment}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-800">None</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Created/Updated */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Created {formatDate(selectedIssue.created_at)}
          <button className="ml-1 text-gray-500 hover:text-gray-700">
            <FaCog />
          </button>
        </p>
        <p className="text-sm text-gray-600">Updated {formatDate(selectedIssue.updated_at)}</p>
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
