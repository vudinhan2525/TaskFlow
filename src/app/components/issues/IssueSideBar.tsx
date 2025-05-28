import React, { useState } from "react";
import { Dropdown } from "antd";
import {
  FaChevronDown,
  FaChevronUp,
  FaPaperclip,
  // FaPlus,
  FaTimes,
} from "react-icons/fa";
// import { useProjectColumns } from "@libs/hooks/useProject";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
import { useIssueSelection } from "@libs/hooks/useIssueSelection";
import { useCreateIssue, useUpdateIssue } from "@libs/hooks/useIssue";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { toast } from "react-toastify";
import { formatDate } from "@libs/utils/date";
import { CreateIssueParams } from "@libs/types/issue";
import ActivitySection from "@libs/app/components/issues/activitySection";
import { useNavigate } from "react-router-dom";
import { PiNotePencil } from "react-icons/pi";
import { IoLockClosedOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { CiShare2 } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import TextEditor from "../projects/backlog/TextEditor";

// Mock data for teams
const MOCK_TEAMS = [
  { id: "1", name: "Team 1" },
  { id: "2", name: "Team 2" },
];
type DetailOption = "Attachment" | "Child Issue";

const IssueSideBar: React.FC = () => {
  const { selectedIssue, setSelectedIssue } = useIssueSelection();
  const IssueSideBarHeader = [
    {
      key: "lock",
      icon: <IoLockClosedOutline />,
      label: "Lock Issue",
      onClick: () => {
        toast.info("Lock issue not implemented yet");
      },
    },
    {
      key: "watch",
      icon: <FaEye />,
      label: "Watch Issue",
      onClick: () => {
        toast.info("Watch issue not implemented yet");
      },
    },
    {
      key: "like",
      icon: <AiOutlineLike />,
      label: "Like Issue",
      onClick: () => {
        toast.info("Like issue not implemented yet");
      },
    },
    {
      key: "share",
      icon: <CiShare2 />,
      label: "Share Issue",
      onClick: () => {
        toast.info("Share issue not implemented yet");
      },
    },
    {
      key: "actions",
      icon: <BsThreeDots />,
      label: "Actions",
      onClick: () => {
        toast.info("Actions not implemented yet");
      },
    },
    {
      key: "close",
      icon: <IoIosClose />,
      label: "Close Issue",
      onClick: () => {
        setSelectedIssue(null);
        navigate(`/projects/${selectedIssue?.project_id}/backlog`);
      },
    },
  ];
  const navigate = useNavigate();
  // const { columns } = useProjectColumns(selectedIssue?.project_id || "");
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

  const { createIssueAsync } = useCreateIssue({
    projectId: selectedIssue?.project_id || "",
  });

  if (!selectedIssue) return null;

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
          parent_id: selectedIssue?.id || "",
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const fileNames = Array.from(files).map((file) => file.name);
    toast.info(`Selected files: ${fileNames.join(", ")}`);
  };

  const handleUpdateIssue = async (key: string, value: string) => {
    try {
      await updateIssueAsync({
        id: selectedIssue.id,
        data: {
          [key]: value,
        },
      });
      toast.success("Issue updated successfully");
    } catch {
      toast.error("Failed to update issue");
    }
  };

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
    <div className="overflow-y-auto border-l border-gray-200 bg-white p-4 transition-all duration-300">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <PiNotePencil size={16} />
            <span className="text-sm text-gray-600">Add epic</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">
              {selectedIssue?.title}
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          {IssueSideBarHeader.map((item) => (
            <div
              key={item.key}
              onClick={item.onClick}
              className="cursor-pointer rounded-sm border-1 border-gray-300 p-1.5 hover:bg-gray-100"
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <h2 className="mb-2 text-left text-xl font-semibold text-gray-800">
        {selectedIssue?.title}
      </h2>

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
                          onClick: () =>
                            handleUpdateIssue("assignee_id", member.user_id),
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
                        onClick: () => handleUpdateIssue("assignee_id", ""),
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
                    <UserAvatar
                      userId={selectedIssue?.assignee_id || ""}
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
                value={selectedIssue?.summary}
                onChange={(e) => {
                  handleUpdateIssue("summary", e.target.value);
                }}
                className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            {/* Description */}
            <div className="flex w-full flex-col items-start gap-1">
              <p className="text-sm font-medium text-gray-600">Description</p>
              <TextEditor
                value={selectedIssue?.description || ""}
                onChange={(value) => {
                  handleUpdateIssue("description", value);
                }}
              />
              <div className="flex flex-row gap-2">
                <button
                onClick={()=>{
                 
                }}
                className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none">
                  Add
                </button>
                <button className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700 focus:outline-none">
                  Cancel
                </button>
              </div>
            </div>

            {/* Team Selection */}
            <div className="flex items-center justify-between">
              <span className="w-1/3 text-sm text-gray-600">Team</span>
              <select
                value={selectedIssue?.team_id || ""}
                onChange={(e) => handleTeamChange(e.target.value)}
                className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
                disabled={!!selectedIssue?.parent_id}
              >
                <option value="">Select Team</option>
                {MOCK_TEAMS.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
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
                onChange={(e) =>
                  handleUpdateIssue("story_point", e.target.value)
                }
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
                  userId={selectedIssue?.reporter_id || ""}
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
      <ActivitySection issueId={selectedIssue?.id || ""} />
    </div>
  );
};

export default IssueSideBar;
