import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaPaperclip, FaTimes } from "react-icons/fa";
import StatusDropdown from "../projects/backlog/StatusDropdown";
import { useProjectColumns } from "@libs/hooks/useProject";
import Button from "../general-components/button";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { useCreateIssue, useUpdateIssue } from "@libs/hooks/useIssue";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { toast } from "react-toastify";
import { formatDate } from "@libs/utils/date";
import { CreateIssueParams } from "@libs/apis/issue";

// Mock data for teams
const MOCK_TEAMS = [
  { id: "1", name: "Team 1" },
  { id: "2", name: "Team 2" },
];
type DetailOption = "Attachment" | "Child Issue";
const detailOptions: DetailOption[] = ["Attachment", "Child Issue"];

// Custom hook for debouncing values
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const IssueSideBar: React.FC = () => {
  const { selectedIssueId, selectedIssue, selectIssue, isSidebarVisible } = useIssueSelection();
  const { columns } = useProjectColumns(selectedIssue?.project_id || "");
  const { updateIssueAsync } = useUpdateIssue({
    projectId: selectedIssue?.project_id || "",
  });
  const { sprints } = useProjectSprints(selectedIssue?.project_id || "");
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Comments");
  const [selectedDetailOption, setSelectedDetailOption] = useState<DetailOption | null>(null);
  const [childIssueForm, setChildIssueForm] = useState({
    title: "",
    summary: "",
  });
  // Track if values were changed by user
  const [valueChangedByUser, setValueChangedByUser] = useState({
    summary: false,
    description: false,
  });

  // Local state for input fields
  const [formValues, setFormValues] = useState({
    summary: "",
    description: "",
    storyPoint: 0,
  });

  // Debounced values
  const debouncedSummary = useDebounce(formValues.summary, 500);
  const debouncedDescription = useDebounce(formValues.description, 500);

  // Update form values when selected issue changes
  useEffect(() => {
    if (selectedIssue) {
      setFormValues({
        summary: selectedIssue.summary || "",
        description: selectedIssue.description || "",
        storyPoint: selectedIssue.story_point || 0,
      });
      // Reset user change flags when switching issues
      setValueChangedByUser({
        summary: false,
        description: false,
      });
    }
  }, [selectedIssue]);

  // Handle debounced updates
  useEffect(() => {
    if (selectedIssue && valueChangedByUser.summary && debouncedSummary !== selectedIssue.summary) {
      handleSummaryChange(debouncedSummary);
    }
  }, [debouncedSummary, selectedIssue, valueChangedByUser.summary]);

  useEffect(() => {
    if (selectedIssue && valueChangedByUser.description && debouncedDescription !== selectedIssue.description) {
      handleDescriptionChange(debouncedDescription);
    }
  }, [debouncedDescription, selectedIssue, valueChangedByUser.description]);
  const { createIssueAsync } = useCreateIssue({
    projectId: selectedIssue?.project_id || "",
  });

  if (!isSidebarVisible || !selectedIssueId || !selectedIssue) {
    return null;
  }

  const handleDetailSubmit = async () => {
    if (!selectedDetailOption) return;

    if (selectedDetailOption === "Attachment") {
      toast.info("Attachment upload not implemented yet");
    } else if (selectedDetailOption === "Child Issue") {
      if (!childIssueForm.title) {
        toast.error("Title is required");
        return;
      }

      try {
        const newIssue: CreateIssueParams = {
          title: childIssueForm.title,
          status: "TO DO",
          priority: "Medium",
          type: "Task",
          project_id: selectedIssue!.project_id,
          sprint_id: selectedIssue!.sprint_id,
          story_point: childIssueForm.summary ? parseInt(childIssueForm.summary) : undefined,
          parent_id: selectedIssueId,
          summary: childIssueForm.summary,
        };

        await createIssueAsync(newIssue);
        toast.success("Child issue created successfully");
        setSelectedDetailOption(null);
        setChildIssueForm({ title: "", summary: "" });
      } catch (error) {
        console.error("Failed to create child issue:", error);
        toast.error("Failed to create child issue");
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateIssueAsync({
        id: selectedIssue.id,
        data: { status: newStatus },
      });
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleStoryPointChange = async (value: number) => {
    try {
      await updateIssueAsync({
        id: selectedIssue.id,
        data: { story_point: value },
      });
      toast.success("Story points updated successfully");
    } catch {
      toast.error("Failed to update story points");
    }
  };

  const handleSummaryChange = async (value: string) => {
    try {
      await updateIssueAsync({
        id: selectedIssue.id,
        data: { summary: value },
      });
      toast.success("Summary updated successfully");
    } catch {
      toast.error("Failed to update summary");
    }
  };

  const handleDescriptionChange = async (value: string) => {
    try {
      await updateIssueAsync({
        id: selectedIssue.id,
        data: { description: value },
      });
      toast.success("Description updated successfully");
    } catch {
      toast.error("Failed to update description");
    }
  };

  const handleTeamChange = async (teamId: string) => {
    if (selectedIssue.parent_id) {
      toast.error("Cannot change team for child issues");
      return;
    }
    try {
      await updateIssueAsync({
        id: selectedIssue.id,
        data: { team_id: teamId },
      });
      toast.success("Team updated successfully");
    } catch {
      toast.error("Failed to update team");
    }
  };

  const handleSprintChange = async (sprintId: string) => {
    if (selectedIssue.parent_id) {
      toast.error("Cannot change sprint for child issues");
      return;
    }
    try {
      await updateIssueAsync({
        id: selectedIssue.id,
        data: { sprint_id: sprintId },
      });
      toast.success("Sprint updated successfully");
    } catch {
      toast.error("Failed to update sprint");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileNames = Array.from(files).map((file) => file.name);
    toast.info(`Selected files: ${fileNames.join(", ")}`);
  };

  const details = {
    assignee: {
      initials: selectedIssue.assignee_id ? selectedIssue.assignee_id.substring(0, 2).toUpperCase() : "NA",
      name: selectedIssue.assignee_id || "Unassigned",
    },
    summary: selectedIssue.summary || "No summary provided",
    sprint: sprints?.find((s) => s.id === selectedIssue.sprint_id)?.name || "None",
    storyPoint: selectedIssue.story_point || 0,
    reporter: {
      initials: selectedIssue.reporter_id ? selectedIssue.reporter_id.substring(0, 2).toUpperCase() : "NA",
      name: selectedIssue.reporter_id || "Unknown",
    },
    parent: {
      initials: selectedIssue.parent_id ? selectedIssue.parent_id.substring(0, 2).toUpperCase() : "NA",
      name: selectedIssue.parent_id || "Unknown",
    },
    attachments: selectedIssue.attachments || [],
  };

  return (
    <div className="h-screen p-4 bg-white border-l border-gray-200 w-[400px] transition-all duration-300 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
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

      {/* Status and Add button*/}
      <div className="mb-4 w-full">
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
            {selectedDetailOption === "Child Issue" ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Issue title"
                  value={childIssueForm.title}
                  onChange={(e) => setChildIssueForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="summary"
                  placeholder="Summary"
                  value={childIssueForm.summary}
                  onChange={(e) => setChildIssueForm((prev) => ({ ...prev, summary: e.target.value }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                />
              </div>
            ) : (
              <input
                type="file"
                placeholder="Add attachment..."
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
            <button
              onClick={handleDetailSubmit}
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
            >
              Add
            </button>
          </div>
        </div>
      )}
      {/* Details Section */}
      <div className="mb-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        >
          <h2 className="text-md text-left font-bold text-gray-800">Details</h2>
          <div className="text-gray-500 hover:text-gray-700">{isDetailsOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>
        {isDetailsOpen && (
          <div className="mt-4 space-y-4">
            {/* Assignee Selection */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Assignee</span>
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs mr-2">
                  {details.assignee.initials}
                </span>
                <span className="text-sm">{details.assignee.name}</span>
              </div>
            </div>
            {/* Summary */}
            <div className="flex items-center wiki justify-between">
              <span className="text-sm text-gray-600">Summary</span>
              <input
                type="text"
                value={formValues.summary}
                onChange={(e) => {
                  setFormValues((prev) => ({ ...prev, summary: e.target.value }));
                  setValueChangedByUser((prev) => ({ ...prev, summary: true }));
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1 w-2/3"
              />
            </div>
            {/* Description */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Description</span>
              <textarea
                value={formValues.description}
                placeholder="Add a description..."
                onChange={(e) => {
                  setFormValues((prev) => ({ ...prev, description: e.target.value }));
                  setValueChangedByUser((prev) => ({ ...prev, description: true }));
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1 w-2/3 h-24"
              />
            </div>
            {/* Team Selection */}
            <div className="flex items-center justify-between ">
              <span className="text-sm text-gray-600 w-1/3">Team</span>
              <select
                value={selectedIssue.team_id || ""}
                onChange={(e) => handleTeamChange(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 w-2/3"
                disabled={!!selectedIssue.parent_id}
              >
                <option value="">Select Team</option>
                {MOCK_TEAMS.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sprint Selection */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sprint</span>
              <select
                value={selectedIssue.sprint_id || ""}
                onChange={(e) => handleSprintChange(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 w-2/3"
                disabled={!!selectedIssue.parent_id}
              >
                <option value="">Select Sprint</option>
                {sprints?.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Story Points */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Story Points</span>
              <input
                type="number"
                value={details.storyPoint}
                onChange={(e) => handleStoryPointChange(Number(e.target.value))}
                min="0"
                className=" text-sm border border-gray-300 rounded px-2 py-1 w-2/3"
              />
            </div>

            {/* File Attachments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Attachments</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="text-sm border border-gray-300 rounded px-2 py-1 w-2/3"
                  multiple
                />
              </div>
              <div className="space-y-1">
                {details.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <FaPaperclip className="mr-1 text-gray-500" />
                    <span className="text-blue-600 hover:underline">{attachment}</span>
                    <button
                      onClick={() => toast.info(`Remove ${attachment} - To be implemented`)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reporter (Read-only) */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reporter</span>
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs mr-2">
                  {details.reporter.initials}
                </span>
                <span className="text-sm">{details.reporter.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Parent</span>
              <span className="text-sm text-gray-800">{details.parent.name}</span>
            </div>
          </div>
        )}
      </div>
      {/* Date Section */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Created {formatDate(selectedIssue.created_at)}
          {/* <button className="ml-1 text-gray-500 hover:text-gray-700">
            <FaCog />
          </button> */}
        </p>
        <p className="text-sm text-gray-600">Updated {formatDate(selectedIssue.updated_at)}</p>
      </div>
      {/* Activity Section */}
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
