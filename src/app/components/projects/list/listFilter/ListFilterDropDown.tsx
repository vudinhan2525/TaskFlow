import { Dropdown } from "antd";
import { IoIosClose } from "react-icons/io";
import { IssueStatus } from "@libs/types/issue";
import { ISprint } from "@libs/types";
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import { FaChevronDown } from "react-icons/fa";
import { DatePicker } from "antd";
import { useProjectColumns } from "@libs/hooks/useProject";
import { FiltersSearchParams } from "@libs/utils/parseFiltersSearchParams";
import { MoveRight } from "lucide-react";
import RenderStatusCell from "../common/RenderStatusCell";
const ListFilterDropDown = ({
  filters,
  handleFilterChange,
  projectId,
  onSprintSelect,
}: {
  filters: FiltersSearchParams;
  handleFilterChange: (
    key: keyof typeof filters,
    value: Partial<typeof filters>,
  ) => void;
  projectId: string;
  onSprintSelect?: (sprintId: string) => void;
}) => {
  const { sprints } = useProjectSprints(projectId);
  const { projectMembers } = useProjectMembers(projectId);
  const { columns } = useProjectColumns(projectId);
  return (
    <div className="flex items-center space-x-1">
      <Dropdown
        dropdownRender={() => (
          <div className="z-50 flex-col rounded-xs bg-white shadow-2xl">
            <div className="flex w-full items-center justify-between px-4 py-2 shadow-2xl">
              <h1 className="text-sm font-medium text-gray-700">Filters</h1>
            </div>
            <div className="flex max-h-60 flex-col gap-6 overflow-y-auto p-4">
              {/* Status Section */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  {filters.status.length > 0 && (
                    <IoIosClose
                      size={20}
                      className="cursor-pointer text-gray-500 transition-all duration-100 hover:scale-125"
                      onClick={() =>
                        handleFilterChange("status", {
                          status: [],
                        })
                      }
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {columns?.map((column) => (
                    <div
                      key={column.id}
                      className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-1 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        className="rounded text-emerald-500"
                        checked={filters.status.includes(
                          column.name as IssueStatus,
                        )}
                        onChange={() =>
                          handleFilterChange("status", {
                            status: filters.status.includes(
                              column.name as IssueStatus,
                            )
                              ? filters.status.filter(
                                  (s) => s !== (column.name as IssueStatus),
                                )
                              : [...filters.status, column.name as IssueStatus],
                          })
                        }
                      />
                      <RenderStatusCell column={column} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sprint Section */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-700">Sprint</p>
                  {filters.sprint_ids.length > 0 && (
                    <IoIosClose
                      size={20}
                      className="cursor-pointer text-gray-500 transition-all duration-100 hover:scale-125"
                      onClick={() =>
                        handleFilterChange("sprint_ids", {
                          sprint_ids: [],
                        })
                      }
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sprints?.map((sprint: ISprint) => (
                    <div
                      key={sprint.id}
                      onClick={() => {
                        const newSprintIds = filters.sprint_ids.includes(
                          sprint.id,
                        )
                          ? filters.sprint_ids.filter((s) => s !== sprint.id)
                          : [...filters.sprint_ids, sprint.id];
                        handleFilterChange("sprint_ids", {
                          sprint_ids: newSprintIds,
                        });

                        if (newSprintIds.length === 1) {
                          onSprintSelect?.(newSprintIds[0]);
                        } else {
                          onSprintSelect?.("");
                        }
                      }}
                      className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                    >
                      {sprint.name}
                    </div>
                  ))}
                </div>
              </div>

              {/*Created Date */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">
                  Created Date
                </p>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <p>From</p>
                    <DatePicker />
                  </div>
                  <div className="flex flex-col">
                    <p>To</p>
                    <DatePicker />
                  </div>
                </div>
              </div>

              {/* Assignee */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-700">Assignee</p>
                  {filters.assignee_ids.length > 0 && (
                    <IoIosClose
                      size={20}
                      className="cursor-pointer text-gray-500 transition-all duration-100 hover:scale-125"
                      onClick={() =>
                        handleFilterChange("assignee_ids", {
                          assignee_ids: [],
                        })
                      }
                    />
                  )}
                </div>
                <div className="flex flex-row flex-wrap items-center gap-1">
                  {projectMembers?.map((member) => (
                    <div
                      onClick={() => {
                        handleFilterChange("assignee_ids", {
                          assignee_ids: filters.assignee_ids.includes(
                            member.user_id,
                          )
                            ? filters.assignee_ids.filter(
                                (s) => s !== member.user_id,
                              )
                            : [...filters.assignee_ids, member.user_id],
                        });
                      }}
                      key={member.user_id}
                      className={`cursor-pointer rounded-full border-2 border-transparent p-[1px] ${filters.assignee_ids.includes(member.user_id) ? "border-emerald-500 text-blue-500" : "border-transparent"} hover:z-50 hover:border-emerald-500`}
                    >
                      <UserAvatar
                        userId={member.user_id}
                        size={28}
                        isDisplayName={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/*Date range */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">Date Range</p>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-col">
                    <p>Start Date</p>
                    <DatePicker />
                  </div>
                  <MoveRight className="h-6 w-6" />
                  <div className="flex flex-col">
                    <p>End Date</p>
                    <DatePicker />
                  </div>
                </div>
              </div>

              {/* Reporter */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">Reporter</p>
                <div className="flex flex-row flex-wrap items-center gap-1">
                  {projectMembers?.map((member) => (
                    <div
                      key={member.user_id}
                      className={`cursor-pointer rounded-full border-2 border-transparent p-[1px] hover:z-50 hover:border-emerald-500`}
                    >
                      <UserAvatar
                        userId={member.user_id}
                        size={28}
                        isDisplayName={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        trigger={["click"]}
      >
        <button className="cursor-pointer rounded bg-emerald-500 px-3 py-2 text-sm text-white hover:bg-emerald-600">
          Filter <FaChevronDown className="ml-1 inline" />
        </button>
      </Dropdown>
    </div>
  );
};

export default ListFilterDropDown;

