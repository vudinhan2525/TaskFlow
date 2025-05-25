import React, { useState, useEffect } from "react";
import { Dropdown } from "antd";
import {
  FaChevronDown,
  FaChevronUp,
  FaPaperclip,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import StatusDropdown from "../projects/backlog/StatusDropdown";
import { useProjectColumns } from "@libs/hooks/useProject";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
import Button from "../general-components/button";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { useCreateIssue, useUpdateIssue } from "@libs/hooks/useIssue";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { toast } from "react-toastify";
import { formatDate } from "@libs/utils/date";
import { CreateIssueParams } from "@libs/types/issue";
import ActivitySection from "@libs/app/components/issues/activitySection";
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
  const { selectedIssueId, selectedIssue, selectIssue, isSidebarVisible } =
    useIssueSelection();
  const { columns } = useProjectColumns(selectedIssue?.project_id || "");
  const { projectMembers } = useProjectMembers(selectedIssue?.project_id || "");
  interface Sprint {
    id: string;
    name: string;
  }
  const { updateIssueAsync } = useUpdateIssue({
    projectId: selectedIssue?.project_id || "",
  });
  const { sprints } = useProjectSprints(selectedIssue?.project_id || "");
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [selectedDetailOption, setSelectedDetailOption] =
    useState<DetailOption | null>(null);
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
    if (
      selectedIssue &&
      valueChangedByUser.summary &&
      debouncedSummary !== selectedIssue.summary
    ) {
      handleSummaryChange(debouncedSummary);
    }
  }, [debouncedSummary, selectedIssue, valueChangedByUser.summary]);

  useEffect(() => {
    if (
      selectedIssue &&
      valueChangedByUser.description &&
      debouncedDescription !== selectedIssue.description
    ) {
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
          column_id: "681f1494011a0f0114c92e1a",
          priority: "Medium",
          type: "Task",
          project_id: selectedIssue!.project_id,
          sprint_id: selectedIssue!.sprint_id,
          story_point: childIssueForm.summary
            ? parseInt(childIssueForm.summary)
            : undefined,
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

  const handleAssigneeChange = async (assigneeId: string) => {
    try {
      await updateIssueAsync({
        id: selectedIssue.id,
        data: { assignee_id: assigneeId },
      });
      toast.success("Assignee updated successfully");
    } catch {
      toast.error("Failed to update assignee");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      console.log(newStatus);
      // TODO: FIX COLLUMN ID
      await updateIssueAsync({
        id: selectedIssue.id,
        data: { column_id: "681f1494011a0f0114c92e1a" },
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
    if (selectedIssue.parent_id) {
      toast.error("Cannot change team for child issues");
      return;
    }
    try {
      const updatedIssue = { ...selectedIssue };
      updatedIssue.team_id = teamId;
      await updateIssueAsync({
        id: selectedIssue.id,
        data: {
          column_id: updatedIssue.column.id,
          type: updatedIssue.type,
          priority: updatedIssue.priority,
          sprint_id: updatedIssue.sprint_id,
          title: updatedIssue.title,
          summary: updatedIssue.summary,
        },
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const fileNames = Array.from(files).map((file) => file.name);
    toast.info(`Selected files: ${fileNames.join(", ")}`);
  };

  const reporter = projectMembers?.find(
    (member) => member.user_id === selectedIssue.reporter_id,
  );
  const reporterName = reporter
    ? `${reporter.user?.first_name} ${reporter.user?.last_name}`
    : "Unknown";
  const details = {
    assignee: {
      initials: selectedIssue.assignee_id
        ? selectedIssue.assignee_id.substring(0, 2).toUpperCase()
        : "NA",
      name: selectedIssue.assignee_id || "Unassigned",
    },
    summary: selectedIssue.summary || "No summary provided",
    sprint:
      sprints?.find((s: Sprint) => s.id === selectedIssue.sprint_id)?.name ||
      "None",
    storyPoint: selectedIssue.story_point || 0,
    reporter: {
      initials: selectedIssue.reporter_id
        ? selectedIssue.reporter_id.substring(0, 2).toUpperCase()
        : "NA",
      name: selectedIssue.reporter_id || "Unknown",
    },
    parent: {
      initials: selectedIssue.parent_id
        ? selectedIssue.parent_id.substring(0, 2).toUpperCase()
        : "NA",
      name: selectedIssue.parent_id || "Unknown",
    },
    attachments: selectedIssue.attachments || [],
  };

  return (
    <div className="h-screen w-[400px] overflow-y-auto border-l border-gray-200 bg-white p-4 transition-all duration-300">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-blue-600 hover:underline">
            {selectedIssue.id}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="dark"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => selectIssue(null)}
          >
            ✖
          </Button>
        </div>
      </div>

      {/* Title */}
      <h2 className="mb-2 text-left text-xl font-semibold text-gray-800">
        {selectedIssue.title}
      </h2>

      {/* Status and Add button*/}
      <div className="mb-4 flex w-full gap-5">
        <StatusDropdown
          status={selectedIssue.column.name}
          columns={columns || []}
          onStatusChange={handleStatusChange}
        />
        <Dropdown
          menu={{
            items: detailOptions.map((option) => ({
              key: option,
              label: (
                <div className="flex items-center gap-2 p-2 hover:bg-gray-50">
                  <span className="text-sm">{option}</span>
                </div>
              ),
              onClick: () => setSelectedDetailOption(option),
            })),
          }}
          trigger={["click"]}
        >
          <div className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200">
            <FaPlus size={14} />
            <span>Add detail...</span>
          </div>
        </Dropdown>
      </div>
      {/* Input field for selected detail option */}
      {selectedDetailOption && (
        <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedDetailOption}
            </span>
            <button
              onClick={() => setSelectedDetailOption(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={14} />
            </button>
          </div>
          {selectedDetailOption === "Child Issue" ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter issue title"
                  value={childIssueForm.title}
                  onChange={(e) =>
                    setChildIssueForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Summary
                </label>
                <input
                  type="text"
                  placeholder="Enter summary"
                  value={childIssueForm.summary}
                  onChange={(e) =>
                    setChildIssueForm((prev) => ({
                      ...prev,
                      summary: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
              multiple
            />
          )}
          <button
            onClick={handleDetailSubmit}
            className="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none"
          >
            Add
          </button>
        </div>
      )}
      {/* Details Section */}
      <div className="mb-4">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        >
          <h2 className="text-md text-left font-bold text-gray-800">Details</h2>
          <div className="text-gray-500 hover:text-gray-700">
            {isDetailsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        {isDetailsOpen && (
          <div className="mt-4 space-y-4">
            {/* Assignee Selection */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Assignee</span>
              <div className="w-2/3">
                <Dropdown
                  menu={{
                    items: [
                      ...(projectMembers
                        ?.filter((member) => !member.is_pending)
                        .map((member) => ({
                          key: member.user_id,
                          label: (
                            <div className="flex items-center gap-2 p-2 hover:bg-gray-50">
                              <UserAvatar
                                userId={member.user_id}
                                size={24}
                                isDisplayName={true}
                              />
                            </div>
                          ),
                          onClick: () => handleAssigneeChange(member.user_id),
                        })) || []),
                      {
                        key: "unassigned",
                        label: (
                          <div className="flex items-center gap-2 p-2 hover:bg-gray-50">
                            <UserAvatar
                              userId=""
                              size={24}
                              isDisplayName={true}
                            />
                          </div>
                        ),
                        onClick: () => handleAssigneeChange(""),
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
                    <UserAvatar
                      userId={selectedIssue.assignee_id || ""}
                      size={24}
                      isDisplayName={true}
                    />
                  </div>
                </Dropdown>
              </div>
            </div>
            {/* Summary */}
            <div className="wiki flex items-center justify-between">
              <span className="text-sm text-gray-600">Summary</span>
              <input
                type="text"
                value={formValues.summary}
                onChange={(e) => {
                  setFormValues((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }));
                  setValueChangedByUser((prev) => ({ ...prev, summary: true }));
                }}
                className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            {/* Description */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Description</span>
              <textarea
                value={formValues.description}
                placeholder="Add a description..."
                onChange={(e) => {
                  setFormValues((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                  setValueChangedByUser((prev) => ({
                    ...prev,
                    description: true,
                  }));
                }}
                className="h-24 w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            {/* Team Selection */}
            <div className="flex items-center justify-between">
              <span className="w-1/3 text-sm text-gray-600">Team</span>
              <select
                value={selectedIssue.team_id || ""}
                onChange={(e) => handleTeamChange(e.target.value)}
                className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
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
                className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
                disabled={!!selectedIssue.parent_id}
              >
                <option value="">Select Sprint</option>
                {sprints?.map((sprint: Sprint) => (
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
                className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>

            {/* File Attachments */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Attachments</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
                  multiple
                />
              </div>
              <div className="space-y-1">
                {details.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <FaPaperclip className="mr-1 text-gray-500" />
                    <span className="text-blue-600 hover:underline">
                      {attachment}
                    </span>
                    <button
                      onClick={() =>
                        toast.info(`Remove ${attachment} - To be implemented`)
                      }
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reporter */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reporter</span>
              <div className="flex items-center gap-2">
                <UserAvatar
                  userId={selectedIssue.reporter_id || ""}
                  size={24}
                  isDisplayName={true}
                />
              </div>
            </div>
            {/* Parent */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Parent</span>
              <span className="text-sm text-gray-800">
                {details.parent.name}
              </span>
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
        <p className="text-sm text-gray-600">
          Updated {formatDate(selectedIssue.updated_at)}
        </p>
      </div>
      <ActivitySection issueId={selectedIssue.id} />
    </div>
  );
};

export default IssueSideBar;
