import { Dropdown } from "antd";
import { IoIosClose } from "react-icons/io";
import { IssueStatus } from "@libs/types/issue";
import { ISprint } from "@libs/types";
import UserAvatar from "@libs/app/components/general-components/user/UserAvatar";
import { useProjectSprints } from "@libs/hooks/useSprint";
import { useProjectMembers } from "@libs/hooks/useProjectMember";
import { FaChevronDown } from "react-icons/fa";
import { DatePicker } from "antd";
const ListFilterDropDown = ({
  filters,
  handleFilterChange,
  projectId,
  onSprintSelect,
}: {
  filters: {
    status: IssueStatus[];
    sprint: string[];
    assignee: string[];
    reporter: string[];
  };
  handleFilterChange: (
    key: keyof typeof filters,
    value: Partial<typeof filters>,
  ) => void;
  projectId: string;
  onSprintSelect?: (sprintId: string) => void;
}) => {
  const { sprints } = useProjectSprints(projectId);
  const { projectMembers } = useProjectMembers(projectId);

  return (
    <div className="flex items-center space-x-1">
      <Dropdown
        dropdownRender={() => (
          <div className="flex flex-col gap-8 rounded-lg bg-white p-4 shadow-lg">
            {/* Status Section */}
            <div className="flex flex-col gap-2">
              <p className="flex items-center gap-2">
                <div className="text-sm font-medium text-gray-700">Status</div>
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
              </p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <div
                    key={status.key}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-1 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="rounded text-emerald-500"
                      checked={filters.status.includes(
                        status.key as IssueStatus,
                      )}
                      onChange={() =>
                        handleFilterChange("status", {
                          status: filters.status.includes(
                            status.key as IssueStatus,
                          )
                            ? filters.status.filter(
                                (s) => s !== (status.key as IssueStatus),
                              )
                            : [...filters.status, status.key as IssueStatus],
                        })
                      }
                    />
                    {renderStatusCell(status.key as IssueStatus)}
                  </div>
                ))}
              </div>
            </div>

            {/* Sprint Section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">Sprint</p>
                {filters.sprint.length > 0 && (
                  <IoIosClose
                    size={20}
                    className="cursor-pointer text-gray-500 transition-all duration-100 hover:scale-125"
                    onClick={() =>
                      handleFilterChange("sprint", {
                        sprint: [],
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
                      const newSprintIds = filters.sprint.includes(sprint.id)
                        ? filters.sprint.filter((s) => s !== sprint.id)
                        : [...filters.sprint, sprint.id];
                      handleFilterChange("sprint", {
                        sprint: newSprintIds,
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
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Created Date</p>
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
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Assignee</p>
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

            {/*Date range */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Date Range</p>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <p>Start Date</p>
                  <DatePicker />
                </div>
                <div className="flex flex-col">
                  <p>End Date</p>
                  <DatePicker />
                </div>
              </div>
            </div>

            {/* Reporter */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Assignee</p>
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

const renderStatusCell = (status: IssueStatus) => {
  return (
    <button
      className={`rounded-xl px-2 py-1 text-xs hover:cursor-pointer ${
        statusOptions.find((option) => option.key === status)?.bgColor
      } group-hover:bg-none`}
    >
      <p
        className={`text-xs ${statusOptions.find((option) => option.key === status)?.textColor} text-center font-bold`}
      >
        {status ? status.toUpperCase() : "-"}
      </p>
    </button>
  );
};

const statusOptions = [
  {
    label: "TO DO",
    key: "TO DO",
    order: 1,
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  {
    label: "IN PROGRESS",
    key: "IN PROGRESS",
    order: 2,
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  {
    label: "DONE",
    key: "DONE",
    order: 3,
    textColor: "text-green-700",
    bgColor: "bg-green-100",
  },
];
