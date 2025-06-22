import { useState } from "react";
import UserAvatar from "../../general-components/user/UserAvatar";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Dropdown } from "antd";
import { ISprint } from "@libs/types";
import { IIssue } from "@libs/types/issue";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import { useProjectColumns } from "@libs/hooks/useProject";
import { CiSettings } from "react-icons/ci";
import {
  StatusDropdown,
  PriorityDropdown,
  TypeDropdown,
  SprintDropdown,
} from "../../general-components/dropdown/index";

const Details = ({
  projectId,
  selectedIssue,
  sprints,
  handleUpdateIssue,
}: {
  projectId: string;
  selectedIssue: IIssue;
  sprints: ISprint[];
  handleUpdateIssue: (key: string, value: string) => void;
}) => {
  const { projectMembers } = useProjectMembers(projectId);
  const { columns } = useProjectColumns(projectId);
  const details = {
    assignee: {
      initials: selectedIssue.assignee_id
        ? selectedIssue.assignee_id.substring(0, 2).toUpperCase()
        : "NA",
      name: selectedIssue.assignee_id || "Unassigned",
    },
    summary: selectedIssue.summary || "No summary provided",
    sprint:
      sprints?.find((s: ISprint) => s.id === selectedIssue.sprint_id)?.name ||
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

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="rounded-xs border-1 border-gray-300">
      <div
        className="flex cursor-pointer items-center justify-between rounded-xs border-2 border-transparent p-2 hover:bg-gray-200 active:border-emerald-500"
        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
      >
        <p className="text-sm font-bold text-gray-600">Details</p>
        <div className="flex items-center gap-2">
          <div className="text-gray-500 hover:text-gray-700">
            <CiSettings className="text-xl" />
          </div>
          <div className="text-gray-500 hover:text-gray-700">
            {isDetailsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
      </div>
      {isDetailsOpen && (
        <div className="flex flex-col gap-2 p-2">
          {/* Labels */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Labels</span>
            <input
              type="text"
              value={selectedIssue.labels?.join(", ") || ""}
              onChange={(e) =>
                handleUpdateIssue(
                  "labels",
                  JSON.stringify(
                    e.target.value.split(",").map((l) => l.trim()),
                  ),
                )
              }
              className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="Comma separated"
            />
          </div>

          {/* Sprint */}
          <SprintDropdown
            projectId={projectId}
            issueId={selectedIssue.id}
            currentSprint={
              sprints.find((sprint) => sprint.id === selectedIssue.sprint_id) ||
              sprints[0]
            }
          />

          {/* Priority */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Priority</span>
            <PriorityDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              priority={selectedIssue.priority}
            />
          </div>

          {/* Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Type</span>
            <TypeDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              type={selectedIssue.type}
            />
          </div>

          {/* Status/Column */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <StatusDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              column={
                columns.find((col) => col.id === selectedIssue.column.id) ||
                columns[0]
              }
            />
          </div>

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

          {/* Team Selection */}
          <div className="flex items-center justify-between">
            <span className="w-1/3 text-sm text-gray-600">Team</span>
            <select
              value={selectedIssue?.team_id || ""}
              onChange={(e) => handleUpdateIssue("team_id", e.target.value)}
              className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
              disabled={!!selectedIssue?.parent_id}
            >
              <option value="">Select Team</option>
            </select>
          </div>

          {/* Story Points */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Story Points</span>
            <input
              type="number"
              value={details.storyPoint}
              onChange={(e) => handleUpdateIssue("story_point", e.target.value)}
              min="0"
              className="w-2/3 rounded border border-gray-300 px-2 py-1 text-sm"
            />
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
            <span className="text-sm text-gray-800">{details.parent.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
