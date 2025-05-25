import { Dropdown } from "antd";
import { IoIosClose } from "react-icons/io";
import { ISprint } from "@libs/types";
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import { DatePicker } from "antd";
import { useProjectColumns } from "@libs/hooks/useProject";
import { FiltersSearchParams } from "@libs/utils/parseFiltersSearchParams";
import { MoveRight } from "lucide-react";
import RenderStatusCell from "../common/RenderStatusCell";
import dayjs from "dayjs";
import { FaChevronDown } from "react-icons/fa";

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

  const ListFilterDropdownHeader = ({
    title,
    listFilterKey,
  }: {
    title: string;
    listFilterKey: keyof typeof filters;
  }) => {
    return (
      <div className="flex w-full items-center justify-between py-2">
        <h1 className="text-sm font-bold text-black">{title}</h1>
        {filters[listFilterKey] && filters[listFilterKey].length > 0 && (
          <IoIosClose
            size={20}
            className="cursor-pointer text-gray-500 transition-all duration-100 hover:scale-125"
            onClick={() =>
              handleFilterChange(listFilterKey, {
                [listFilterKey]: [],
              })
            }
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      <Dropdown
        dropdownRender={() => (
          <div className="z-50 w-96 flex-col rounded-xs bg-white shadow-2xl">
            <div className="flex w-full items-center justify-between px-4 py-2 shadow-2xl">
              <h1 className="text-lg font-bold text-gray-800">Filters</h1>
            </div>
            <div className="flex max-h-60 flex-col gap-6 overflow-y-auto p-4">
              {/* Status Section */}
              <div className="flex flex-col gap-1">
                <ListFilterDropdownHeader
                  title="Status"
                  listFilterKey="column_ids"
                />
                <div className="flex flex-wrap gap-2">
                  {columns?.map((column) => (
                    <div
                      key={column.id}
                      onClick={() =>
                        handleFilterChange("column_ids", {
                          column_ids: filters.column_ids.includes(column.id)
                            ? filters.column_ids.filter(
                                (id) => id !== column.id,
                              )
                            : [...filters.column_ids, column.id],
                        })
                      }
                      className={`${
                        filters.column_ids.includes(column.id)
                          ? "bg-gray-300"
                          : "hover:bg-gray-50"
                      } flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-1`}
                    >
                      <input
                        type="checkbox"
                        className="rounded text-emerald-500"
                        checked={filters.column_ids.includes(column.id)}
                        onClick={(e) => e.preventDefault()}
                        onChange={() => {}}
                      />
                      <RenderStatusCell column={column} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sprint Section */}
              <div className="flex flex-col gap-1">
                <ListFilterDropdownHeader
                  title="Sprint"
                  listFilterKey="sprint_ids"
                />
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
                      className={`${filters.sprint_ids.includes(sprint.id) ? "bg-gray-300" : "hover:bg-gray-200"} cursor-pointer rounded-full bg-gray-50 px-3 py-1 text-sm`}
                    >
                      {sprint.name}
                    </div>
                  ))}
                </div>
              </div>

              {/*Created Date */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-black">Created Date</p>
                <div className="flex flex-row items-end justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-700">From</p>
                    <DatePicker
                      // value={dayjs(filters.created_at[0])}
                      onChange={(date) => {
                        handleFilterChange("created_at", {
                          created_at: [
                            dayjs(date).format("YYYY-MM-DD"),
                            filters.created_at[1],
                          ],
                        });
                      }}
                    />
                  </div>
                  <MoveRight className="pb-3 text-gray-500" size={28} />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-700">To</p>
                    <DatePicker
                      // value={dayjs(filters.created_at[1])}
                      onChange={(date) => {
                        handleFilterChange("created_at", {
                          created_at: [
                            filters.created_at[0],
                            dayjs(date).format("YYYY-MM-DD"),
                          ],
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Assignee */}
              <div className="flex flex-col gap-1">
                <ListFilterDropdownHeader
                  title="Assignee"
                  listFilterKey="assignee_ids"
                />
                <div className="flex flex-row flex-wrap items-center gap-[2px]">
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
                      className={`cursor-pointer rounded-full border-2 p-[1px] ${filters.assignee_ids.includes(member.user_id) ? "border-emerald-500" : "border-transparent"} hover:border-emerald-500`}
                    >
                      <UserAvatar
                        userId={member.user_id}
                        size={32}
                        isDisplayName={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/*Date range */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-black">Date Range</p>
                <div className="flex flex-row items-end justify-between">
                  <div className="flex flex-col">
                    <p>Start Date</p>
                    <DatePicker />
                  </div>

                  <MoveRight className="pb-3 text-gray-500" size={28} />
                  <div className="flex flex-col">
                    <p>End Date</p>
                    <DatePicker />
                  </div>
                </div>
              </div>

              {/* Reporter */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-black">Reporter</p>
                <div className="flex flex-row flex-wrap items-center gap-[2px]">
                  {projectMembers?.map((member) => (
                    <div
                      key={member.user_id}
                      className={`cursor-pointer rounded-full border-2 border-transparent p-[1px] hover:z-50 hover:border-emerald-500`}
                    >
                      <UserAvatar
                        userId={member.user_id}
                        size={32}
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
        <div>
          <div className="cursor-pointer rounded bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-600">
            Filter <FaChevronDown className="ml-1 inline" />
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default ListFilterDropDown;
