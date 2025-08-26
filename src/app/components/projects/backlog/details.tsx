import { useState } from "react";
import UserAvatar from "../../general-components/user/userAvatar";
import { FaChevronRight } from "react-icons/fa";
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
import CustomInput from "./customInput";
import CustomDatePicker from "../../general-components/customDatePicker";

const Details = ({
  projectId,
  selectedIssue,
  sprints,
  handleUpdateIssue,
}: {
  projectId: string;
  selectedIssue: IIssue;
  sprints: ISprint[];
  handleUpdateIssue: (key: string, value: any) => void;
}) => {
  const { projectMembers } = useProjectMembers(projectId);
  const { columns } = useProjectColumns(projectId);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

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

  return (
    <div className="rounded-xs border-1 border-gray-300">
      <div
        className="flex cursor-pointer items-center rounded-xs border-2 border-transparent p-2 hover:bg-gray-200 active:border-emerald-500"
        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="text-gray-500 hover:text-gray-700">
            {isDetailsOpen ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          <p className="text-sm font-bold text-gray-600">Details</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-gray-500 hover:text-gray-700">
            <CiSettings className="text-xl" />
          </div>
        </div>
      </div>
      {isDetailsOpen && (
        <div className="flex flex-col space-y-6 p-4">
          {/* Assignee Selection */}
          <div className="flex items-center">
            <span className="min-w-[35%] text-xs font-semibold text-gray-700">
              Assignee
            </span>
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

          {/* Sprint */}
          <div className="flex items-center">
            <span className="min-w-[35%] text-xs font-semibold text-gray-700">
              Sprint
            </span>
            <SprintDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              currentSprint={
                sprints.find(
                  (sprint) => sprint.id === selectedIssue.sprint_id,
                ) || sprints[0]
              }
            />
          </div>

          {/* Priority */}
          <div className="flex items-center">
            <span className="min-w-[35%] text-xs font-semibold text-gray-700">
              Priority
            </span>
            <PriorityDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              priority={selectedIssue.priority}
            />
          </div>

          {/* Type */}
          <div className="flex items-center">
            <span className="min-w-[35%] text-xs font-semibold text-gray-700">
              Type
            </span>
            <TypeDropdown
              projectId={projectId}
              issueId={selectedIssue.id}
              type={selectedIssue.type}
            />
          </div>

          {/* Due Date to Complete */}
          <div className="flex items-center">
            <span className="min-w-[35%] text-xs font-semibold text-gray-700">
              Due Date To
            </span>
            <CustomDatePicker
              field="due_date_to"
              issue={selectedIssue}
              projectId={projectId}
            />
          </div>
          {/* Status/Column */}
          <div className="flex items-center">
            <span className="min-w-[35%] text-xs font-semibold text-gray-700">
              Status
            </span>
            <div className="">
              <StatusDropdown
                projectId={projectId}
                issueId={selectedIssue.id}
                column={
                  columns.find((col) => col.id === selectedIssue.column.id) ||
                  columns[0]
                }
              />
            </div>
          </div>

          {/* Story Points */}
          <div className="flex items-center">
            <span className="min-w-[35%] text-xs font-semibold text-gray-700">
              Story Points
            </span>
            <CustomInput
              field="story_point"
              value={selectedIssue.story_point}
              handleUpdateIssue={handleUpdateIssue}
            />
          </div>
          {/* Reporter */}
          <div className="flex items-center">
            <span className="min-w-[35%] text-xs font-semibold text-gray-700">
              Reporter
            </span>
            <div className="flex items-center gap-2">
              <UserAvatar
                userId={selectedIssue?.reporter_id || ""}
                size={24}
                isDisplayName={true}
              />
            </div>
          </div>
          {/* Parent */}
          <div className="flex items-center">
            <span className="min-w-[35%] text-xs font-semibold text-gray-700">
              Parent
            </span>
            <span className="text-sm text-gray-800">{details.parent.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
